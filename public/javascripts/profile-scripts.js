const form = document.getElementById('update-profile');
const newPassword = document.getElementById('new-password');
const confirmPassword = document.getElementById('confirm-password');
const validationMessage = document.getElementById('validation-message');

let newPasswordValue = '';
let confirmPasswordValue = '';

function validatePassword(message, addClassName, removeClassName){
    validationMessage.textContent = message;
    validationMessage.classList.add(addClassName);
    validationMessage.classList.remove(removeClassName);
}

function confirmPasswordInput(){
    newPasswordValue = newPassword.value;
    confirmPasswordValue = confirmPassword.value;

    if(newPasswordValue !== confirmPasswordValue){
        validatePassword('Password mismatch!', 'flash-message-error', 'flash-message-success');
    } else {
        validatePassword('Password match!', 'flash-message-success', 'flash-message-error');
    }
}

confirmPassword.addEventListener('input', event => {
    event.preventDefault();

    confirmPasswordInput();
});

newPassword.addEventListener('input', event=> {
    event.preventDefault();

    confirmPasswordInput();
});

form.addEventListener('submit', event => {

    if(newPasswordValue !== confirmPasswordValue){
        event.preventDefault();

        const errorMessage = document.getElementById('error');

        if(!errorMessage){
            const errorMessage = document.createElement('h1');
            errorMessage.classList.add('flash-message-error');
            errorMessage.setAttribute('id', 'error');
            errorMessage.textContent = 'Password do not match!';

            const navbar = document.getElementById('navbar');
            navbar.parentNode.insertBefore(errorMessage, navbar.nextSibling);
        }
    }   
});