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
    result.insert(String::from("message"), Value::String(String::from("Skipped")));
    return result
  }

  let client = Client::builder()
    .timeout(std::time::Duration::from_secs(30))
    .build()
    .unwrap_or_else(|_| Client::new());

  // まずHEADリクエストを試みる
  let head_response = if user.is_empty() {
    client.head(&url).send().await
  } else {
    client.head(&url).basic_auth(&user, Some(&pass)).send().await
  };

  // HEADが成功した場合
  if let Ok(resp) = head_response {
    if resp.status().is_success() {
      result.insert(String::from("error"), Value::Bool(false));
      result.insert(String::from("code"), Value::String(resp.status().to_string()));
      return result;
    }
    // HEADが405 Method Not Allowedの場合はGETにフォールバック
    if resp.status().as_u16() != 405 {
      result.insert(String::from("error"), Value::Bool(true));
      result.insert(String::from("code"), Value::String(resp.status().to_string()));
      return result;
    }
  }

  // HEADが失敗または405の場合、GETリクエストを試みる
  let get_response = if user.is_empty() {
    client.get(&url).send().await
  } else {
    client.get(&url).basic_auth(&user, Some(&pass)).send().await
  };

  let response = match get_response {
    Ok(r) => r,
    Err(e) => {
      result.insert(String::from("error"), Value::Bool(true));
      let code = e.status().map(|s| s.to_string()).unwrap_or_else(|| "Connection failed".to_string());
      result.insert(String::from("code"), Value::String(code));
      result.insert(String::from("message"), Value::String(String::from("Request failed")));
      return result
    },
  };

  if !response.status().is_success() {
    result.insert(String::from("error"), Value::Bool(true));
    result.insert(String::from("code"), Value::String(response.status().to_string()));
    return result;
  }

  result.insert(String::from("error"), Value::Bool(false));
  result.insert(String::from("code"), Value::String(response.status().to_string()));
  return result
}