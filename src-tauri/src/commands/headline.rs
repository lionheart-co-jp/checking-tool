use std::collections::HashMap;
use crate::parse;

#[tauri::command]
pub fn get_headline_list(url: String, user: String, pass: String) -> Result<Vec<HashMap<String, String>>, String> {
  let mut returns = Vec::new();
  let document = match parse::get_url_document(url, user, pass) {
    Ok(document) => document,
    Err(e) => return Err(e)
  };

  let headline_selector = scraper::Selector::parse("h1, h2, h3, h4, h5").unwrap();
  let headline_elements = document.select(&headline_selector);

  headline_elements.for_each(|e| {
    let mut row = HashMap::new();

    let name = e.value().name();
    row.insert("name".into(), name.to_string());

    let content = e.inner_html();
    row.insert("content".into(), content);

    returns.push(row)
  });

  Ok(returns)
}