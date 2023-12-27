use std::fs;
use std::fs::OpenOptions;
use std::io::Write;
use std::path::Path;

use crate::PresetI;
use crate::TaskI;

// Check if a database file exists, and create one if it does not.
pub fn init() {
    if !db_file_exists() {
        create_db_file();
    }
}

// Create the database file.
fn create_db_file() {
    let db_path = get_db_path();
    let db_dir = Path::new(&db_path).parent().unwrap();

    // If the parent directory does not exist, create it.
    if !db_dir.exists() {
        fs::create_dir_all(db_dir).unwrap();
    }

    // Create the database file.
    fs::File::create(db_path).unwrap();
}

// Check whether the database file exists.
fn db_file_exists() -> bool {
    let db_path = get_db_path();
    Path::new(&db_path).exists()
}

// Get the path where the database file should be located.
fn get_db_path() -> String {
    let home_dir = dirs::home_dir().unwrap();
    home_dir.to_str().unwrap().to_string() + "/.config/timetracktauri/database.secure"
}

fn write_to_db(tasks: Vec<TaskI>, presets: Vec<PresetI>) {
    let mut data_file = OpenOptions::new()
        .append(true)
        .open(get_db_path())
        .expect("cannot open file");

    //for loop
    for task in tasks.iter() {
        let json_string = serde_json::to_string(task).unwrap();
        data_file
            .write(json_string.as_bytes())
            .expect("cannot write to file");
    }
}
