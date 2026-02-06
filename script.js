// CRITICAL: You must initialize the map object first!
const map = L.map('map').setView([20, 0], 2);

// Add the tile layer (the actual map imagery)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 1. Define the custom icon
const swamijiIcon = L.icon({
    iconUrl: 'parivrajaka.jpg',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: 'circular-marker'
});

// 2. Fetch the data and apply the icon
fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(locations => {
        const pathCoords = [];

        locations.forEach(place => {
            pathCoords.push(place.coords);

            const marker = L.marker(place.coords, { icon: swamijiIcon }).addTo(map);
            
            const popupContent = `
                <div style="width: 250px;">
                    <h3 style="margin:0;">${place.name}</h3>
                    <img src="${place.img}" style="width:100%; border-radius:5px; margin-top:10px;">
                    <p>${place.desc}</p>
                </div>
            `;
            marker.bindPopup(popupContent);
        });

        const travelPath = L.polyline(pathCoords, {
            color: '#FF4500',
            weight: 3,
            dashArray: '10, 10'
        }).addTo(map);

        // This ensures the map zooms to show all pins automatically
        if (pathCoords.length > 0) {
            map.fitBounds(travelPath.getBounds());
        }
    })
    .catch(error => {
        console.error('Error loading data.json:', error);
    });