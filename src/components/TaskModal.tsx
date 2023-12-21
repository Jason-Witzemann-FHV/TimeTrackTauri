import { For } from "solid-js";
import { createStore } from "solid-js/store";

import "./TaskModal.css";
import { TaskI } from "../types/TaskI";
import { TaskModalI } from "../types/TaskModalI";
import { PresetI } from "../types/PresetI";
import { invoke } from "@tauri-apps/api";

function TaskModal(props: TaskModalI) {
    const [task, setTask] = createStore<TaskI>(props.task);

    function applyPreset(preset: PresetI) {
        setTask("color", preset.color);
        setTask("name", preset.name);
    }

    async function submitForm(): Promise<void> {
        await invoke("save_task", { task: task });
    }

    return (
        <dialog id="newTaskModal" class="modal">
            <form onSubmit={submitForm} class="modal-box">
                <h3 class="font-bold text-lg">
                    {task.id === -1 ? "Create new task" : "Edit task"}
                </h3>
                <div class="flex flex-row">
                    <label class="form-control">
                        <div class="label">
                            <span class="label-text">Task Name</span>
                        </div>
                        <input
                            type="text"
                            class="input input-bordered w-11/12"
                            value={task.name}
                            onInput={(e) => setTask("name", e.target.value)}
                        />
                    </label>
                    <label class="form-control w-1/2">
                        <div class="label">
                            <span class="label-text">Color</span>
                        </div>
                        <div class="color-input-wrapper">
                            <input
                                type="color"
                                value={task.color}
                                onInput={(e) =>
                                    setTask("color", e.target.value)
                                }
                            />
                        </div>
                    </label>
                </div>

                <div class="flex flex-row mt-3 flex-wrap">
                    <For each={props.presets}>
                        {(preset) => (
                            <div
                                class="badge me-2 preset-badge"
                                style={"background-color: " + preset.color}
                                onClick={() => applyPreset(preset)}
                            >
                                {preset.name}
                            </div>
                        )}
                    </For>
                </div>
                <div class="flex flex-row">
                    <label class="form-control">
                        <div class="label">
                            <span class="label-text">From</span>
                        </div>
                        <input
                            type="datetime-local"
                            class="input input-bordered w-11/12"
                            value={new Date(task.start_date)
                                .toISOString()
                                .slice(0, 16)}
                            onInput={(e) =>
                                setTask(
                                    "start_date",
                                    new Date(e.target.value).valueOf()
                                )
                            }
                        />
                    </label>
                    <label class="form-control">
                        <div class="label">
                            <span class="label-text">Until</span>
                        </div>
                        <input
                            type="datetime-local"
                            class="input input-bordered w-11/12"
                            value={new Date(task.end_date)
                                .toISOString()
                                .slice(0, 16)}
                            onInput={(e) =>
                                setTask(
                                    "end_date",
                                    new Date(e.target.value).valueOf()
                                )
                            }
                        />
                    </label>
                </div>
                <label class="form-control">
                    <div class="label">
                        <span class="label-text">Description</span>
                    </div>
                    <textarea
                        class="textarea textarea-bordered h-24"
                        value={task.description}
                        onInput={(e) => setTask("description", e.target.value)}
                    ></textarea>
                </label>

                <div class="modal-action">
                    <button class="btn">Close</button>
                    <button type="submit" class="btn">
                        Save
                    </button>
                </div>
            </form>
        </dialog>
    );
}

export default TaskModal;
