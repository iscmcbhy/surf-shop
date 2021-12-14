// Post Edit form
let postEditForm = document.getElementById("postEditForm");
    

// Add submit listener to post edit form.
postEditForm.addEventListener("submit", (event)=> {
    // Image Upload
    let imageUpload = document.getElementById("imageUpload");
    // Image Checkbox
    let images = document.querySelectorAll(".imageDeleteCheckbox");
    let imageSelected = document.querySelectorAll(".imageDeleteCheckbox:checked");
    
    let totalImagesAllowed = imageUpload.files.length + images.length - imageSelected.length;
    console.log(totalImagesAllowed);
    if(totalImagesAllowed > 4){
        event.preventDefault();
        alert("Too many image! Please delete image/reduce upload!");
    }
});