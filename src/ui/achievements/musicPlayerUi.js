// musicPlayerUi.js
import { Howl } from 'howler';

export function addMusicPlayer() {
    const playlist = [
        { src: 'musics/tracks/test1.mp3', name: 'Test Track 1' },
        { src: 'musics/tracks/test2.mp3', name: 'Test Track 2' },
        { src: 'musics/tracks/test3.mp3', name: 'Test Track 3' }
    ];

    let currentTrackIndex = 0;
    let sound;

    // Create UI container
    const player = document.createElement('div');
    player.id = 'music-player';
    player.style.position = 'fixed';
    player.style.bottom = '20px';
    player.style.left = '50%';
    player.style.transform = 'translateX(-50%)';
    player.style.background = '#111';
    player.style.borderRadius = '12px';
    player.style.padding = '16px';
    player.style.display = 'flex';
    player.style.flexDirection = 'column';
    player.style.alignItems = 'center';
    player.style.gap = '12px';
    player.style.zIndex = '9999';
    player.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
    player.style.color = '#fff';
    player.style.fontFamily = 'sans-serif';
    player.style.fontSize = '14px';
    player.style.minWidth = '400px';

    // Controls row
    const controlsRow = document.createElement('div');
    controlsRow.style.display = 'flex';
    controlsRow.style.justifyContent = 'center';
    controlsRow.style.gap = '20px';

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '⏮️';

    const playPauseBtn = document.createElement('button');
    playPauseBtn.textContent = '▶️';

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '⏭️';

    controlsRow.appendChild(prevBtn);
    controlsRow.appendChild(playPauseBtn);
    controlsRow.appendChild(nextBtn);

    // Content row
    const contentRow = document.createElement('div');
    contentRow.style.display = 'flex';
    contentRow.style.alignItems = 'center';
    contentRow.style.gap = '12px';
    contentRow.style.width = '100%';

    const cover = document.createElement('img');
    cover.style.width = '60px';
    cover.style.height = '60px';
    cover.style.objectFit = 'cover';
    cover.style.borderRadius = '8px';

    const progressBar = document.createElement('input');
    progressBar.type = 'range';
    progressBar.min = 0;
    progressBar.max = 100;
    progressBar.value = 0;
    progressBar.style.flex = '1';

    const volumeContainer = document.createElement('div');
    volumeContainer.style.display = 'flex';
    volumeContainer.style.alignItems = 'center';
    volumeContainer.style.gap = '6px';

    const volumeIcon = document.createElement('span');
    volumeIcon.textContent = '🔊';

    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = 0;
    volumeSlider.max = 1;
    volumeSlider.step = 0.01;
    volumeSlider.value = 0.5;

    volumeContainer.appendChild(volumeIcon);
    volumeContainer.appendChild(volumeSlider);

    contentRow.appendChild(cover);
    contentRow.appendChild(progressBar);
    controlsRow.appendChild(volumeContainer);

    // Track name row
    const trackName = document.createElement('div');
    trackName.style.textAlign = 'center';
    trackName.style.marginTop = '4px';

    // Append all rows
    player.appendChild(trackName);
    player.appendChild(contentRow);
    player.appendChild(controlsRow);
    document.body.appendChild(player);

    // Logic
    function loadTrack(index) {
        if (sound) sound.unload();

        const track = playlist[index];
        const fileName = track.src.split('/').pop().split('.')[0];
        cover.src = `musics/${fileName}.jpg`;
        trackName.textContent = track.name;

        sound = new Howl({
            src: [track.src],
            loop: false,
            volume: parseFloat(volumeSlider.value),
            onend: () => nextTrack(),
            onplay: () => requestAnimationFrame(updateProgress)
        });
    }

    function togglePlayPause() {
        if (sound.playing()) {
            sound.pause();
            playPauseBtn.textContent = '▶️';
        } else {
            sound.play();
            playPauseBtn.textContent = '⏸️';
        }
    }

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        sound.play();
        playPauseBtn.textContent = '⏸️';
    }

    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        sound.play();
        playPauseBtn.textContent = '⏸️';
    }

    function updateProgress() {
        if (!sound.playing()) return;
        const seek = sound.seek() || 0;
        progressBar.value = (seek / sound.duration()) * 100;
        requestAnimationFrame(updateProgress);
    }

    progressBar.addEventListener('input', () => {
        const seekTime = (progressBar.value / 100) * sound.duration();
        sound.seek(seekTime);
    });

    volumeSlider.addEventListener('input', () => {
        if (sound) sound.volume(parseFloat(volumeSlider.value));
    });

    playPauseBtn.onclick = togglePlayPause;
    nextBtn.onclick = nextTrack;
    prevBtn.onclick = prevTrack;

    loadTrack(currentTrackIndex);
}
