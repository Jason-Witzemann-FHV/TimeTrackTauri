import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import logo from "./assets/logo.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

import Navbar from "./components/Navbar";
import TaskModal from "./components/TaskModal";


function App() {
    const [greetMsg, setGreetMsg] = createSignal("");
    const [name, setName] = createSignal("");
    const [state, setState] = createStore({ taskId: -1 } as State);

    async function greet() {
        // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
        setGreetMsg(await invoke("greet", { name: name() }));
    }

    return (
        <div>
            <Navbar />
            <TaskModal taskId={state.taskId}/>
            <h1>Welcome to Tauri!</h1>

            <div class="row">
                <a href="https://vitejs.dev" target="_blank">
                    <img src="/vite.svg" class="logo vite" alt="Vite logo" />
                </a>
                <a href="https://tauri.app" target="_blank">
                    <img src="/tauri.svg" class="logo tauri" alt="Tauri logo" />
                </a>
                <a href="https://solidjs.com" target="_blank">
                    <img src={logo} class="logo solid" alt="Solid logo" />
                </a>
            </div>

            <p>Click on the Tauri, Vite, and Solid logos to learn more.</p>
            <button onClick={() => setState("taskId", 0)}>Load Fake existing Task</button>
            <form
                class="row"
                onSubmit={(e) => {
                    e.preventDefault();
                    greet();
                }}
            >
                <input
                    id="greet-input"
                    onChange={(e) => setName(e.currentTarget.value)}
                    placeholder="Enter a name..."
                />
                <button type="submit">Greet</button>
            </form>
            <p>{greetMsg()}</p>
        </div>
    );
} 

export default App;
