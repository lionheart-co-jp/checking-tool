use std::collections::HashMap;
use crate::parse;

#[tauri::command]
pub fn get_alt(url: String, user: String, pass: String) -> Result<Vec<HashMap<String, String>>, String> {
  let mut returns = Vec::new();
  let document = match parse::get_url_document(url, user, pass) {
    Ok(document) => document,
    Err(e) => return Err(e)
  };

  let img_selector = scraper::Selector::parse("img").unwrap();
  let img_elements = document.select(&img_selector);

  img_elements.for_each(|e| {
    let mut row = HashMap::new();

    let src = e.value().attr("src");
    row.insert("src".into(), src.unwrap().into());

    let alt = e.value().attr("alt");
    if alt.is_some() {
      row.insert("alt".into(), alt.unwrap().into());
    }

    returns.push(row)
  });

  Ok(returns)
}