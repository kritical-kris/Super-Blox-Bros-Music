/* ========================================
   SUPER BLOX BROS. — MUSIC PLAYER
======================================== */


/* ========================================
   MUSIC LIBRARY

   Add your songs here later.

   Example:

   {
       title: "My Song",
       source: "Super Blox Bros.",
       file: "music/my-song.mp3"
   }

======================================== */

const tracks = [
    {
        title: "Crossroads",
        source: "Super Blox Bros.",
        file: "music/crossroads.mp3"
    },
    {
        title: "SFOTH",
        source: "Super Blox Bros.",
        file: "music/sfoth.mp3"
    },
    {
        title: "RIVALS",
        source: "RIVALS",
        file: "music/rivals.mp3"
    }
];


/* ========================================
   PLAYER VARIABLES
======================================== */

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


/* ========================================
   PLAYER STATE
======================================== */

let currentTrackIndex = 0;

let isPlaying = false;

let isShuffleEnabled = false;

let isRepeatEnabled = false;


/* ========================================
   LOAD A TRACK
======================================== */

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


/* ========================================
   PLAY TRACK
======================================== */

function playTrack() {

    if (tracks.length === 0) {
        return;
    }

    audioPlayer.play();

    isPlaying = true;

    playButton.textContent = "❚❚";

}


/* ========================================
   PAUSE TRACK
======================================== */

function pauseTrack() {

    audioPlayer.pause();

    isPlaying = false;

    playButton.textContent = "▶";

}


/* ========================================
   PLAY / PAUSE BUTTON
======================================== */

playButton.addEventListener("click", function () {

    if (isPlaying) {

        pauseTrack();

    } else {

        playTrack();

    }

});


/* ========================================
   NEXT TRACK
======================================== */

function nextTrack() {

    if (isShuffleEnabled) {

        let randomIndex;

        do {

            randomIndex =
                Math.floor(Math.random() * tracks.length);

        } while (
            randomIndex === currentTrackIndex &&
            tracks.length > 1
        );

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


/* ========================================
   PREVIOUS TRACK
======================================== */

function previousTrack() {

    currentTrackIndex--;

    if (currentTrackIndex < 0) {

        currentTrackIndex = tracks.length - 1;

    }

    loadTrack(currentTrackIndex);

    playTrack();

}


/* ========================================
   NEXT / PREVIOUS BUTTONS
======================================== */

nextButton.addEventListener(
    "click",
    nextTrack
);

prevButton.addEventListener(
    "click",
    previousTrack
);


/* ========================================
   TRACK ENDS
======================================== */

audioPlayer.addEventListener(
    "ended",
    function () {

        if (isRepeatEnabled) {

            audioPlayer.currentTime = 0;

            playTrack();

        } else {

            nextTrack();

        }

    }
);


/* ========================================
   UPDATE PROGRESS BAR
======================================== */

audioPlayer.addEventListener(
    "timeupdate",
    function () {

        if (!audioPlayer.duration) {
            return;
        }

        const progress =
            (audioPlayer.currentTime /
            audioPlayer.duration) * 100;

        progressBar.value = progress;

        currentTimeDisplay.textContent =
            formatTime(audioPlayer.currentTime);

        durationDisplay.textContent =
            formatTime(audioPlayer.duration);

    }
);


/* ========================================
   SEEK THROUGH SONG
======================================== */

progressBar.addEventListener(
    "input",
    function () {

        if (!audioPlayer.duration) {
            return;
        }

        const newTime =
            (progressBar.value / 100) *
            audioPlayer.duration;

        audioPlayer.currentTime = newTime;

    }
);


/* ========================================
   VOLUME
======================================== */

volumeBar.addEventListener(
    "input",
    function () {

        audioPlayer.volume =
            volumeBar.value;

    }
);


/* ========================================
   SHUFFLE
======================================== */

shuffleButton.addEventListener(
    "click",
    function () {

        isShuffleEnabled =
            !isShuffleEnabled;

        if (isShuffleEnabled) {

            shuffleButton.textContent =
                "🔀 Shuffle: ON";

        } else {

            shuffleButton.textContent =
                "🔀 Shuffle";

        }

    }
);


/* ========================================
   REPEAT
======================================== */

repeatButton.addEventListener(
    "click",
    function () {

        isRepeatEnabled =
            !isRepeatEnabled;

        if (isRepeatEnabled) {

            repeatButton.textContent =
                "🔁 Repeat: ON";

        } else {

            repeatButton.textContent =
                "🔁 Repeat";

        }

    }
);


/* ========================================
   FORMAT TIME

   Converts seconds into:
   0:00
   1:32
   10:45

======================================== */

function formatTime(seconds) {

    if (isNaN(seconds)) {

        return "0:00";

    }

    const minutes =
        Math.floor(seconds / 60);

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


/* ========================================
   CREATE TRACK LIST
======================================== */

function displayTracks(trackArray) {

    trackList.innerHTML = "";

    trackArray.forEach(
        function (track, index) {

            const trackElement =
                document.createElement("div");

            trackElement.classList.add(
                "track"
            );

            trackElement.innerHTML = `

                <span class="track-number">
                    ${index + 1}
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


            trackList.appendChild(
                trackElement
            );

        }
    );

}


/* ========================================
   SEARCH
======================================== */

searchBar.addEventListener(
    "input",
    function () {

        const searchTerm =
            searchBar.value.toLowerCase();


        const filteredTracks =
            tracks.filter(
                function (track) {

                    return (

                        track.title
                            .toLowerCase()
                            .includes(searchTerm)

                        ||

                        track.source
                            .toLowerCase()
                            .includes(searchTerm)

                    );

                }
            );


        displayTracks(
            filteredTracks
        );

    }
);


/* ========================================
   INITIALIZE PLAYER
======================================== */

loadTrack(0);

displayTracks(tracks);

audioPlayer.volume =
    volumeBar.value;
