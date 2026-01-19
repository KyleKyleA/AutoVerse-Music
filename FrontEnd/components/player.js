// Author: Kyle Angeles
// File: player.js
// date modified: 1/19/2026
// Description: Theses javascript functions are designed for the music player controls
// such as play feature, pause, skip features for now 

// Creating an audio object 
const audio = new Audio();
let currentTrack = null;
let isPlaying = false;
let songQueue = [];
let songQueueIndex = 0;


// Function to load a track
export function loadTrack(songURL) {
    if (currentTrack !== songURL) {
        audio.src = songURL;
        currentTrack = songURL;
        audio.load();
        console.log("Track loaded: " + songURL); // log the loaded track
    }
}

// Function to play the current track
export function playTrack() {
    audio.play().catch(error => {
        console.warn("Error playing track: " + error);
    });
}

// Function to pause the current track
export function pauseTrack() {
    audio.pause();
}

// Function to toggle play/pause
export function togglePlayPause() {
    isPlaying ? pauseTrack() : playTrack();
}

// Event listeners to update the isPlaying state
audio.addEventListener('play', () => {
    isPlaying = true; 

    console.log("Playing track: " + currentTrack); 
});


audio.addEventListener('pause', () => {
    isPlaying = false; 
    console.log("Track paused: " + currentTrack);
});

audio.addEventListener('ended', () => {
    isPlaying = false;
    console.log("Track ended: " + currentTrack);
    // Here you can add logic to automatically play the next track if desired
    if (songQueueIndex < songQueue.length - 1) {
        songQueueIndex++;
        loadTrack(songQueue[songQueueIndex]);
        playTrack();
    }
});

// Function to get the current playback time 
export function getCurrentTime() {
    return audio.currentTime;
}

// Function to set the current playback time
export function setCurrentTime(time) {
    audio.currentTime = time;

}

// Javascript function for the song queue feature
export function addToQueue(songURL) {
    songQueue.push(songURL);
    console.log("Song added to queue: " + songURL);
}

// Function to play the next song in the queue
export function playNextInQueue() {
    if (songQueueIndex < songQueue.length - 1) {
        songQueueIndex++;
        loadTrack(songQueue[songQueueIndex]);
        playTrack();
    } else {
        console.log("End of queue reached");
    }
}
// Function to play the previous song in the queue
export function playPreviousInQueue() {
    if (songQueueIndex > 0) {
        songQueueIndex--;
        loadTrack(songQueue[songQueueIndex]);
        playTrack();
    } else {
        console.log("Already at the beginning of the queue");
    }
}

// Function to clear the song queue 
export function clearQueue() {
    songQueue = [];
    songQueueIndex = 0;
    console.log("Song queue cleared");
}
