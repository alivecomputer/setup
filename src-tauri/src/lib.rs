use std::fs;
use std::path::{Path, PathBuf};

#[tauri::command]
fn check_command(cmd: String) -> Result<String, String> {
    let output = std::process::Command::new("which")
        .arg(&cmd)
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).trim().to_string())
    } else {
        Err(format!("{} not found", cmd))
    }
}

#[tauri::command]
fn run_command(cmd: String, args: Vec<String>) -> Result<String, String> {
    let output = std::process::Command::new(&cmd)
        .args(&args)
        .env("PATH", format!("/opt/homebrew/bin:/usr/local/bin:{}/.cargo/bin:{}/.local/bin:/usr/bin:/bin:/usr/sbin:/sbin",
            std::env::var("HOME").unwrap_or_default(),
            std::env::var("HOME").unwrap_or_default()))
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr).to_string();
        if stderr.is_empty() {
            Err("Command failed with no output".to_string())
        } else {
            Err(stderr)
        }
    }
}

#[tauri::command]
fn get_home_dir() -> Result<String, String> {
    dirs::home_dir()
        .map(|p: PathBuf| p.to_string_lossy().to_string())
        .ok_or_else(|| "Could not find home directory".to_string())
}

#[tauri::command]
fn get_icloud_path() -> Result<String, String> {
    let home = dirs::home_dir().ok_or("No home dir")?;
    let icloud = home.join("Library/Mobile Documents/com~apple~CloudDocs");
    if icloud.exists() {
        Ok(icloud.to_string_lossy().to_string())
    } else {
        Err("iCloud Drive not found".to_string())
    }
}

#[tauri::command]
fn path_exists(path: String) -> bool {
    Path::new(&path).exists()
}

#[tauri::command]
fn write_file(path: String, content: String) -> Result<(), String> {
    // Create parent directories if needed
    if let Some(parent) = Path::new(&path).parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    fs::write(&path, &content).map_err(|e| e.to_string())
}

#[tauri::command]
fn write_file_if_missing(path: String, content: String) -> Result<bool, String> {
    if Path::new(&path).exists() {
        Ok(false) // file already exists, didn't write
    } else {
        if let Some(parent) = Path::new(&path).parent() {
            fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
        fs::write(&path, &content).map_err(|e| e.to_string())?;
        Ok(true) // wrote the file
    }
}

#[tauri::command]
fn create_symlink(target: String, link: String) -> Result<bool, String> {
    if Path::new(&link).exists() {
        Ok(false) // already exists
    } else {
        std::os::unix::fs::symlink(&target, &link).map_err(|e| e.to_string())?;
        Ok(true)
    }
}

#[tauri::command]
fn create_dirs(paths: Vec<String>) -> Result<(), String> {
    for path in paths {
        fs::create_dir_all(&path).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            check_command,
            run_command,
            get_home_dir,
            get_icloud_path,
            path_exists,
            write_file,
            write_file_if_missing,
            create_symlink,
            create_dirs,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
