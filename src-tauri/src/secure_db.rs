use std::fs;
use std::fs::OpenOptions;
use std::io::Write;
use std::path::Path;

use crate::PresetI;
use crate::PresetList;
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
        fill_preset_db();
    }
}

// Create the database file.
fn create_db_file(db_path: &str) {
    let db_dir = Path::new(&db_path).parent();
    match db_dir {
        Some(db_dir) => {
            // If the parent directory does not exist, create it.
            if !db_dir.exists() {
                match fs::create_dir_all(db_dir) {
                    Ok(_) => (),
                    Err(_) => panic!("Could not create database directory."),
                }
            }

            match fs::File::create(db_path) {
                Ok(_) => (),
                Err(_) => panic!("Could not create database file."),
            }
        }
        None => panic!("Parent directory ends in root or the path is invalid."),
    }
}

// Check whether the database file exists.
fn db_file_exists(db_path: &str) -> bool {
    Path::new(db_path).exists()
}

// Get the path where the database file should be located.
fn get_task_db_path() -> String {
    let home_dir = dirs::home_dir();
    match home_dir {
        Some(dir) => {
            let dir_str = dir.to_str();
            match dir_str {
                Some(dir_str) => {
                    return dir_str.to_string() + "/.config/timetracktauri/task.secure"
                }
                None => panic!("Could not get home directory."),
            }
        }
        None => panic!("Could not get home directory."),
    }
}

fn get_preset_db_path() -> String {
    let home_dir = dirs::home_dir();
    match home_dir {
        Some(dir) => {
            let dir_str = dir.to_str();
            match dir_str {
                Some(dir_str) => {
                    return dir_str.to_string() + "/.config/timetracktauri/preset.secure"
                }
                None => panic!("Could not get home directory."),
            }
        }
        None => panic!("Could not get home directory."),
    }
}

// Write the data to the database file, after encrypting it.
pub fn write_task_db(task_list: &Vec<TaskI>) {
    let db_path = get_task_db_path();
    let db_file = OpenOptions::new().write(true).open(db_path);

    match db_file {
        Ok(mut db_file) => {
            let mut encrypted_data = Vec::new();

            for task in task_list {
                let task_json = serde_json::to_string(&task);
                match task_json {
                    Ok(task_json) => {
                        let encrypted_task = encrypt(&task_json);
                        encrypted_data.push(encrypted_task);
                    }
                    Err(_) => panic!("Could not serialize task."),
                }
            }

            let encrypted_data_json = serde_json::to_string(&encrypted_data);
            match encrypted_data_json {
                Ok(encrypted_data_json) => {
                    let encrypted_data_json: String = encrypted_data_json;
                    match db_file.set_len(0) {
                        Ok(_) => (),
                        Err(_) => panic!("Could not truncate database file."),
                    };
                    match db_file.write_all(encrypted_data_json.as_bytes()) {
                        Ok(_) => (),
                        Err(_) => panic!("Could not write to database file."),
                    };
                }
                Err(_) => panic!("Could not serialize encrypted data."),
            }
        }
        Err(_) => panic!("Could not open database file."),
    }
}

pub fn write_preset_db(preset_list: &Vec<PresetI>) {
    let db_path = get_preset_db_path();
    let db_file = OpenOptions::new().write(true).open(db_path);

    match db_file {
        Ok(mut db_file) => {
            let mut encrypted_data = Vec::new();

            for preset in preset_list {
                let preset_json = serde_json::to_string(&preset);
                match preset_json {
                    Ok(preset_json) => {
                        let encrypted_preset = encrypt(&preset_json);
                        encrypted_data.push(encrypted_preset);
                    }
                    Err(_) => panic!("Could not serialize preset."),
                }
            }

            let encrypted_data_json = serde_json::to_string(&encrypted_data);
            match encrypted_data_json {
                Ok(encrypted_data_json) => {
                    let encrypted_data_json: String = encrypted_data_json;
                    match db_file.set_len(0) {
                        Ok(_) => (),
                        Err(_) => panic!("Could not truncate database file."),
                    };
                    match db_file.write_all(encrypted_data_json.as_bytes()) {
                        Ok(_) => (),
                        Err(_) => panic!("Could not write to database file."),
                    };
                }
                Err(_) => panic!("Could not serialize encrypted data."),
            }
        }
        Err(_) => panic!("Could not open database file."),
    }
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

    let encrypted_data_json = fs::read_to_string(db_path);

    match encrypted_data_json {
        Ok(encrypted_data_json) => {
            // if task_list is empty, return empty vector
            if encrypted_data_json == "" {
                return task_list;
            }

            let encrypted_data = serde_json::from_str(&encrypted_data_json);
            match encrypted_data {
                Ok(encrypted_data) => {
                    let encrypted_data: Vec<String> = encrypted_data;
                    for encrypted_task in encrypted_data {
                        let decrypted_task = decrypt(&encrypted_task);
                        let task = serde_json::from_str(&decrypted_task);
                        match task {
                            Ok(task) => task_list.push(task),
                            Err(_) => panic!("Could not deserialize decrypted data."),
                        }
                    }
                }
                Err(_) => panic!("Could not deserialize encrypted data."),
            }
        }
        Err(_) => panic!("Could not read database file."),
    }

    task_list
}

pub fn read_preset_db() -> Vec<PresetI> {
    let db_path = get_preset_db_path();

    let mut preset_list = Vec::new();

    let encrypted_data_json = fs::read_to_string(db_path);

    match encrypted_data_json {
        Ok(encrypted_data_json) => {
            // if preset_list is empty, return empty vector
            if encrypted_data_json == "" {
                return preset_list;
            }

            let encrypted_data = serde_json::from_str(&encrypted_data_json);
            match encrypted_data {
                Ok(encrypted_data) => {
                    let encrypted_data: Vec<String> = encrypted_data;
                    for encrypted_preset in encrypted_data {
                        let decrypted_preset = decrypt(&encrypted_preset);
                        let preset = serde_json::from_str(&decrypted_preset);
                        match preset {
                            Ok(preset) => preset_list.push(preset),
                            Err(_) => panic!("Could not deserialize decrypted data."),
                        }
                    }
                }
                Err(_) => panic!("Could not deserialize encrypted data."),
            }
        }
        Err(_) => panic!("Could not read database file."),
    }

    preset_list
}

fn fill_preset_db() {
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

    write_preset_db(&preset_list.0);
}

// Unit Tests for encrypting and decrypting
#[cfg(test)]
mod tests {
    use crate::secure_db::decrypt;
    use crate::secure_db::encrypt;

    #[test]
    fn test_encrypt() {
        let data = "Rust Unit Test!";
        let encrypted_data = encrypt(data);
        assert_eq!(encrypted_data, "\u{7} &!u\0;<!u\u{1}0&!t".to_string());
    }

    #[test]
    fn test_decrypt() {
        let data = "\u{7} &!u\0;<!u\u{1}0&!t";
        let encrypted_data = decrypt(data);
        assert_eq!(encrypted_data, "Rust Unit Test!".to_string());
    }
}
