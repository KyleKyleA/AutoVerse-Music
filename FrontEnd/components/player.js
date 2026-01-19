// Author: Kyle Angeles
// File: player.js
// date modified: 1/19/2026
// Description: Theses javascript functions are designed for the music player controls
// such as play feature, pause, skip features for now 


const audio = new Audio();
let currentTrack = null;
let isPlaying = false;



// Function to load a track
export function loadTrack(songURL) {
    if (currentTrack !== songURL) {
        audio.src = songURL;
        currentTrack = songURL;
        audio.load();
        console.log("Track loaded: " + songURL); // log the loaded track
    }
}

// Function to play or pause the current track
export function playPause() {
    audio.play();

};