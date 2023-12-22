import type { TaskI } from "./TaskI";

export interface GroupedTaskI {
    date: Date;
    tasks: Array<TaskI>;
}
