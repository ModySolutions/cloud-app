import "../scss/app.scss";
import Alpine from 'alpinejs'
import SignIn from "./auth/Sign-in";
import SignUp from "./auth/Sign-up";
import ResetPassword from "./auth/Reset-password";

window.Alpine = Alpine;

window.addEventListener('load', () => {
    SignUp.init();
    SignIn.init();
    ResetPassword.init();
    Alpine.start();
})
