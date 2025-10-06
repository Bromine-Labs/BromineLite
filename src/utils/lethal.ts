//////////////////////////////
///          Init          ///
//////////////////////////////
import { BareMuxConnection } from "@mercuryworkshop/bare-mux";

//////////////////////////////
///         Options        ///
//////////////////////////////
const connection = new BareMuxConnection("/bareworker.js");

let wispURL: string;
let transportURL: string;

export let tabCounter: number = 0;
export let currentTab: number = 0;
export let framesElement: HTMLElement;
export let currentFrame: HTMLIFrameElement;
export const addressInput: HTMLInputElement = document.getElementById(
	"address",
) as HTMLInputElement;

window.tabs = [];

const transportOptions: TransportOptions = {
	bare: "https://unpkg.com/@mercuryworkshop/bare-as-module3@2.2.5/dist/index.mjs",
	epoxy:
		"https://unpkg.com/@mercuryworkshop/epoxy-transport@2.1.27/dist/index.mjs",
	libcurl:
		"https://unpkg.com/@mercuryworkshop/libcurl-transport@1.5.0/dist/index.mjs",
};

//////////////////////////////
///           SW           ///
//////////////////////////////
const stockSW = "/ultraworker.js";
const swAllowedHostnames = ["localhost", "127.0.0.1"];

async function registerSW(): Promise<void> {
	if (!navigator.serviceWorker) {
		if (
			location.protocol !== "https:" &&
			!swAllowedHostnames.includes(location.hostname)
		)
		throw new Error("Service workers cannot be registered without https.");

		throw new Error("Your browser doesn't support service workers.");
	}

	await navigator.serviceWorker.register(stockSW);



}


requestIdleCallback(async () => {
	await import("@/assets/scram/scramjet.all.js");

	const { ScramjetController } = $scramjetLoadController();
	const scramjet = new ScramjetController({
		files: {
			wasm: "/scram/scramjet.wasm.wasm",
			all: "/scram/scramjet.all.js",
			sync: "/scram/scramjet.sync.js",
		},
		flags: {
			rewriterLogs: false,
			scramitize: false,
			cleanErrors: true,
		},
		siteFlags: {
			"https://worker-playground.glitch.me/.*": {
				serviceworkers: true,
			},
		},
	});
	scramjet.init();
	window.scramjet = scramjet;
	registerSW()
	.then(() => console.log("lethal.js: Service Worker registered"))
	.catch((err) =>
				 console.error("lethal.js: Failed to register Service Worker", err),
				);
				new Tab()
});


//////////////////////////////
///        Functions       ///
//////////////////////////////
export function makeURL(
	input: string,
	template = "https://duckduckgo.com/search?q=%s",
): string {
		try {
			return new URL(input).toString();
		} catch (err) { }

		try {
			const url = new URL(`http://${input}`);
				if (url.hostname.includes(".")) return url.toString();

		} catch (err) { }


		return template.replace("%s", encodeURIComponent(input));
	}

	async function updateBareMux(): Promise<void> {
		if (transportURL != null && wispURL != null) {
			console.log(
				`lethal.js: Setting BareMux to ${transportURL} and Wisp to ${wispURL}`,
			);

			await connection.setTransport(transportURL, [{wisp: wispURL}])
		}
	}

	export async function setTransport(transport: Transport): Promise<void> {
		console.log(`lethal.js: Setting transport to ${transport}`);
		transportURL = transportOptions[transport];
		if (!transportURL) {

			transportURL = transport;
		}


		await updateBareMux();
	}

	export function getTransport(): string {
		return transportURL;
	}

	export async function setWisp(wisp: string): Promise<void> {
		console.log(`lethal.js: Setting Wisp to ${wisp}`);
		wispURL = wisp;

		await updateBareMux();
	}

	export function getWisp(): string {
		return wispURL;
	}

	export async function getProxied(input: string): Promise<any> {

		if (input.startsWith("bromine://")) {
			return input.replace("bromine://", "/")
		}


		const url = makeURL(input);

		return scramjet.encodeUrl(url);
	}

	export function setFrames(frames: HTMLElement): void {
		framesElement = frames;
	}

	export class Tab {
		frame: HTMLIFrameElement;
		tabNumber: number;
		title: string = "New Tab";
		url: string = "bromine://newtab";

		constructor() {
			tabCounter++;
			this.tabNumber = tabCounter;

			this.frame = scramjet.createFrame();
			this.frame.frame.setAttribute("class", "w-full h-full border-0 fixed");
			this.frame.frame.setAttribute("class", "w-full h-full border-0 absolute");
			this.frame.frame.setAttribute("title", "Proxy Frame");
			this.frame.frame.setAttribute("src", "/newtab")
			this.frame.frame.setAttribute("id", `frame-${tabCounter}`);
			framesElement.appendChild(this.frame.frame);

			window.tabs.push(this);

			this.switch();

			this.frame.addEventListener("urlchange", (e) => {
				this.handleLoad(e.url);
			});



			document.dispatchEvent(
				new CustomEvent("new-tab", {
					detail: {
						tabNumber: tabCounter,
						tab: this,
					},
				}),
			);
		}

		switch(): void {
			currentTab = this.tabNumber;
			let frames = framesElement.querySelectorAll("iframe");
			let framesArr = [...frames];
			framesArr.forEach((frame) => {
				frame.classList.add("hidden");
			});
			this.frame.frame.classList.remove("hidden");

			currentFrame = document.getElementById(
				`frame-${this.tabNumber}`,
			) as HTMLIFrameElement;

			addressInput.value = decodeURIComponent(
				(currentFrame?.contentWindow?.location.href ?? "")
				.split("/")
				.pop() as string,
			);

			document.dispatchEvent(
				new CustomEvent("switch-tab", {
					detail: {
						tabNumber: this.tabNumber,
					},
				}),
			);
		}

		close(): void {
			this.frame.frame.remove();

			window.tabs = window.tabs.filter(tab => tab.tabNumber !== this.tabNumber);

			document.dispatchEvent(
				new CustomEvent("close-tab", {
					detail: {
						tabNumber: this.tabNumber,
					},
				}),
			);
		}

		handleLoad(url): void {
			if (this.tabNumber !== currentTab) return;

			let title = this.frame.frame?.contentWindow?.document.title;

			this.title = title;
			this.url = url;
			try{ 
				let history = localStorage.getItem("history")
					? JSON.parse(localStorage.getItem("history") as string)
					: [];
					history = [...history, { url: url, title: title }];
					localStorage.setItem("history", JSON.stringify(history));

			} catch{}
			document.dispatchEvent(
				new CustomEvent("url-changed", {
					detail: {
						tabId: currentTab,
						title: title,
						url: url,
					},
				}),
			);
				if (url === "newtab") url = "bromine://newtab";

					if(this.frame.frame == currentFrame) addressInput.value = url;
		}
	}

	export async function newTab() {
		new Tab();
	}

	export function switchTab(tabNumber: number): void {
		const tabToSwitchTo = window.tabs.find(tab => tab.tabNumber === tabNumber);
		if (tabToSwitchTo) {
			tabToSwitchTo.switch();
		} else {
			console.warn(`lethal.js: Attempted to switch to non-existent tab #${tabNumber}`);
		}
	}

	export function closeTab(tabNumber: number): void {
		const tabToClose = window.tabs.find(tab => tab.tabNumber === tabNumber);

		if (tabToClose) {
			tabToClose.close();

			if (currentTab === tabNumber) {
				if (window.tabs.length > 0) {
					window.tabs[0].switch();
				} else {
					newTab();
				}
			}
		} else {
			console.warn(`lethal.js: Attempted to close non-existent tab #${tabNumber}`);
		}
	}
