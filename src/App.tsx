import { createResource, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

import Navbar from "./components/Navbar";
import TaskModal from "./components/TaskModal";

import { Task } from "./types/Task";
import { Preset } from "./types/Preset";

const fetchAllTasks = async () => await invoke("get_all_tasks");
const fetchAllPresets = async () => await invoke("get_all_presets");

function App() {
    const [selectedTask, setSelectedTask] = createStore({
        id: -1,
        name: "Your nice taskname",
        description: "Your awesome task description",
        color: "#123456",
        start_date: new Date().valueOf() + 3600000,
        end_date: new Date().valueOf() + 3600000 * 2,
    } as Task);

    const [presets] = createResource(fetchAllPresets);
    const [tasks] = createResource(fetchAllTasks);

    return (
        <div>
            <Navbar />
            <TaskModal
                loadedTask={selectedTask}
                presets={presets() as Array<Preset>}
            />
            <h1>Welcome to Tauri!</h1>
        </div>
    );
}

export default App;
