  try {
    const res = await fetch('https://raw.githubusercontent.com/bromine-labs/bromine/main/src/assets/gmes.json');
    window.gmesData = await res.json();
  } catch (err) {
    console.error("Failed to fetch JSON:", err);
  }

(() => {

	const target = document.querySelector("#gmeContainer");
	const searchInput = document.getElementById("search");

  searchInput.placeholder = `Search from ${gmesData.length} games`

	if (!target) {
		console.error("Target container #gmeContainer not found.");
		return;
	}

	if (!searchInput) {
		console.error("Search input with id 'search' not found.");
		return;
	}

	target.innerHTML = "<p style='text-align: center; font-family: sans-serif; color: #555;'>Loading gmes...</p>";

	const gmePageContainerHtml = `
        <div id="gmePageContainer" style="
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #fff;
            z-index: 999;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding: 20px;
            box-sizing: border-box;
            overflow: auto;
        ">
            <button onclick="closegme()" style="
                position: absolute;
                top: 10px;
                right: 10px;
                padding: 10px 15px;
                font-size: 16px;
                cursor: pointer;
                background-color: #dc3545;
                color: white;
                border: none;
                border-radius: 5px;
                z-index: 1000;
            ">Close Gme</button>
            <h2 id="gmePageTitle" style="margin-top: 20px; color: #333;"></h2>
            <iframe id="gmePageFrame" src="" frameborder="0" style="
                width: 100%;
                height: calc(100% - 70px);
                border: none;
                margin-top: 10px;
            "></iframe>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', gmePageContainerHtml);

    const allGmes = gmesData;

    const renderGmes = (gmesToRender) => {
        if (gmesToRender.length === 0) {
            target.innerHTML = "<p style='text-align: center; font-family: sans-serif; color: #555;'>No gmes found.</p>";
            return;
        }

        const gmesHtml = gmesToRender.map(gme => `
            <div
              onclick="opengme('${gme.alt}', '${gme.title}', '${gme.frame}')"
              class="bg-base border border-overlay rounded-xl p-3 m-2 inline-block w-64 text-center shadow-sm transition-transform duration-200 hover:scale-105 cursor-pointer"
            >
              <h3 class="mt-2 font-medium text-text truncate">${gme.title}</h3>
            </div>
        `).join('');

        target.innerHTML = `<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 10px;">${gmesHtml}</div>`;
    };

    searchInput.addEventListener("input", (event) => {
        const searchQuery = event.target.value.toLowerCase();
        const filteredGmes = allGmes.filter(gme =>
            gme.title.toLowerCase().includes(searchQuery)
        );
        renderGmes(filteredGmes);
    });

    renderGmes(allGmes);




window.opengme = async (alt, title, frameGme) => {
    const frame = document.getElementById("gmePageFrame");
    const container = document.getElementById("gmePageContainer");
    const titleEl = document.getElementById("gmePageTitle");

    titleEl.textContent = title;
    container.style.display = "flex";
    document.body.style.overflow = "hidden";

        frame.src = `https://raw.githack.com/Bromine-Labs/asseting-bromine/main/${alt}`;
};



		window.closegme = () => {
			const gmePageContainer = document.getElementById("gmePageContainer");
			const gmePageFrame = document.getElementById("gmePageFrame");

			gmePageFrame.src = "";
			gmePageContainer.style.display = "none";
			document.body.style.overflow = '';
		};

		document.getElementById("backBtn").addEventListener("click", () => {
			closegme();
		})
		document.getElementById("fullscreenBtn").addEventListener("click", () => {
			document.getElementById("gmePageFrame").requestFullscreen();
		})
})();
