// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use serde::{Deserialize, Serialize};
use ts_rs::TS;

mod db;

#[derive(Serialize, Deserialize, Debug, TS, Clone)]
#[ts(export, export_to = "../src/types/")]
struct Preset {
    name: String,
    color: String,
}

#[derive(Serialize, Deserialize, Debug, TS, Clone)]
#[ts(export, export_to = "../src/types/")]
struct State {
    task_id: i32,
}

#[derive(Serialize, Deserialize, Debug, TS, Clone)]
#[ts(export, export_to = "../src/types/")]
struct Task {
    id: i32,
    name: String,
    color: String,
    start_date: i32,
    end_date: i32,
    description: String,
}

#[derive(Serialize, Deserialize, Debug, TS, Clone)]
#[ts(export, export_to = "../src/types/")]
struct TaskModal {
    task_id: i32,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            // Initialize the database.
            db::init();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
