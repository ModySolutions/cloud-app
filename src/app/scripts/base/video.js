const AppVideo = {
    init: () => {
        const videoContainers = document.querySelectorAll('.video-container')
        if(!videoContainers.length) return;

        videoContainers.forEach((elem) => {
            const video = elem.querySelector('video');
            const playButton = elem.querySelector('.play');

            playButton.addEventListener('click', () => {
                video.play();
                playButton.classList.add('playing');
            })

            video.addEventListener('click', () => {
                if(video.paused) {
                    video.play();
                    playButton.classList.add('playing');
                } else {
                    video.pause();
                    playButton.classList.remove('playing');
                }
            })
        });
    },
}

export default AppVideo;