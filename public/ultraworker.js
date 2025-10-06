importScripts("/workerware/workerware.js")
importScripts("/alu-adblocker.js")
importScripts("/scram/scramjet.all.js");


if (navigator.userAgent.includes("Firefox")) {
	Object.defineProperty(globalThis, "crossOriginIsolated", {
		value: true,
		writable: true,
	})
}

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

const ww = new WorkerWare({});



async function handleRequest(event) {
	let mwResponse = await ww.run(event)();
	if (mwResponse.includes(null))
		return;


	if (scramjet.route(event)) {
		await scramjet.loadConfig();
		return scramjet.fetch(event)
	}

	return await fetch(event.request)
}

self.addEventListener("fetch", (event) => {
	event.respondWith(handleRequest(event))
})

