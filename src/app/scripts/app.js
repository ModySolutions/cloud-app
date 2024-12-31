import AOS from 'aos';
import 'aos/dist/aos.css';
import "../scss/app.scss";
import AppMenu from "./base/menu";
import Tabs from "./blocks/tabs";
import { register } from 'swiper/element/bundle';
import AppVideo from "./base/video";
import AppSlider from "./blocks/slider";
import AppYoutube from "./base/youtube";

window.addEventListener('load', () => {
    AOS.init({
        once: true,
    });
    AppMenu.init();
    Tabs.init();
    AppVideo.init();
    AppYoutube.init();
    AppSlider.init();
    register()
})
