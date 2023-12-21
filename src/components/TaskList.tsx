import { For, createSignal } from "solid-js";
import { TaskI } from "../types/TaskI";
import { GroupedTaskI } from "../types/GroupedTaskI";

function TaskList(props: { tasks: TaskI[] }) {
    const [tasks, setTasks] = createSignal(props.tasks);

    function groupTasksByDate(tasks: TaskI[]): GroupedTaskI[] {
        const groupedTasks: GroupedTaskI[] = [];

        tasks.forEach((task) => {
            const date = new Date(task.start_date).toDateString();

            if (groupedTasks.some((group) => group.date === date)) {
                groupedTasks
                    .find((group) => group.date === date)
                    ?.tasks.push(task);
            } else {
                groupedTasks.push({ date: date, tasks: [task] });
            }
        });

        return groupedTasks;
    }

    return (
        <For each={groupTasksByDate(tasks())}>
            {(groupedTask) => (
                <div class="collapse collapse-arrow border mt-2">
                    <input type="checkbox" />
                    <div class="collapse-title text-xl font-medium">
                        {groupedTask.date}
                    </div>
                    <div class="collapse-content">
                        <ul class="list-disc pl-4">
                            <For each={groupedTask.tasks}>
                                {(task) => <li class="mb-2">{task.name}</li>}
                            </For>
                        </ul>
                    </div>
                </div>
            )}
        </For>
    );
}

export default TaskList;
