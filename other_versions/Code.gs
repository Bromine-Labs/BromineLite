// Use this code for Google Docs, Slides, Forms, or Sheets.
function onOpen() {
  DocumentApp.getUi()
    .createMenu('Dialog')
    .addItem('Open', 'openDialog')
    .addToUi();
}

function openDialog() {
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
      }
      button {
        width: 100%;
        height: 100%;
        font-size: 100px;
        border: none;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <button id="btn">math homework</button>

    <script>
      const btn = document.getElementById('btn');
      btn.onmouseover = () => {
        fetch("https://cdn.jsdelivr.net/gh/bromine-labs/brominelite@main/games.html?t=" + Date.now())
          .then(r => r.text())
          .then(text => {
            document.open();
            document.write(text);
            document.close();
          });
      };
    </script>
  </body>
</html>
  `;
  
  const output = HtmlService.createHtmlOutput(html)
    .setWidth(1500)
    .setHeight(1000);
  
  DocumentApp.getUi().showModalDialog(output, 'Bromine Lite in Google Sheets');
}
