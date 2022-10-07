#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use app::commands;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      commands::title::get_title_meta,
      commands::alt::get_alt,
      commands::headline::get_headline_list,
      commands::link::get_link_list,
      commands::link::get_link_available
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
