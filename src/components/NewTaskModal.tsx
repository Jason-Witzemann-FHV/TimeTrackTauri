import { createStore } from "solid-js/store";

function NewTaskModal() {
    const [fields, setFields] = createStore();

    const submitForm = () => {
        // form.submit()
        console.log("Done");
    };

    return (
        <dialog id="newTaskModal" class="modal">
            <form onSubmit={submitForm}>
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Create new Task</h3>
                    <label class="form-control">
                        <div class="label">
                            <span class="label-text">Task Name</span>
                        </div>
                        <input
                            type="text"
                            class="input input-bordered"
                            onInput={(e) => setFields("name", e.target.value)}
                        />
                    </label>
                    <div class="flex flex-row mt-3">
                        <div class="badge badge-primary">Preset 1</div>
                        <div class="badge badge-primary">Preset 2</div>
                    </div>
                    <div class="flex flex-row">
                        <label class="form-control">
                            <div class="label">
                                <span class="label-text">From</span>
                            </div>
                            <input
                                type="text"
                                class="input input-bordered w-2/3"
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
                                type="text"
                                class="input input-bordered w-2/3"
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
                </div>
            </form>
        </dialog>
    );
}

export default NewTaskModal;
