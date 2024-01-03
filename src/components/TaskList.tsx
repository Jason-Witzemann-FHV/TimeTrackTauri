import { For, createEffect, createSignal } from "solid-js";
import { TaskI } from "../types/TaskI";
import { GroupedTaskI } from "../types/GroupedTaskI";
import { invoke } from "@tauri-apps/api";

function TaskList(props: {
    tasks: TaskI[];
    editTaskCall: (task: TaskI) => void;
    isFiltered: boolean;
}) {
    const [groupedTasks, setGroupedTasks] = createSignal<Array<GroupedTaskI>>(
        []
    );

    function groupTasksByDay(tasks: TaskI[]): Array<GroupedTaskI> {
        const groupedTasks: GroupedTaskI[] = tasks.reduce(
            (acc: GroupedTaskI[], task: TaskI) => {
                const date = new Date(task.start_date);
                date.setHours(0, 0, 0, 0);

                const existingGroup = acc.find(
                    (group) => group.date.getTime() === date.getTime()
                );
                if (existingGroup) {
                    existingGroup.tasks.push(task);
                } else {
                    acc.push({ date, tasks: [task] });
                }

                return acc;
            },
            []
        );

        groupedTasks.sort(
            (a: GroupedTaskI, b: GroupedTaskI) =>
                b.date.getTime() - a.date.getTime()
        );

        return groupedTasks;
    }

    function getDayLabel(date: Date): string {
        return date.toLocaleDateString("de-DE", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    function getTaskLabel(task: TaskI): string {
        const start_date = new Date(task.start_date);
        const end_date = new Date(task.end_date);

        let label =
            start_date.toLocaleTimeString("de-DE", {
                hour: "numeric",
                minute: "numeric",
            }) +
            " - " +
            end_date.toLocaleTimeString("de-DE", {
                hour: "numeric",
                minute: "numeric",
            }) +
            " " +
            task.name;

        return label;
    }

    function openGroupedTask(groupedTask: GroupedTaskI): boolean {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return (
            groupedTask.date.getTime() === today.getTime() || props.isFiltered
        );
    }

    createEffect(() => {
        setGroupedTasks(groupTasksByDay(props.tasks));
    });

    function deleteTask(id: number): void {
        invoke("delete_task", { id: id });
        location.reload();
    }

    return (
        <For each={groupedTasks()}>
            {(groupedTask) => (
                <div
                    class={
                        openGroupedTask(groupedTask)
                            ? "collapse collapse-open collapse-arrow border mt-2"
                            : "collapse collapse-arrow border mt-2"
                    }
                >
                    <input type="checkbox" />
                    <div class="collapse-title text-xl font-medium ">
                        {getDayLabel(groupedTask.date)}
                    </div>
                    <div class="collapse-content">
                        <ul class="list-disc pl-4">
                            <For each={groupedTask.tasks}>
                                {(task) => (
                                    <li class="mb-2">
                                        {getTaskLabel(task)}
                                        <button
                                            class="btn btn-sm ml-2"
                                            onclick={() =>
                                                props.editTaskCall(task)
                                            }
                                        >
                                            Edit
                                        </button>
                                        <button
                                            class="btn btn-sm ml-2"
                                            onclick={() => deleteTask(task.id)}
                                        >
                                            Delete
                                        </button>
                                    </li>
                                )}
                            </For>
                        </ul>
                    </div>
                </div>
            )}
        </For>
    );
}

export default TaskList;
