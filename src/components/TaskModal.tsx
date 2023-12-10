import { createEffect, createSignal, For } from "solid-js";
import { createStore } from "solid-js/store";

import "./TaskModal.css";

function TaskModal(props: TaskModalI) {
    const [task, setTask] = createStore<Task>(loadTaskValues(props.taskId));

    const [presets, setPresets] = createSignal([
        { name: "Preset 1", color: "#5534eb" },
        { name: "Preset 2", color: "#3fed13" },
    ] as PresetI[]);

    createEffect(() => {
        setTask(loadTaskValues(props.taskId));
    });

    function loadTaskValues(id: number): Task {
        if (id === -1) {
            return {
                id: -1,
                name: "",
                color: "#000000",
                startDate: new Date(),
                endDate: new Date(),
                description: "",
            } as Task;;
        }
        //TODO: Replace with rust sql call
        return {
            id: id,
            name: "Test Task",
            color: "#CA3DD9",
            startDate: new Date("2022-12-31"),
            endDate: new Date("2022-12-31"),
            description: "This is a test task",
        } as Task;
    };

    function applyPreset(preset: PresetI) {
        setTask("color", preset.color);
        setTask("name", preset.name);
    };

    function submitForm(): void {
        //TODO: Implement rust sql call to save new task
        console.log(task);
    };

    return (
        <dialog id="newTaskModal" class="modal">
            <form onSubmit={submitForm} class="modal-box">
                <h3 class="font-bold text-lg">{props.taskId === -1 ? "Create new task" : "Edit task"}</h3>
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

                <div class="flex flex-row mt-3">
                    <For each={presets()}>
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
                            value={task.startDate.toISOString().slice(0, 16)}
                            onInput={(e) =>
                                setTask("startDate", new Date(e.target.value))
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
                            value={task.endDate.toISOString().slice(0, 16)}
                            onInput={(e) =>
                                setTask("endDate", new Date(e.target.value))
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
                    <button type="submit" class="btn">Save</button>
                </div>
            </form>
        </dialog>
    );
}

export default TaskModal;
