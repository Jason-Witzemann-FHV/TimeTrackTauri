import { Show, createSignal } from "solid-js";

function Navbar(props: { filterCall: (filter: String) => void }) {
    const [isDateSearch, setIsDateSearch] = createSignal(false);

    function filterInputChanged(searchTerm: String): void {
        props.filterCall(searchTerm);
        if(searchTerm.startsWith("date: ")) {
            setIsDateSearch(true);
            return;
        }
        setIsDateSearch(false);
    }

    return (
        <div class="navbar bg-base-100">
            <div class="flex-1">
                <Show when={isDateSearch()}>
                    <div class="badge badge-primary ms-1" style="position: absolute;">Date:</div>
                </Show>
                <input
                    onInput={(e) => filterInputChanged(e.currentTarget.value)}
                    type="text"
                    placeholder="Search"
                    class="input input-bordered w-3/4"
                />
            </div>
            <div class="flex-2 gap-1">
                <button class="btn" onclick="presetModal.showModal()">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                        />
                    </svg>
                    Preset
                </button>
                <button class="btn" onclick="newTaskModal.showModal()">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                    Task
                </button>
            </div>
        </div>
    );
}

export default Navbar;
