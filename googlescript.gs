function doGet(e) {
  const file = "games.html";
  const cache = CacheService.getScriptCache();
  let html = cache.get(file);

  if (!html) {
    const url = `https://cdn.jsdelivr.net/gh/Bromine-labs/BromineLite@main/${file}?t=${Date.now()}`;
    html = UrlFetchApp.fetch(url).getContentText();
    cache.put(file, html, 300); // cache for 5 minutes
  }

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
