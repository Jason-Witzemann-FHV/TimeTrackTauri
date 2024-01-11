import { For, Show } from "solid-js";
import { createStore } from "solid-js/store";

import "../App.css";
import { TaskI } from "../types/TaskI";
import { TaskModalI } from "../types/TaskModalI";
import { PresetI } from "../types/PresetI";
import { invoke } from "@tauri-apps/api";
import moment from "moment";
import dayjs from "dayjs";

function TaskModal(props: TaskModalI) {
    const [task, setTask] = createStore<TaskI>(props.task);

    function applyPreset(preset: PresetI) {
        setTask("color", preset.color);
        setTask("name", preset.name);
    }

    async function submitForm(e: Event): Promise<void> {
        await invoke("save_task", { task: task });
    }

    return (
        <dialog id="newTaskModal" class="modal" ref={props.ref}>
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
                            value={dayjs(task.start_date).format(
                                "YYYY-MM-DDThh:mm"
                            )}
                            onFocusOut={(e) =>
                                setTask(
                                    "start_date",
                                    new Date(e.target.value).toString()
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
                            value={dayjs(task.end_date).format(
                                "YYYY-MM-DDThh:mm"
                            )}
                            onFocusOut={(e) =>
                                setTask(
                                    "end_date",
                                    new Date(e.target.value).toString()
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
                <Show
                    when={new Date(task.start_date) > new Date(task.end_date)}
                >
                    <div role="alert" class="alert alert-error mt-2">
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
                        <span>Start date must be before end date!</span>
                    </div>
                </Show>
                <div class="modal-action">
                    <div class="btn" onClick={() => location.reload()}>
                        Close
                    </div>
                    <button
                        class="btn"
                        type="submit"
                        disabled={
                            new Date(task.start_date) > new Date(task.end_date)
                        }
                    >
                        Save
                    </button>
                </div>
            </form>
        </dialog>
    );
}

export default TaskModal;
