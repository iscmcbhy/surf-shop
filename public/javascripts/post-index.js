const clear = document.getElementById('clear-distance');

clear.addEventListener('click', event => {
    event.preventDefault();

    document.getElementById('location').value = '';
    document.querySelector('input[type=radio]:checked').checked = false;
    
});