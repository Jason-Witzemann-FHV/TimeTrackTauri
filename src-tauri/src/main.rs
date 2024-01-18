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
    start_date: String,
    end_date: String,
    description: String,
}

struct PresetList(Vec<PresetI>);

impl PresetList {
    fn new() -> Self {
        PresetList(Vec::new())
    }

    fn add(&mut self, preset: PresetI) {
        self.0.push(preset);
    }
}

#[tauri::command]
fn get_all_tasks() -> Vec<TaskI> {
    secure_db::read_task_db()
}

#[tauri::command]
fn get_all_presets() -> Vec<PresetI> {
    secure_db::read_preset_db()
}

#[tauri::command]
fn save_all_presets(presets: Vec<PresetI>) {
    secure_db::write_preset_db(&presets);
}

#[tauri::command]
fn save_task(task: TaskI) {
    let mut task_list = secure_db::read_task_db();

    // check if task already exists. If so, replace it. If not, add it.
    let mut task_exists = false;
    for i in 0..task_list.len() {
        if task_list[i].id == task.id {
            task_list[i] = task.clone();
            task_exists = true;
            break;
        }
    }
    if !task_exists {
        task_list.push(task);
    }

    secure_db::write_task_db(&task_list);
}

#[tauri::command]
fn delete_task(id: i32) {
    let mut task_list = secure_db::read_task_db();

    // check if task exists and remove it.
    for i in 0..task_list.len() {
        if task_list[i].id == id {
            task_list.remove(i);
            break;
        }
    }
    secure_db::write_task_db(&task_list);
}

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            // Initialize the database.
            secure_db::init();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_all_presets,
            get_all_tasks,
            save_all_presets,
            save_task,
            delete_task
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
