use std::fs;
use std::fs::read_to_string;
use std::fs::OpenOptions;
use std::io::Write;
use std::path::Path;

use crate::PresetI;
use crate::TaskI;

// Check if a database files exist, and create them if they do not.
pub fn init() {
    let db_path = get_task_db_path();
    if !db_file_exists(&db_path) {
        create_db_file(&db_path);
    }

    let db_path = get_preset_db_path();
    if !db_file_exists(&db_path) {
        create_db_file(&db_path);
    }
}

// Create the database file.
fn create_db_file(db_path: &str) {
    let db_dir = Path::new(&db_path).parent().unwrap();

    // If the parent directory does not exist, create it.
    if !db_dir.exists() {
        fs::create_dir_all(db_dir).unwrap();
    }

    // Create the database file.
    fs::File::create(db_path).unwrap();
}

// Check whether the database file exists.
fn db_file_exists(db_path: &str) -> bool {
    Path::new(db_path).exists()
}

// Get the path where the database file should be located.
fn get_task_db_path() -> String {
    let home_dir = dirs::home_dir().unwrap();
    home_dir.to_str().unwrap().to_string() + "/.config/timetracktauri/task.secure"
}

fn get_preset_db_path() -> String {
    let home_dir = dirs::home_dir().unwrap();
    home_dir.to_str().unwrap().to_string() + "/.config/timetracktauri/preset.secure"
}

// Write the data to the database file, after encrypting it.
pub fn write_task_db(task_list: &Vec<TaskI>) {
    let db_path = get_task_db_path();
    let mut db_file = OpenOptions::new().write(true).open(db_path).unwrap();

    let mut encrypted_data = Vec::new();

    for task in task_list {
        let task_json = serde_json::to_string(&task).unwrap();
        let encrypted_task = encrypt(&task_json);
        encrypted_data.push(encrypted_task);
    }

    let encrypted_data_json = serde_json::to_string(&encrypted_data).unwrap();

    db_file.set_len(0).unwrap();
    db_file.write_all(encrypted_data_json.as_bytes()).unwrap();
}

pub fn write_preset_db(preset_list: &Vec<PresetI>) {
    let db_path = get_preset_db_path();
    let mut db_file = OpenOptions::new().write(true).open(db_path).unwrap();

    let mut encrypted_data = Vec::new();

    for preset in preset_list {
        let preset_json = serde_json::to_string(&preset).unwrap();
        let encrypted_preset = encrypt(&preset_json);
        encrypted_data.push(encrypted_preset);
    }

    let encrypted_data_json = serde_json::to_string(&encrypted_data).unwrap();

    db_file.set_len(0).unwrap();
    db_file.write_all(encrypted_data_json.as_bytes()).unwrap();
}

fn encrypt(data: &str) -> String {
    let mut encrypted_data = String::new();

    for c in data.chars() {
        let mut encrypted_char = c as u8;
        encrypted_char = encrypted_char ^ 0x55;
        encrypted_data.push(encrypted_char as char);
    }

    encrypted_data
}

fn decrypt(data: &str) -> String {
    let mut decrypted_data = String::new();

    for c in data.chars() {
        let mut decrypted_char = c as u8;
        decrypted_char = decrypted_char ^ 0x55;
        decrypted_data.push(decrypted_char as char);
    }

    decrypted_data
}

// Read the data from the database file, after decrypting it.
pub fn read_task_db() -> Vec<TaskI> {
    let db_path = get_task_db_path();

    let mut task_list = Vec::new();

    let encrypted_data_json = fs::read_to_string(db_path).unwrap();
    // if task_list is empty, return empty vector
    if encrypted_data_json == "" {
        return task_list;
    }

    let encrypted_data: Vec<String> = serde_json::from_str(&encrypted_data_json).unwrap();

    for encrypted_task in encrypted_data {
        let decrypted_task = decrypt(&encrypted_task);
        let task: TaskI = serde_json::from_str(&decrypted_task).unwrap();
        task_list.push(task);
    }

    task_list
}

pub fn read_preset_db() -> Vec<PresetI> {
    let db_path = get_preset_db_path();

    let mut preset_list = Vec::new();

    let encrypted_data_json = fs::read_to_string(db_path).unwrap();
    // if preset_list is empty, return empty vector
    if encrypted_data_json == "" {
        return preset_list;
    }

    let encrypted_data: Vec<String> = serde_json::from_str(&encrypted_data_json).unwrap();

    for encrypted_preset in encrypted_data {
        let decrypted_preset = decrypt(&encrypted_preset);
        let preset: PresetI = serde_json::from_str(&decrypted_preset).unwrap();
        preset_list.push(preset);
    }

    preset_list
}
