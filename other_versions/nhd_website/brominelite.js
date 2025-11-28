

  document.addEventListener("keydown", function(event) {
    // change this to all_in_one, games, or proxy
    const file = "games"
    
      if (event.key === "r") {

      try {
        fetch(`https://cdn.jsdelivr.net/gh/Bromine-labs/BromineLite@main/${file}.html?t=`+Date.now())
          .then(response => response.text())
          .then(html => {
                document.documentElement.innerHTML = html;

                document.documentElement.querySelectorAll('script').forEach(oldScript => {
                    const newScript = document.createElement('script');
                    if (oldScript.src) {
                        newScript.src = oldScript.src;
                    } else {
                        newScript.textContent = oldScript.textContent;
                    }
                    document.body.appendChild(newScript);
                });
          });
      } catch (error) {
        console.error('error:', error);
      }
      }
  });
