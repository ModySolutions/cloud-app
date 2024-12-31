const AppYoutube = {
    init: () => {
        const videoContainers = document.querySelectorAll('.video-block__video')
        if(!videoContainers.length) return;

        videoContainers.forEach((elem) => {
            const video = elem.querySelector('.video-block__youtube-iframe');
            const image = elem.querySelector('.video-block__cover-image');
            const playButton = elem.querySelector('.video-block__controls');

            playButton.addEventListener('click', () => {
                image.style.display = 'none';
                video.style.display = 'block';
            })
        });
    },
}

export default AppYoutube;
