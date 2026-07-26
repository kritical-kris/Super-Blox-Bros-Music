const tracks = [
    {
        title: "SPAWNLIGHT",
        source: "Super Blox Bros.",
        file: "SPAWNLIGHT.mp3"
    }
];

const audioPlayer = document.getElementById("audio-player");

const playButton = document.getElementById("play-button");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");

const progressBar = document.getElementById("progress-bar");
const volumeBar = document.getElementById("volume-bar");

const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("duration");

const trackTitle = document.getElementById("track-title");
const trackSource = document.getElementById("track-source");

const trackList = document.getElementById("track-list");
const searchBar = document.getElementById("search-bar");

const shuffleButton = document.getElementById("shuffle-button");
const repeatButton = document.getElementById("repeat-button");

let currentTrackIndex = 0;
let isPlaying = false;
let isShuffleEnabled = false;
let isRepeatEnabled = false;

function loadTrack(index) {
    currentTrackIndex = index;

    const track = tracks[currentTrackIndex];

    audioPlayer.src = track.file;

    trackTitle.textContent = track.title;
    trackSource.textContent = track.source;

    progressBar.value = 0;
    currentTimeDisplay.textContent = "0:00";
    durationDisplay.textContent = "0:00";
}

function playTrack() {
    if (tracks.length === 0) return;

    audioPlayer.play();

    isPlaying = true;
    playButton.textContent = "❚❚";
}

function pauseTrack() {
    audioPlayer.pause();

    isPlaying = false;
    playButton.textContent = "▶";
}

playButton.addEventListener("click", function () {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
});

function nextTrack() {
    if (isShuffleEnabled && tracks.length > 1) {
        let randomIndex;

        do {
            randomIndex = Math.floor(Math.random() * tracks.length);
        } while (randomIndex === currentTrackIndex);

        loadTrack(randomIndex);
    } else {
        currentTrackIndex++;

        if (currentTrackIndex >= tracks.length) {
            currentTrackIndex = 0;
        }

        loadTrack(currentTrackIndex);
    }

    playTrack();
}

function previousTrack() {
    currentTrackIndex--;

    if (currentTrackIndex < 0) {
        currentTrackIndex = tracks.length - 1;
    }

    loadTrack(currentTrackIndex);
    playTrack();
}

nextButton.addEventListener("click", nextTrack);
prevButton.addEventListener("click", previousTrack);

audioPlayer.addEventListener("ended", function () {
    if (isRepeatEnabled) {
        audioPlayer.currentTime = 0;
        playTrack();
    } else {
        nextTrack();
    }
});

audioPlayer.addEventListener("timeupdate", function () {
    if (!audioPlayer.duration) return;

    const progress =
        (audioPlayer.currentTime / audioPlayer.duration) * 100;

    progressBar.value = progress;

    currentTimeDisplay.textContent =
        formatTime(audioPlayer.currentTime);

    durationDisplay.textContent =
        formatTime(audioPlayer.duration);
});

progressBar.addEventListener("input", function () {
    if (!audioPlayer.duration) return;

    audioPlayer.currentTime =
        (progressBar.value / 100) * audioPlayer.duration;
});

volumeBar.addEventListener("input", function () {
    audioPlayer.volume = volumeBar.value;
});

shuffleButton.addEventListener("click", function () {
    isShuffleEnabled = !isShuffleEnabled;

    shuffleButton.textContent =
        isShuffleEnabled
            ? "🔀 Shuffle: ON"
            : "🔀 Shuffle";
});

repeatButton.addEventListener("click", function () {
    isRepeatEnabled = !isRepeatEnabled;

    repeatButton.textContent =
        isRepeatEnabled
            ? "🔁 Repeat: ON"
            : "🔁 Repeat";
});

function formatTime(seconds) {
    if (isNaN(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return (
        minutes +
        ":" +
        remainingSeconds
            .toString()
            .padStart(2, "0")
    );
}

function displayTracks(trackArray) {
    trackList.innerHTML = "";

    trackArray.forEach(function (track) {
        const trackElement =
            document.createElement("div");

        trackElement.classList.add("track");

        trackElement.innerHTML = `
            <span class="track-number">
                1
            </span>

            <span class="track-name">
                ${track.title}
            </span>

            <span class="track-source">
                ${track.source}
            </span>
        `;

        trackElement.addEventListener(
            "click",
            function () {
                const originalIndex =
                    tracks.indexOf(track);

                loadTrack(originalIndex);
                playTrack();
            }
        );

        trackList.appendChild(trackElement);
    });
}

searchBar.addEventListener("input", function () {
    const searchTerm =
        searchBar.value.toLowerCase();

    const filteredTracks =
        tracks.filter(function (track) {
            return (
                track.title
                    .toLowerCase()
                    .includes(searchTerm)
                ||
                track.source
                    .toLowerCase()
                    .includes(searchTerm)
            );
        });

    displayTracks(filteredTracks);
});

loadTrack(0);

displayTracks(tracks);

audioPlayer.volume = volumeBar.value;
