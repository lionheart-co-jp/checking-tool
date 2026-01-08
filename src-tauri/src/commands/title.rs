use std::collections::HashMap;
use regex::Regex;
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

  // Canonical URL の検出
  let canonical_selector = scraper::Selector::parse("link[rel='canonical']").unwrap();
  if let Some(canonical) = document.select(&canonical_selector).next() {
    if let Some(href) = canonical.value().attr("href") {
      returns.insert("canonical".into(), href.into());
    }
  }

  // Google Analytics / GTM の検出
  let script_selector = scraper::Selector::parse("script").unwrap();
  let script_elements = document.select(&script_selector);

  // GA4 (gtag.js) パターン: gtag('config', 'G-XXXXXXXXXX')
  let ga4_pattern = Regex::new(r#"gtag\s*\(\s*['"]config['"]\s*,\s*['"]G-([A-Z0-9]+)['"]"#).unwrap();
  // UA (analytics.js) パターン: ga('create', 'UA-XXXXX-Y')
  let ua_pattern = Regex::new(r#"ga\s*\(\s*['"]create['"]\s*,\s*['"]UA-(\d+-\d+)['"]"#).unwrap();
  // gtag UA パターン: gtag('config', 'UA-XXXXX-Y')
  let gtag_ua_pattern = Regex::new(r#"gtag\s*\(\s*['"]config['"]\s*,\s*['"]UA-(\d+-\d+)['"]"#).unwrap();
  // GTM パターン: GTM-XXXXXXX
  let gtm_pattern = Regex::new(r#"GTM-([A-Z0-9]+)"#).unwrap();

  let mut ga4_ids: Vec<String> = Vec::new();
  let mut ua_ids: Vec<String> = Vec::new();
  let mut gtm_ids: Vec<String> = Vec::new();

  for script in script_elements {
    let script_text = script.text().collect::<String>();
    let script_src = script.value().attr("src").unwrap_or("");

    // script srcからも検出
    let combined_text = format!("{} {}", script_text, script_src);

    // GA4 検出
    for cap in ga4_pattern.captures_iter(&combined_text) {
      let id = format!("G-{}", &cap[1]);
      if !ga4_ids.contains(&id) {
        ga4_ids.push(id);
      }
    }

    // UA (analytics.js) 検出
    for cap in ua_pattern.captures_iter(&combined_text) {
      let id = format!("UA-{}", &cap[1]);
      if !ua_ids.contains(&id) {
        ua_ids.push(id);
      }
    }

    // UA (gtag.js) 検出
    for cap in gtag_ua_pattern.captures_iter(&combined_text) {
      let id = format!("UA-{}", &cap[1]);
      if !ua_ids.contains(&id) {
        ua_ids.push(id);
      }
    }

    // GTM 検出
    for cap in gtm_pattern.captures_iter(&combined_text) {
      let id = format!("GTM-{}", &cap[1]);
      if !gtm_ids.contains(&id) {
        gtm_ids.push(id);
      }
    }
  }

  // noscript内のGTMも検出
  let noscript_selector = scraper::Selector::parse("noscript").unwrap();
  for noscript in document.select(&noscript_selector) {
    let noscript_html = noscript.inner_html();
    for cap in gtm_pattern.captures_iter(&noscript_html) {
      let id = format!("GTM-{}", &cap[1]);
      if !gtm_ids.contains(&id) {
        gtm_ids.push(id);
      }
    }
  }

  // 結果を格納
  if !ga4_ids.is_empty() {
    returns.insert("ga4".into(), ga4_ids.join(", "));
  }
  if !ua_ids.is_empty() {
    returns.insert("ua".into(), ua_ids.join(", "));
  }
  if !gtm_ids.is_empty() {
    returns.insert("gtm".into(), gtm_ids.join(", "));
  }

  Ok(returns)
}