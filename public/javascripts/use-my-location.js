function geoFindMyLocation(event){
    event.preventDefault();

    const status = document.querySelector('#status');
    const locationInput = document.querySelector('#location');

    function success(position){
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
    
        status.textContent = '';
        locationInput.value = `[${longitude}, ${latitude}]`;
    }
    
    function error(){
        status.textContent = 'Unable to retrieve location.';

    }
    

    if(!navigator.geolocation) {
        status.textContent = 'Geolocation is not supported on your browser!';
    } else {
        status.textContent = 'Locating.....';

        navigator.geolocation.getCurrentPosition(success, error);
    }
}

document.querySelector('#use-my-location').addEventListener('click', geoFindMyLocation);