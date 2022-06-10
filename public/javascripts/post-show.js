mapboxgl.accessToken = mapBoxToken;
    
var map = new mapboxgl.Map({
    container: 'map-container',
    style: 'mapbox://styles/mapbox/light-v10',
    center: post.geometry.coordinates,
    zoom: 5
});

// create a HTML element for each feature
var el = document.createElement('div');
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
    // toggle the edit button text on click
	$(this).text() === 'Edit' ? $(this).text('Cancel') : $(this).text('Edit');
	// toggle visibility of the edit review form
	$(this).parent().siblings('.edit-review-form-container').toggle();
});

// make a marker for each feature and add to the map
new mapboxgl.Marker(el)
            .setLngLat(post.geometry.coordinates)
            .addTo(map)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML(
                    `<h3>${post.title}</h3><p>${post.location}</p>`
                )
            );


$(".clear-rating").on("click", function(){
    $(this).parent().parent().children('fieldset').children('.input-no-rate').click();
});