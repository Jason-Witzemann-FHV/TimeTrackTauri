import { Show, createResource, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";

import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

import Navbar from "./components/Navbar";
import TaskModal from "./components/TaskModal";
import TaskList from "./components/TaskList";

import { TaskI } from "./types/TaskI";
import { PresetI } from "./types/PresetI";

const fetchAllTasks = async () => await invoke("get_all_tasks");
const fetchAllPresets = async () => await invoke("get_all_presets");

function App() {
    const [selectedTask, setSelectedTask] = createStore<TaskI>({
        id: -1,
        name: "Your nice taskname",
        description: "Your awesome task description",
        color: "#123456",
        start_date: new Date().valueOf() + 3600000,
        end_date: new Date().valueOf() + 3600000 * 2,
    } as TaskI);

    const [presets] = createResource(fetchAllPresets);
    const [tasks] = createResource(fetchAllTasks);
    const [filteredTasks, setFilteredTasks] = createSignal<Array<TaskI>>();

    let taskModal: HTMLDialogElement;

    function editTask(task: TaskI): void {
        setSelectedTask(task);
        taskModal.showModal();
    }

    function applyFilter(filter: string): void {
        if (filter === "") {
            setFilteredTasks(tasks() as Array<TaskI>);
            return;
        }

        const filtered = (tasks() as Array<TaskI>).filter((task) =>
            task.name.toLowerCase().includes(filter.toLowerCase())
        );
        console.log(filtered);
        setFilteredTasks(filtered);
    }

    return (
        <div>
            <Navbar filterCall={applyFilter}/>
            <TaskModal
                task={selectedTask}
                presets={presets() as Array<PresetI>}
                ref={taskModal}
            />
            <Show when={(tasks() as Array<TaskI>)?.length > 0}>
                <TaskList
                    tasks={filteredTasks()?.length > 0 ? filteredTasks() : tasks() as Array<TaskI>}
                    editTaskCall={editTask}
                />
            </Show>
        </div>
    );
}

export default App;
