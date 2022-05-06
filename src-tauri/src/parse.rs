use reqwest::blocking::Client;
use scraper::Html;

pub fn get_url_document(url: String, user: String, pass: String) -> Result<Html, String> {
  let request = || -> Result<String, Box<dyn std::error::Error>> {
    let client = Client::new();
    Ok(client.get(url).basic_auth(user, Some(pass)).send()?.text()?)
  };

  let body = request();
  let body = match body {
    Ok(b) => b,
    Err(_) => return Err("Failed to get informations".into()),
  };

  Ok(Html::parse_document(&body))
}