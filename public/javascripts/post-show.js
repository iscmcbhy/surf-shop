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

// const toggleEditBtns = document.getElementsByClassName("toggle-edit-form");

// Plain JavaScript no JQuery
// for(const editBtn of toggleEditBtns) {
//     editBtn.addEventListener("click", (btnElement)=> {
//         let innerText = btnElement.target.innerHTML;
//         let editForm = btnElement.target.nextElementSibling;
        
//         if(innerText === "Edit"){
//             btnElement.target.innerHTML = "Cancel";
//         } else {
//             btnElement.target.innerHTML = "Edit";
//         }

//         let param = editForm.style.display;
        
//         param === "none" ? param = "block" : param = "none";

//         editForm.style.display = param;
//     });
// }

// Jquery
$(".toggle-edit-form").on("click", function() {
    $(this).text() === "Edit" ? $(this).text("Cancel") : $(this).text("Edit");
    $(this).siblings().toggle()
});

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


$(".clear-rating").on("click", function(){
    $("#no-rate-toggle-edit").click();
});