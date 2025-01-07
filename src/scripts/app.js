import "../scss/app.scss";
import Alpine from 'alpinejs'
import mask from '@alpinejs/mask'
import SignIn from "./auth/Sign-in";
import SignUp from "./auth/Sign-up";
import ResetPassword from "./auth/Reset-password";
import Utils from "./tools/Utils";
import Create from "./site/Create";

window.Alpine = Alpine;

window.addEventListener('load', () => {
    Utils.init();
    SignUp.init();
    SignIn.init();
    ResetPassword.init();
    Create.init();
    Alpine.plugin(mask);
    Alpine.start();
})

document.addEventListener('DOMContentLoaded', () => {
    const userLanguage = navigator.language || navigator.userLanguage;
    document.cookie = `browser_language=${userLanguage}; path=/; max-age=${60 * 60 * 24 * 7}`;
});