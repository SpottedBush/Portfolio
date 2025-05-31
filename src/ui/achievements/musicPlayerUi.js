// musicPlayerUi.js

function createPlayerContainer() {
    const player = document.createElement('div');
    Object.assign(player.style, {
        position: 'fixed',
        left: '50%',
        bottom: '30px',
        transform: 'translateX(-50%)',
        background: 'rgba(30,30,30,0.95)',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        padding: '10px 24px',
        zIndex: 9999,
        gap: '16px'
    });
    return player;
}

function getMusicFiles() {
    return [
        'musics/tracks/test1.mp3',
        'musics/tracks/test2.mp3',
    ];
}

function createHeader(musicFiles, currentTrack) {
    const header = document.createElement('div');
    Object.assign(header.style, {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '8px',
        gap: '16px'
    });

    const coverImg = document.createElement('img');
    Object.assign(coverImg.style, {
        width: '48px',
        height: '48px',
        objectFit: 'cover',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    });
    coverImg.src = getCoverSrc(musicFiles[currentTrack]);

    const trackTitle = document.createElement('span');
    Object.assign(trackTitle.style, {
        color: '#1DB954', // Spotify green
        fontSize: '18px',
        fontWeight: 'bold'
    });
    trackTitle.textContent = getTrackTitle(musicFiles[currentTrack]);

    header.appendChild(coverImg);
    header.appendChild(trackTitle);

    return { header, coverImg, trackTitle };
}

function getCoverSrc(musicFile) {
    const fileName = musicFile.split('/').pop().replace('.mp3', '.png');
    return `musics/covers/${fileName}`;
}

function getTrackTitle(musicFile) {
    return musicFile.split('/').pop().replace('.mp3', '');
}

function createAudioElement(src) {
    const audio = document.createElement('audio');
    audio.src = src;
    audio.preload = 'auto';
    return audio;
}

function createButton(label, title) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.title = title;
    Object.assign(btn.style, {
        fontSize: '20px',
        margin: '0 8px',
        background: 'none',
        border: 'none',
        color: '#fff',
        cursor: 'pointer',
        outline: 'none',
        padding: '6px 10px',
        borderRadius: '6px'
    });
    btn.onmouseover = () => btn.style.background = 'rgba(255,255,255,0.1)';
    btn.onmouseout = () => btn.style.background = 'none';
    return btn;
}

function createTrackName(musicFiles, currentTrack) {
    const trackName = document.createElement('span');
    Object.assign(trackName.style, {
        color: '#fff',
        fontSize: '16px',
        margin: '0 12px'
    });
    trackName.textContent = musicFiles[currentTrack].split('/').pop();
    return trackName;
}

function updateTrackInfo({ musicFiles, currentTrack, trackTitle, coverImg, trackName, audio }) {
    const fileName = musicFiles[currentTrack].split('/').pop();
    trackTitle.textContent = fileName.replace('.mp3', '');
    coverImg.src = getCoverSrc(musicFiles[currentTrack]);
    trackName.textContent = fileName;
    audio.src = musicFiles[currentTrack];
}

export function addMusicPlayer() {
    if (document.getElementById('achievement-music-player')) return;

    const musicFiles = getMusicFiles();
    let currentTrack = 0;
    let isPlaying = false;

    const player = createPlayerContainer();
    player.id = 'achievement-music-player';

    // Header
    const { header, coverImg, trackTitle } = createHeader(musicFiles, currentTrack);
    player.appendChild(header);

    // Audio
    const audio = createAudioElement(musicFiles[currentTrack]);

    // Track name
    const trackName = createTrackName(musicFiles, currentTrack);

    // Controls
    const prevBtn = createButton('⏮️', 'Previous');
    const playBtn = createButton('▶️', 'Play/Pause');
    const nextBtn = createButton('⏭️', 'Next');

    function playTrack() {
        audio.play();
    }

    function pauseTrack() {
        audio.pause();
    }

    function goToTrack(index) {
        currentTrack = (index + musicFiles.length) % musicFiles.length;
        updateTrackInfo({ musicFiles, currentTrack, trackTitle, coverImg, trackName, audio });
        if (isPlaying) playTrack();
    }

    prevBtn.onclick = () => goToTrack(currentTrack - 1);
    nextBtn.onclick = () => goToTrack(currentTrack + 1);

    playBtn.onclick = () => {
        if (audio.paused) playTrack();
        else pauseTrack();
    };

    audio.onplay = () => {
        isPlaying = true;
        playBtn.textContent = '⏸️';
    };
    audio.onpause = () => {
        isPlaying = false;
        playBtn.textContent = '▶️';
    };
    audio.onended = () => nextBtn.onclick();

    audio.onloadedmetadata = () => {
        trackName.textContent = musicFiles[currentTrack].split('/').pop();
    };

    // Assemble
    player.appendChild(prevBtn);
    player.appendChild(playBtn);
    player.appendChild(nextBtn);
    player.appendChild(trackName);
    player.appendChild(audio);

    document.body.appendChild(player);
}