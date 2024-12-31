const AppSlider = {
    init: () => {
        AppSlider.testimonial();
        AppSlider.googleReviews();
    },
    testimonial: () => {
        const sliderContainer = document.querySelector('.slider__testimonial');
        setTimeout(() => {
            AppSlider.setNavigation(sliderContainer, 'testimonial');
        }, 500);
    },
    googleReviews: () => {
        const sliderContainer = document.querySelector('.slider__google-reviews'),
            slider = sliderContainer.querySelector('.slider__google-reviews-slider'),
            slides = slider.querySelectorAll('.slider__google-reviews-container-slide');
        setTimeout(() => {
            const swiper = slider.swiper;
            AppSlider.googleReviewInit(swiper, slides)
            swiper.on('slideChange', (swiper) => {
                AppSlider.googleReviewInit(swiper, slides)
            });
            AppSlider.setNavigation(sliderContainer, 'google-reviews');
        }, 500)
    },
    googleReviewInit: (swiper, slides) => {
        const index = swiper.realIndex;
        slides.forEach((slide) => slide.classList.remove('third'));
    },
    setNavigation: (sliderContainer, type) => {
        const slider = sliderContainer.querySelector(`.slider__${type}-slider`),
            navigationContainer = sliderContainer.querySelector('.navigation'),
            sliderNavs = navigationContainer.querySelectorAll('.swiper-pagination-bullet'),
            nextButton = navigationContainer.querySelector('.next'),
            prevButton = navigationContainer.querySelector('.prev');

        nextButton.addEventListener('click', () => {
            if (!slider.swiper) return;
            slider.swiper.slideNext();
        })
        prevButton.addEventListener('click', () => {
            if (!slider.swiper) return;
            slider.swiper.slidePrev();
        })
        sliderNavs.forEach((sliderNav, slide) => {
            sliderNav.addEventListener('click', () => {
                if (!slider.swiper || slide < 0) return;
                slider.swiper.slideToLoop(slide);
            })
        })
    },
    setActive: (swiper, navs) => {
        const active = swiper.realIndex;
        if(navs.length > active) {
            navs.forEach((item) => item.classList.remove('active'));
            navs.forEach((item, i) => i === active ? item.classList.add('active') : item)
        }
    }
}

export default AppSlider;