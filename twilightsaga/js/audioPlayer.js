document.addEventListener('DOMContentLoaded', () => {
	const audioPlayers = document.querySelectorAll('.audio-player');
	audioPlayers.forEach(player => {
		const audio = player.querySelector('audio');
		const playPauseBtn = player.querySelector('.play-pause');
		const progress = player.querySelector('.progress');
		const timeEl = player.querySelector('.time');
		const durationEl = player.querySelector('.duration');
		const skipBackward = player.querySelector('.skip.backward');
		const skipForward = player.querySelector('.skip.forward');
		const speedSelect = player.querySelector('.speed');

		// Toggle play/pause and update button text
		playPauseBtn.addEventListener('click', () => {
			if (audio.paused) {
				audio.play();
				playPauseBtn.textContent = 'Pause';
			} else {
				audio.pause();
				playPauseBtn.textContent = 'Play';
			}
		});

		// Update progress and duration
		audio.addEventListener('loadedmetadata', () => {
			progress.max = audio.duration;
			durationEl.textContent = formatTime(audio.duration);
		});
		audio.addEventListener('timeupdate', () => {
			progress.value = audio.currentTime;
			timeEl.textContent = formatTime(audio.currentTime);
		});

		// Seek functionality
		progress.addEventListener('input', () => {
			audio.currentTime = progress.value;
		});

		// Skip backward/forward 10 seconds
		skipBackward.addEventListener('click', () => {
			audio.currentTime = Math.max(0, audio.currentTime - 10);
		});
		skipForward.addEventListener('click', () => {
			audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
		});

		// Change playback speed
		speedSelect.addEventListener('change', () => {
			audio.playbackRate = speedSelect.value;
			audio.load();
		});
	});
	
	// Helper to format time in mm:ss
	function formatTime(seconds) {
		const min = Math.floor(seconds / 60);
		const sec = Math.floor(seconds % 60);
		return `${min}:${sec < 10 ? '0' : ''}${sec}`;
	}
});
