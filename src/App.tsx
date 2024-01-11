import { Show, createEffect, createResource, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

import Navbar from "./components/Navbar";
import TaskModal from "./components/TaskModal";
import TaskList from "./components/TaskList";

import { TaskI } from "./types/TaskI";
import { PresetI } from "./types/PresetI";
import PresetModal from "./components/PresetModal";

const fetchAllTasks = async () => await invoke("get_all_tasks");
const fetchAllPresets = async () => await invoke("get_all_presets");

function App() {
    const [selectedTask, setSelectedTask] = createStore<TaskI>({
        id: 1,
        name: "Your nice taskname",
        description: "Your awesome task description",
        color: "#123456",
        start_date: new Date().toString(),
        end_date: new Date().toString(),
    } as TaskI);

    const [presets] = createResource(fetchAllPresets);
    const [tasks] = createResource(fetchAllTasks);
    const [filteredTasks, setFilteredTasks] = createSignal<Array<TaskI>>([]);
    const [isFiltered, setIsFiltered] = createSignal(false);

    createEffect(() => {
        if (tasks() && (tasks() as Array<TaskI>).length > 0) {
            setNewTaskId();
        }
    });

    let taskModal: HTMLDialogElement;

    function setNewTaskId(): void {
        const newTaskId = (tasks() as Array<TaskI>).reduce((acc, task) => {
            if (task.id > acc) {
                return task.id + 1;
            }
            return acc;
        }, 0);

        setSelectedTask("id", newTaskId + 1);
    }

    function editTask(task: TaskI): void {
        setSelectedTask(task);
        taskModal.showModal();
    }

    function applyFilter(filter: String): void {
        if (filter === "") {
            setFilteredTasks([]);
            setIsFiltered(false);
            return;
        }
        setIsFiltered(true);

        if (filter.startsWith("date: ")) {
            const date = new Date(filter.split("date: ")[1]);
            date.setHours(0, 0, 0, 0);

            const filtered = (tasks() as Array<TaskI>).filter((task) => {
                const taskDate = new Date(task.start_date);
                taskDate.setHours(0, 0, 0, 0);
                return taskDate.getTime() === date.getTime();
            });
            setFilteredTasks(filtered);
            return;
        }

        const filtered = (tasks() as Array<TaskI>).filter((task) =>
            task.name.toLowerCase().includes(filter.toLowerCase())
        );
        setFilteredTasks(filtered);
    }

    return (
        <div>
            <Navbar filterCall={applyFilter} />
            <TaskModal
                task={selectedTask}
                presets={presets() as Array<PresetI>}
                ref={taskModal}
            />
            <Show when={presets()}>
                <PresetModal presets={presets() as Array<PresetI>} />
            </Show>
            <Show when={tasks()}>
                <TaskList
                    tasks={
                        isFiltered()
                            ? filteredTasks()
                            : (tasks() as Array<TaskI>)
                    }
                    editTaskCall={editTask}
                    isFiltered={isFiltered()}
                />
            </Show>
            <Show when={isFiltered() && filteredTasks().length == 0}>
                <div role="alert" class="alert alert-info mt-3">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="stroke-current shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>
                        Couldn't find any task with the current search term!{" "}
                        <br />
                        <b>Tip:</b> Search for 'date: YYYY-MM-DD' to filter by
                        date
                    </span>
                </div>
            </Show>
        </div>
    );
}

export default App;
