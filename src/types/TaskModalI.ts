import type { PresetI } from "./PresetI";
import type { TaskI } from "./TaskI";

export interface TaskModalI {
    task: TaskI;
    presets: Array<PresetI>;
    ref: HTMLDialogElement;
}
