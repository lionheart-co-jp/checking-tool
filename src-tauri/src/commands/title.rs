use std::collections::HashMap;
use crate::parse;

#[tauri::command]
pub fn get_title_meta(url: String, user: String, pass: String) -> Result<HashMap<String, String>, String> {
  let mut returns = HashMap::new();
  let document = match parse::get_url_document(url, user, pass) {
    Ok(document) => document,
    Err(e) => return Err(e)
  };

  let title_selector = scraper::Selector::parse("title").unwrap();
  let title_object = document.select(&title_selector).nth(0);
  if title_object.is_some() {
    let title = title_object.unwrap().text().next().unwrap().into();
    returns.insert("title".into(), title);
  }

  let meta_selector = scraper::Selector::parse("meta").unwrap();
  let meta_elements = document.select(&meta_selector);

  meta_elements.for_each(|e| {
    let content = e.value().attr("content");

    let get_key = || -> Option<String> {
      let name = e.value().attr("name");
      let property = e.value().attr("property");

      if name.is_some() {
        return Some(name.unwrap().into());
      }

      if property.is_some() {
        return Some(property.unwrap().into());
      }

      None
    };

    if let Some(key) = get_key() {
      returns.insert(key.into(), content.unwrap().into());
    }
  });

  Ok(returns)
}