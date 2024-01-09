import { Index } from "solid-js";
import { createStore } from "solid-js/store";

import "../App.css";

import { PresetI } from "../types/PresetI";
import { invoke } from "@tauri-apps/api";

function PresetModal(props: { presets: Array<PresetI> }) {
    const [presets, setPresets] = createStore<Array<PresetI>>(props.presets);

    async function submitForm(): Promise<void> {
        await invoke("save_all_presets", { presets: presets });
    }

    function addPreset(): void {
        setPresets([...presets, { name: "", color: "#000000" }]);
    }

    function removePreset(index: number): void {
        setPresets(presets.filter((_, i) => i !== index));
    }

    return (
        <dialog id="presetModal" class="modal">
            <form onSubmit={submitForm} class="modal-box">
                <h3 class="font-bold text-lg">Edit presets</h3>

                <Index each={presets}>
                    {(preset, i) => (
                        <div class="flex flex-row mb-2">
                            <label class="form-control">
                                <input
                                    type="text"
                                    class="input input-sm input-bordered w-11/12"
                                    value={preset().name}
                                    onInput={(e) =>
                                        setPresets(i, "name", e.target.value)
                                    }
                                />
                            </label>
                            <label class="form-control">
                                <div class="color-input-wrapper color-input-wrapper-small">
                                    <input
                                        type="color"
                                        value={preset().color}
                                        onInput={(e) =>
                                            setPresets(
                                                i,
                                                "color",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </label>
                            <button
                                class="btn btn-sm ms-2"
                                onClick={(event) => {
                                    removePreset(i);
                                    event.preventDefault();
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </Index>
                <button
                    class="btn btn-sm mt-2"
                    onClick={(event) => {
                        addPreset();
                        event.preventDefault();
                    }}
                >
                    Add preset
                </button>
                <div class="modal-action">
                    <div class="btn" onClick="presetModal.close()">
                        Close
                    </div>
                    <button type="submit" class="btn">
                        Save
                    </button>
                </div>
            </form>
        </dialog>
    );
}

export default PresetModal;
