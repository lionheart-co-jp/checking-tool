use std::collections::HashMap;
use crate::parse;

#[tauri::command]
pub fn get_link_list(url: String, user: String, pass: String) -> Result<Vec<HashMap<String, String>>, String> {
  let mut returns = Vec::new();
  let document = match parse::get_url_document(url, user, pass) {
    Ok(document) => document,
    Err(e) => return Err(e)
  };

  let anchor_selector = scraper::Selector::parse("a").unwrap();
  let anchor_elements = document.select(&anchor_selector);

  anchor_elements.for_each(|e| {
    let mut row = HashMap::new();

    let href = e.value().attr("href");
    if href.is_some() {
      row.insert("href".into(), href.unwrap().into());
    }

    let target = e.value().attr("target");
    if target.is_some() {
      row.insert("target".into(), target.unwrap().into());
    }

    let content = e.inner_html();
    row.insert("content".into(), content);

    returns.push(row)
  });

  Ok(returns)
}

use reqwest::Client;

#[tauri::command]
pub async fn get_link_available(url: String, user: String, pass: String) -> bool {
  let client = Client::new();
  let response = client.get(url).basic_auth(user, Some(pass)).send().await;

  let response = match response {
    Ok(r) => r,
    Err(_) => return false,
  };

  if !response.status().is_success() {
    return false;
  }

  true
}