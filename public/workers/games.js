// worker.js

self.onmessage = async (event) => {
    const { api, api2 } = event.data;

    try {
        const response1 = await fetch(`${api}/g.json`);
        const games1 = await response1.json();

        const response2 = await fetch(`${api2}/g.json`);
        const games2 = await response2.json();

        const allGames = [
            ...games1.map(g => ({ ...g, apiUrl: api })),
            ...games2.map(g => ({ ...g, apiUrl: api2 }))
        ];

        self.postMessage({ status: 'success', data: allGames });
    } catch (err) {
        self.postMessage({ status: `${err.message}`, error: err.message });
    }
};
