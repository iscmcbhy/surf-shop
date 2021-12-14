mapboxgl.accessToken = 'pk.eyJ1IjoiY2hlZXplcSIsImEiOiJja3d6dThkbG0wMjVsMnZxbzJkNjMxazV3In0.MP4ZK40qD-C8-Ezarrs-rA';
    
const map = new mapboxgl.Map({
    container: 'map-container',
    style: 'mapbox://styles/mapbox/light-v10',
    center: post.coordinates,
    zoom: 5
});

// create a HTML element for each feature
const el = document.createElement('div');
el.className = 'marker';

// make a marker for each feature and add to the map
new mapboxgl.Marker(el)
    .setLngLat(post.coordinates)
    .addTo(map)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML(
            `<h3>${post.title}</h3><p>${post.location}</p>`
        )
    );