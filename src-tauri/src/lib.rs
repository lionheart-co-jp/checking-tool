pub mod commands;
pub mod parse;

use commands::{alt, crawl, headline, link, title};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            title::get_title_meta,
            alt::get_alt,
            headline::get_headline_list,
            link::get_link_list,
            link::get_link_available,
            crawl::start_crawl,
            crawl::stop_crawl,
            crawl::get_crawl_status
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}