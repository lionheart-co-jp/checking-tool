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
use serde_json::{Value, Map};
use regex::Regex;

#[tauri::command]
pub async fn get_link_available(url: String, user: String, pass: String) -> Map<String, Value> {
  let mut result = Map::new();
  result.insert(String::from("url"), Value::String(url.clone()));

  let re = Regex::new(r"^(mailto:|tel:|javascript:|#)").unwrap();
  if re.is_match(url.as_str()) {
    result.insert(String::from("error"), Value::Bool(false));
    result.insert(String::from("message"), Value::String(String::from("No links")));
    return result
  }

  let client = Client::new();
  let response = client.get(url).basic_auth(user, Some(pass)).send().await;

  let response = match response {
    Ok(r) => r,
    Err(e) => {
      result.insert(String::from("error"), Value::Bool(true));
      result.insert(String::from("code"), Value::String(e.status().unwrap().to_string()));
      result.insert(String::from("message"), Value::String(String::from("Unknown error")));
      return result
    },
  };

  if !response.status().is_success() {
    result.insert(String::from("error"), Value::Bool(true));
    result.insert(String::from("code"), Value::String(response.status().to_string()));
    result.insert(String::from("message"), Value::String(response.text().await.unwrap().to_string()));
    return result;
  }

  result.insert(String::from("error"), Value::Bool(false));
  return result
}