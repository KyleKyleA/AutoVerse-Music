/*Author: Kyle Angeles */
/*File: app.js */
/* JavaScript file for the AutoVerse Music Player */

// Log a message indicating that the app has loaded
console.log("AutoVerse Music Player App loaded successfully.");

// Music API base URL – same origin as the app
const MUSIC_API = '/backend/routes/music_routes.php';

async function musicApiGet(action, params = {}) {
    const qs = new URLSearchParams({ action, ...params }).toString();
    const res = await fetch(`${MUSIC_API}?${qs}`);
    return res.json();
}

// Queue state: list of { file_url, song_title, song_artist, song_id }, current index
let songQueue = [];
let queueIndex = -1;

function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
}

function loadTrackAtIndex(index) {
    if (index < 0 || index >= songQueue.length) return;
    queueIndex = index;
    const song = songQueue[index];
    if (!song || !song.file_url) return;
    audioPlayer.src = song.file_url;
    audioPlayer.play();
    updatePlayPauseButton(true);
    setQueueItemActive(index);
}

function setQueueItemActive(activeIndex) {
    document.querySelectorAll('#queueList .queue-item').forEach((el, i) => {
        el.classList.toggle('active', i === activeIndex);
    });
}

async function loadSongsIntoQueue() {
    const list = document.getElementById('queueList');
    if (!list) return;
    try {
        const data = await musicApiGet('songs');
        if (data.success && Array.isArray(data.songs)) {
            songQueue = data.songs.filter(s => s.file_url);
            list.innerHTML = songQueue.length
                ? songQueue.map((s, i) => `<div class="queue-item" data-index="${i}" data-file-url="${(s.file_url || '').replace(/"/g, '&quot;')}">${(s.song_title || 'Unknown')} - ${s.song_artist || ''}</div>`).join('')
                : '<div class="queue-item">No songs yet. Import music or add songs to the library.</div>';
            list.querySelectorAll('.queue-item[data-file-url]').forEach(el => {
                el.addEventListener('click', () => {
                    const idx = parseInt(el.getAttribute('data-index'), 10);
                    if (!isNaN(idx)) loadTrackAtIndex(idx);
                });
            });
            queueIndex = -1;
            setQueueItemActive(-1);
        } else {
            list.innerHTML = '<div class="queue-item">Could not load songs.</div>';
            songQueue = [];
        }
    } catch (e) {
        console.error('Load songs error:', e);
        list.innerHTML = '<div class="queue-item">Could not load songs.</div>';
        songQueue = [];
    }
}

// VIEW SWITCHER
document.querySelectorAll("a[data-view]").forEach(link => {
    link.addEventListener("click", () => {
        const target = link.getAttribute("data-view");


        //Hide views
        document.querySelectorAll(".view").forEach(view => {
           view.style.display = "none";
            
            });

        //Show views
        document.getElementById(target).style.display = "block";
        })
    })


// Function to initialize the music player
function initializePlayer() {
    console.log("Initializing music player...");
    loadSongsIntoQueue();
}
// Import buttons functionality
document.getElementById("importMusicBtn").addEventListener("click", function() {
    document.getElementById("musicFileInput").click();
})

document.getElementById("importPlaylistBtn").addEventListener("click", function() {
    document.getElementById("playlistFileInput").click();
})

// Functionality for file input change events within importMusic button
// File input change event listeners
document.getElementById("musicFileInput").addEventListener('change', function(event) {
    const files = event.target.files[0];

    // Placeholder for handling the imported music file
    if (!files) return;
    console.log("Music file imported: " + files.name);
      
});

// File input change event listeners for playlist import
document.getElementById("playlistFileInput").addEventListener('change', function(event) {
    const files = event.target.files[0];

    if (!files) return;
    console.log("Playlist file imported: " + files.name);

    const reader = new FileReader();
    reader.onload = function(e) {
        console.log("Playlist content: " + e.target.result);
        // Additional code to parse and load the playlist data which we would do later
        // into the music player would go here
        // when we create the database and playlist functionality

};
    reader.readAsText(files);
});
    



// Player elements
const audioPlayer = document.getElementById("audioPlayer");
const playPauseBtn = document.querySelector(".playpause");
const songDurationBar = document.getElementById("songDurationBar");
const songDurationFill = document.getElementById("songDurationFill");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");

function updatePlayPauseButton(playing) {
    if (playPauseBtn) playPauseBtn.classList.toggle("playing", !!playing);
}

function updateDurationBar() {
    const t = audioPlayer.currentTime;
    const d = audioPlayer.duration;
    if (songDurationFill) {
        const pct = d > 0 ? Math.min(100, (t / d) * 100) : 0;
        songDurationFill.style.width = pct + "%";
    }
    if (currentTimeEl) currentTimeEl.textContent = formatTime(t);
    if (totalTimeEl) totalTimeEl.textContent = formatTime(isFinite(d) ? d : 0);
}

function playPause() {
    if (!audioPlayer.src) {
        if (songQueue.length) loadTrackAtIndex(0);
        return;
    }
    if (audioPlayer.paused) {
        audioPlayer.play();
        updatePlayPauseButton(true);
    } else {
        audioPlayer.pause();
        updatePlayPauseButton(false);
    }
}

function nextTrack() {
    if (songQueue.length === 0) return;
    if (queueIndex < songQueue.length - 1) {
        loadTrackAtIndex(queueIndex + 1);
    } else {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        updatePlayPauseButton(false);
        updateDurationBar();
    }
}

function previousTrack() {
    if (audioPlayer.currentTime > 3) {
        audioPlayer.currentTime = 0;
        updateDurationBar();
        return;
    }
    if (songQueue.length && queueIndex > 0) {
        loadTrackAtIndex(queueIndex - 1);
    } else {
        audioPlayer.currentTime = 0;
        updateDurationBar();
    }
}

// Duration bar: update progress while playing
audioPlayer.addEventListener("timeupdate", updateDurationBar);
audioPlayer.addEventListener("loadedmetadata", function () {
    updateDurationBar();
    updatePlayPauseButton(!audioPlayer.paused);
});
audioPlayer.addEventListener("play", function () { updatePlayPauseButton(true); });
audioPlayer.addEventListener("pause", function () { updatePlayPauseButton(false); });
audioPlayer.addEventListener("ended", nextTrack);

// Duration bar: click to seek
if (songDurationBar) {
    songDurationBar.addEventListener("click", function (e) {
        if (!audioPlayer.src || !isFinite(audioPlayer.duration)) return;
        const rect = songDurationBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, x / rect.width));
        audioPlayer.currentTime = pct * audioPlayer.duration;
        updateDurationBar();
    });
}

// Button listeners
if (playPauseBtn) playPauseBtn.addEventListener("click", playPause);
document.querySelector(".nexttrack")?.addEventListener("click", nextTrack);
document.querySelector(".previous")?.addEventListener("click", previousTrack);

// Profile View - Load User Information
const profileView = document.getElementById("Profile-view");
profileView.addEventListener("show", loadUserProfile);

function loadUserProfile() {
    // Placeholder for loading user profile information
    console.log("Loading User profile...");
    // Example of setting user information
}

// Edit Profile picture Button Functionality
function changeProfilePicture() {
    console.log("Change Profile Picture button clicked." );

}

// When the user clicks the change profile picture button
document.getElementById("changeProfilePicBtn").addEventListener("click", () => {
    document.getElementById("file-input").click();
});

document.getElementById("file-input").addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

     const reader = new FileReader();
     reader.onload = function(e) {
        document.getElementById("profilePic").src = e.target.result;
        console.log("Profile picture updated.");
     };

        reader.readAsDataURL(file);
});

// send request to server to for the contact-us form 
// submission handling when the user submits the contact form
// we prevent the default form submission and use fetch to send the data
// this would send the data to the server endpoint '/contact' using POST method
// getting sent to the app.py backend.
document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(this);
    fetch('/contact', {
        method: 'post',
        body: formData })
        .then(data => {
        alert("Message sent successfully");
             })
        .catch(error => {
        console.error("Error:", error);
    });
});

// Function for the fetch request
const registerForm = document.querySelector('form');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(registerForm);

    try {
        const response = await fetch('/backend/routes/auth.php', {
            method: 'post',
            body: formData
        });
        
        const data = await response.json();
        alert("Successful registration");
    } catch (error) {
        console.error("Error: ", error);
    }
});


// Timeout for the login
// variables
let pollCount = 0;
const maxPoll = 30;
function pollLoginStatus() {
    if (pollCount >= maxPoll) {
        console.log("Timed out... Please log in manually again")
        return;
    }
    setTimeout(async () => {
      try {
        const response = await fetch('/backend/routes/check_session.php') //Api endpoint
        const data = await response.json();


        if (data.isLoggedIn) {
            console.log("User is logged in AutoVerse Music");
            document.querySelector("a[data-view='DashBoard-view']").click();
        
        } else {
            pollCount++;
            console.log(`Attempt ${pollCount}`, "User is not logged in yet, polling")
            pollLoginStatus();
        }
    } catch (error) {
        console.log("Timeout", error);
    }
    }, 1000);
}




// Call the initialize function when the window loads
window.onload = initializePlayer;
