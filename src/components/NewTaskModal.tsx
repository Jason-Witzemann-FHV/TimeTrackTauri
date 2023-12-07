import { createStore } from "solid-js/store";
import { createSignal, For } from "solid-js";

function NewTaskModal() {
    const [fields, setFields] = createStore();

    const [presets, setPresets] = createSignal([
        { name: "Preset 1", color: "#5534eb" },
        { name: "Preset 2", color: "#3fed13" },
    ]);

    const submitForm = () => {
        // form.submit()
        console.log("Done");
    };

    return (
        <dialog id="newTaskModal" class="modal">
            <form onSubmit={submitForm} class="modal-box">
                <h3 class="font-bold text-lg">Create new Task</h3>
                <div class="flex flex-row">
                    <label class="form-control">
                        <div class="label">
                            <span class="label-text">Task Name</span>
                        </div>
                        <input
                            type="text"
                            class="input input-bordered w-11/12"
                            onInput={(e) => setFields("name", e.target.value)}
                        />
                    </label>
                    <label class="form-control w-1/2">
                        <div class="label">
                            <span class="label-text">Farbe</span>
                        </div>
                        <input
                            type="color"
                            class="input input-bordered h-full"
                            onInput={(e) => setFields("color", e.target.value)}
                        />
                    </label>
                </div>

                <div class="flex flex-row mt-3">
                    <For each={presets()}>
                        {(preset, i) => (
                            <div
                                class="badge me-2"
                                style={"background-color: " + preset.color}
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
                            onInput={(e) =>
                                setFields("startDate", e.target.value)
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
                            onInput={(e) =>
                                setFields("endDate", e.target.value)
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
                        onInput={(e) =>
                            setFields("description", e.target.value)
                        }
                    ></textarea>
                </label>

                <div class="modal-action">
                    <button class="btn">Close</button>
                    <button type="submit" class="btn">
                        Create
                    </button>
                </div>
            </form>
        </dialog>
    );
}

export default NewTaskModal;
