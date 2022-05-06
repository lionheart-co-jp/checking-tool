#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};
use app::commands;

fn main() {
  let about_menu = Submenu::new("App", Menu::new()
    .add_native_item(MenuItem::Hide)
    .add_native_item(MenuItem::HideOthers)
    .add_native_item(MenuItem::ShowAll)
    .add_native_item(MenuItem::Separator)
    .add_native_item(MenuItem::Quit));

  let edit_menu = Submenu::new("Edit", Menu::new()
    .add_native_item(MenuItem::Undo)
    .add_native_item(MenuItem::Redo)
    .add_native_item(MenuItem::Separator)
    .add_native_item(MenuItem::Cut)
    .add_native_item(MenuItem::Copy)
    .add_native_item(MenuItem::Paste)
    .add_native_item(MenuItem::SelectAll));

  let view_menu = Submenu::new("View", Menu::new()
    .add_native_item(MenuItem::EnterFullScreen));

  let window_menu = Submenu::new("Window", Menu::new()
    .add_native_item(MenuItem::Minimize)
    .add_native_item(MenuItem::Zoom));

  let help_menu = Submenu::new("Help", Menu::new()
    .add_item(CustomMenuItem::new("Learn More", "Learn More")));

  let menu = Menu::new()
    .add_submenu(about_menu)
    .add_submenu(edit_menu)
    .add_submenu(view_menu)
    .add_submenu(window_menu)
    .add_submenu(help_menu);

  tauri::Builder::default()
    .menu(menu)
    .invoke_handler(tauri::generate_handler![
      commands::title::get_title_meta,
      commands::alt::get_alt,
      commands::headline::get_headline_list
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
