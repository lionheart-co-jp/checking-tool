use reqwest::blocking::Client;
use reqwest::blocking::Response;
use scraper::Html;

pub fn get_url_document(url: String, user: String, pass: String) -> Result<Html, String> {
  let request = || -> Result<Response, Box<dyn std::error::Error>> {
    let client = Client::new();
    Ok(client.get(url).basic_auth(user, Some(pass)).send()?)
  };

  let response = request();
  let response = match response {
    Ok(r) => r,
    Err(_) => return Err("Failed to get informations".into()),
  };

  if !response.status().is_success() {
    return Err("Failed to get informations".to_string());
  }

  let body = match response.text() {
    Ok(b) => b,
    Err(_) => return Err("Failed to get informations".into()),
  };

  Ok(Html::parse_document(&body))
}