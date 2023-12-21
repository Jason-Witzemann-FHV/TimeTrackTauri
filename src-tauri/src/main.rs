// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use serde::{Deserialize, Serialize};
use ts_rs::TS;

mod secure_db;

#[derive(Serialize, Deserialize, Debug, TS, Clone)]
#[ts(export, export_to = "../src/types/")]
struct PresetI {
    name: String,
    color: String,
}

#[derive(Serialize, Deserialize, Debug, TS, Clone)]
#[ts(export, export_to = "../src/types/")]
struct TaskI {
    id: i32,
    name: String,
    color: String,
    start_date: i64,
    end_date: i64,
    description: String,
}

#[derive(Serialize, Deserialize, Debug, TS, Clone)]
#[ts(export, export_to = "../src/types/")]
struct GroupedTaskI {
    date: String,
    tasks: Vec<TaskI>,
}

#[derive(Serialize, Deserialize, Debug, TS, Clone)]
#[ts(export, export_to = "../src/types/")]
struct TaskModalI {
    task: TaskI,
    presets: Vec<PresetI>,
}

struct TaskList(Vec<TaskI>);
struct PresetList(Vec<PresetI>);

impl TaskList {
    fn new() -> Self {
        TaskList(Vec::new())
    }

    fn add(&mut self, task: TaskI) {
        self.0.push(task);
    }

    fn get(&self, index: usize) -> Option<&TaskI> {
        self.0.get(index)
    }
}

impl PresetList {
    fn new() -> Self {
        PresetList(Vec::new())
    }

    fn add(&mut self, preset: PresetI) {
        self.0.push(preset);
    }

    fn get(&self, index: usize) -> Option<&PresetI> {
        self.0.get(index)
    }
}

#[tauri::command]
fn get_all_tasks() -> Vec<TaskI> {
    let mut task_list = TaskList::new();
    print!("Hello world");
    let task = TaskI {
        id: 1,
        name: "Task 1".to_string(),
        color: "#ff0000".to_string(),
        start_date: 1703149200000,
        end_date: 1703152800000,
        description: "This is a task".to_string(),
    };
    task_list.add(task);
    let task = TaskI {
        id: 2,
        name: "Task 2".to_string(),
        color: "#00ff00".to_string(),
        start_date: 1703152800000,
        end_date: 1703163600000,
        description: "This is another task".to_string(),
    };
    task_list.add(task);
    let task = TaskI {
        id: 3,
        name: "Task 3".to_string(),
        color: "#0000ff".to_string(),
        start_date: 1702904400000,
        end_date: 1702911600000,
        description: "This is yet another task".to_string(),
    };
    task_list.add(task);
    let task = TaskI {
        id: 4,
        name: "Task 4".to_string(),
        color: "#ffff00".to_string(),
        start_date: 1702911600000,
        end_date: 1702926600000,
        description: "This is yet another task".to_string(),
    };
    task_list.add(task);
    let task = TaskI {
        id: 5,
        name: "Task 5".to_string(),
        color: "#ff00ff".to_string(),
        start_date: 0,
        end_date: 0,
        description: "This is yet another task".to_string(),
    };
    task_list.add(task);
    let task = TaskI {
        id: 6,
        name: "Task 6".to_string(),
        color: "#00ffff".to_string(),
        start_date: 0,
        end_date: 0,
        description: "This is yet another task".to_string(),
    };
    task_list.add(task);
    let task = TaskI {
        id: 7,
        name: "Task 7".to_string(),
        color: "#ffffff".to_string(),
        start_date: 0,
        end_date: 0,
        description: "This is yet another task".to_string(),
    };
    task_list.add(task);
    return task_list.0;
}

#[tauri::command]
fn get_all_presets() -> Vec<PresetI> {
    let mut preset_list = PresetList::new();
    let preset = PresetI {
        name: "Preset 1".to_string(),
        color: "#ff0000".to_string(),
    };
    preset_list.add(preset);
    let preset = PresetI {
        name: "Preset 2".to_string(),
        color: "#00ff00".to_string(),
    };
    preset_list.add(preset);
    let preset = PresetI {
        name: "Preset 3".to_string(),
        color: "#0000ff".to_string(),
    };
    preset_list.add(preset);
    let preset = PresetI {
        name: "Preset 4".to_string(),
        color: "#ffff00".to_string(),
    };
    preset_list.add(preset);
    let preset = PresetI {
        name: "Preset 5".to_string(),
        color: "#ff00ff".to_string(),
    };
    preset_list.add(preset);
    let preset = PresetI {
        name: "Preset 6".to_string(),
        color: "#00ffff".to_string(),
    };
    preset_list.add(preset);
    let preset = PresetI {
        name: "Preset 7".to_string(),
        color: "#ffffff".to_string(),
    };
    preset_list.add(preset);
    let preset = PresetI {
        name: "Preset 8".to_string(),
        color: "#000000".to_string(),
    };
    preset_list.add(preset);
    return preset_list.0;
}

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            // Initialize the database.
            secure_db::init();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_all_presets, get_all_tasks])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
