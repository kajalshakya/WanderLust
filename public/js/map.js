// Set Mapbox access token
mapboxgl.accessToken = mapToken;

// Initialize the Mapbox map
const map = new mapboxgl.Map({
    container: 'map',
    center:listing.geometry.coordinates, // Default coordinates (New Delhi)
    zoom: 8
});

// Create a red marker for the listing location
const marker = new mapboxgl.Marker({color:'red'})
    .setLngLat(listing.geometry.coordinates)
    // Add a popup with listing location details
    .setPopup(new mapboxgl.Popup({offset:25})
    .setHTML(`<h4>${listing.location}</h4><p>Exact Location will be provided after booking`))
    .addTo(map);

// Create a custom compass marker element
const compassElement = document.createElement('div');
compassElement.style.width = '30px';
compassElement.style.height = '30px';
compassElement.style.position = 'relative';

// Add Font Awesome compass icon inside the custom marker
compassElement.innerHTML = `
    <i class="fa-solid fa-compass"
       style="
           color: #fe424d;
           font-size: 28px;
           position: absolute;
           left: 25px;
           top: -14px;
       ">
    </i>
`;

// Add the custom compass marker to the map
new mapboxgl.Marker({
    element: compassElement,
    anchor: 'center'
})
.setLngLat(listing.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({ offset: 25 })
    // Display WanderLust branding in the popup
    .setHTML(`
        <h4>🌍 WanderLust</h4>
        <p>Not all those who wander are lost!</p>
    `)
)
.addTo(map);

// Add a red transparent circle around the listing location
map.on('load', () => {
    // Add a GeoJSON source containing the listing coordinates
    map.addSource('location-circle', {
        type: 'geojson',
        data: {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: listing.geometry.coordinates
            }
        }
    });

    // Add a circle layer to highlight the listing location
    map.addLayer({
        id: 'location-circle',
        type: 'circle',
        source: 'location-circle',
        paint: {
            'circle-radius': 35,
            'circle-color': '#fe424d',
            'circle-opacity': [
                'step',
                ['zoom'],
                0,
                12, 0.18
            ],
            'circle-stroke-color': '#fe424d',
            'circle-stroke-width': 1,
            'circle-stroke-opacity': [
                'step',
                ['zoom'],
                0,
                12, 0.5
            ]
        }
    });
});