document.addEventListener('DOMContentLoaded', function() {
    const players = document.querySelectorAll('.audio-player');
    players.forEach(player => {
        const audio = player.querySelector('audio');
        const playPauseButton = player.querySelector('.play-pause');
        const progress = player.querySelector('.progress');
        const time = player.querySelector('.time');
        const duration = player.querySelector('.duration');
        const skipBackwardButton = player.querySelector('.skip.backward');
        const skipForwardButton = player.querySelector('.skip.forward');
        const volume = player.querySelector('.volume');
        const muteButton = player.querySelector('.mute');
        const speed = player.querySelector('.speed');
        const canvas = player.querySelector('canvas');
        const themeToggleButton = player.querySelector('.theme-toggle');
        const ctx = canvas.getContext('2d');
        let isMuted = false;
        let isDarkTheme = true;

        playPauseButton.addEventListener('click', function() {
            if (audio.paused) {
                audio.play();
                playPauseButton.textContent = 'Pause';
            } else {
                audio.pause();
                playPauseButton.textContent = 'Play';
            }
        });

        skipBackwardButton.addEventListener('click', function() {
            audio.currentTime = Math.max(0, audio.currentTime - 10);
        });

        skipForwardButton.addEventListener('click', function() {
            audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
        });

        audio.addEventListener('timeupdate', function() {
            const currentTime = audio.currentTime;
            const totalDuration = audio.duration;
            progress.value = (currentTime / totalDuration) * 100;
            time.textContent = formatTime(currentTime);
            duration.textContent = formatTime(totalDuration);
            drawWaveform();
        });

        progress.addEventListener('input', function() {
            const totalDuration = audio.duration;
            audio.currentTime = (progress.value / 100) * totalDuration;
        });

        volume.addEventListener('input', function() {
            audio.volume = volume.value;
        });

        muteButton.addEventListener('click', function() {
            isMuted = !isMuted;
            audio.muted = isMuted;
            muteButton.textContent = isMuted ? 'Unmute' : 'Mute';
        });

        speed.addEventListener('change', function() {
            audio.playbackRate = speed.value;
        });

        themeToggleButton.addEventListener('click', function() {
            isDarkTheme = !isDarkTheme;
            document.body.classList.toggle('dark-theme', isDarkTheme);
        });

        audio.addEventListener('ended', function() {
            playPauseButton.textContent = 'Play';
            const nextPlayer = player.nextElementSibling;
            if (nextPlayer && nextPlayer.classList.contains('audio-player')) {
                nextPlayer.querySelector('audio').play();
                nextPlayer.querySelector('.play-pause').textContent = 'Pause';
            }
        });

        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }

        function drawWaveform() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = isDarkTheme ? '#fff' : '#000';
            const width = canvas.width;
            const height = canvas.height;
            const bufferLength = 256;
            const dataArray = new Uint8Array(bufferLength);
            audioContext.createAnalyser().getByteTimeDomainData(dataArray);
            ctx.lineWidth = 2;
            ctx.strokeStyle = isDarkTheme ? '#fff' : '#000';
            ctx.beginPath();
            const sliceWidth = width * 1.0 / bufferLength;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * height / 2;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                x += sliceWidth;
            }
            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
        }
    });
});
