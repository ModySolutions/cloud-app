import "../scss/app.scss";
import Alpine from 'alpinejs'
import mask from '@alpinejs/mask'
import Utils from "./tools/Utils";

window.Alpine = Alpine;

window.addEventListener('load', () => {
    Utils.init();
    Alpine.plugin(mask);
    Alpine.start();
})

document.addEventListener('DOMContentLoaded', () => {
    // const userLanguage = navigator.language || navigator.userLanguage;
    // document.cookie = `browser_language=${userLanguage}; path=/; max-age=${60 * 60 * 24 * 7}`;
});