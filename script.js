// CRITICAL: You must initialize the map object first!
//const map = L.map('map').setView([20, 0], 2);
// [Latitude, Longitude], Zoom Level

// Define the corners of the box the user is allowed to see
const indiaBounds = L.latLngBounds(
    L.latLng(6.0, 68.0),  // Southwest corner
    L.latLng(37.0, 97.0)  // Northeast corner
);

const map = L.map('map', {
    center: [22.0, 78.0],
    zoom: 5,
    maxBounds: indiaBounds,      // Restricts the area
    maxBoundsViscosity: 1.0      // Makes the edges "hard" so you can't bounce out
});
// Add the tile layer (the actual map imagery)
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap'
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
            
// Inside your locations.forEach loop:
const popupContent = `
    <div class="custom-popup-container">
        <h2 style="color: #FF4500; margin-top: 0;">${place.name}</h2>
        <span style="font-weight: bold; color: #555;">${place.date}</span>
        <hr>
        <img src="${place.img}" style="width:100%; border-radius:8px; margin-bottom:15px;">
        <div class="popup-scroll-area">
            ${place.desc}
        </div>
    </div>
`;

marker.bindPopup(popupContent, {
    maxWidth: 350,  // Makes the popup wider for long text
    minWidth: 300
});
            const travelPath = L.polyline(pathCoords, { color: '#FF4500' }).addTo(map);

            // This line is the most important for "focus"
            // It calculates the area covered by your pins and zooms to it exactly
            map.fitBounds(travelPath.getBounds(), { padding: [50, 50] });
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
