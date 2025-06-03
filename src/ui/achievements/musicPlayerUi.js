// musicPlayerUi.js
import { Howl } from 'howler';

const playlist = [
    { src: 'musics/tracks/space_ambient_cinematic.mp3', name: 'Space Ambiant Cinematic - DELOSound', cover: 'musics/covers/space_ambiant_cinematic_cover.png' },
    { src: 'musics/tracks/Space Junk Galaxy - Super Mario Galaxy OST.mp3', name: 'Space Junk Galaxy - Super Mario Galaxy', cover: 'musics/covers/super_mario_galaxy_cover.png' },
    { src: 'musics/tracks/Outer Wilds - Final Voyage.mp3', name: 'Final Voyage - Outer Wilds', cover: 'musics/covers/outer_wilds_cover.png' },
    { src: 'musics/tracks/Celeste - Resurrections.mp3', name: 'Resurrections - Celeste', cover: 'musics/covers/celeste_cover.png' },
    { src: 'musics/tracks/Minecraft - C418 - Aria Math.mp3', name: 'Aria Math - Minecraft (C418)', cover: 'musics/covers/minecraft_cover.png' },
];

export let sound;
export function setBackgroundMusic() {
    sound = new Howl({
        src: [playlist[0].src],
        autoplay: true,
        loop: true,
        volume: 0.5,
    });
    sound.play();
}

export function addMusicPlayer() {


    let currentTrackIndex = 1;

    // Create UI container
    const player = document.createElement('div');
    player.id = 'music-player';
    player.style.position = 'fixed';
    player.style.bottom = '2%';
    player.style.left = '50%';
    player.style.transform = 'translateX(-50%)';
    player.style.background = '#111';
    player.style.borderRadius = '10px';
    player.style.padding = '1.2%';
    player.style.display = 'flex';
    player.style.flexDirection = 'column';
    player.style.alignItems = 'center';
    player.style.gap = '1%';
    player.style.zIndex = '9999';
    player.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    player.style.color = '#fff';
    player.style.fontFamily = 'sans-serif';
    player.style.fontSize = '0.9vw';
    player.style.width = '60vw';
    player.style.maxWidth = '320px';
    player.style.minWidth = '140px';

    // Controls row
    const controlsRow = document.createElement('div');
    controlsRow.style.display = 'flex';
    controlsRow.style.justifyContent = 'center';
    controlsRow.style.gap = '20px';

    const prevBtn = document.createElement('button');
    const prevImg = document.createElement('img');
    prevImg.src = 'icons/musicPlayerIcons/previous_song_button_icon.png';
    prevImg.alt = 'prevBtn';
    prevImg.style.width = '10px';
    prevImg.style.height = '10px';
    prevBtn.appendChild(prevImg);


    const playPauseBtn = document.createElement('button');
    const playImg = document.createElement('img');
    playImg.src = 'icons/musicPlayerIcons/play_song_button_icon.png';
    playImg.alt = 'playBtn';
    playImg.style.width = '10px';
    playImg.style.height = '10px';
    playPauseBtn.appendChild(playImg);

    const nextBtn = document.createElement('button');
    const nextImg = document.createElement('img');
    nextImg.src = 'icons/musicPlayerIcons/next_song_button_icon.png';
    nextImg.alt = 'nextBtn';
    nextImg.style.width = '10px';
    nextImg.style.height = '10px';
    nextBtn.appendChild(nextImg);

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
    const volumeImg = document.createElement('img');
    volumeImg.src = 'icons/musicPlayerIcons/volume_button_icon.png';
    volumeImg.alt = 'Volume';
    volumeImg.style.width = '10px';
    volumeImg.style.height = '10px';
    volumeIcon.appendChild(volumeImg);

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
    trackName.style.marginTop = '2px';

    // Append all rows
    player.appendChild(trackName);
    player.appendChild(contentRow);
    player.appendChild(controlsRow);
    document.body.appendChild(player);

    // Logic
    function loadTrack(index) {
        if (sound) sound.unload();

        const track = playlist[index];
        cover.src = track.cover;
        trackName.textContent = track.name;

        sound = new Howl({
            src: [track.src],
            loop: false,
            volume: parseFloat(volumeSlider.value),
            onend: () => nextTrack(),
            onplay: () => requestAnimationFrame(updateProgress)
        });
    }

    function setPlayPauseIcon(isPlaying) {
        playImg.src = isPlaying
            ? 'icons/musicPlayerIcons/pause_song_button_icon.png'
            : 'icons/musicPlayerIcons/play_song_button_icon.png';
    }

    function togglePlayPause() {
        if (sound.playing()) {
            sound.pause();
            setPlayPauseIcon(false);
        } else {
            sound.play();
            setPlayPauseIcon(true);
        }
    }

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        sound.play();
        setPlayPauseIcon(true);
    }

    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        sound.play();
        setPlayPauseIcon(true);
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
    togglePlayPause();
}
