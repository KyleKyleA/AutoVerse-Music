// Author: Kyle Angeles
// File: import.js
// Date Modified: 1/15/2026
// Description: This file contains functions that will handle importing music files and playlists into
// the application

// Supported music file formats for this application
const SUPPORT_MUSIC_FORMATS = ['audio/mpeg', 'audio/wav', 'audio/ogg'];

// Function to check if the file format is support
export function isSupportedMusicFile(file) {

    if (!file || !file.type) {
        console.warn("Invalid file or file type");
    return false;
    }

    const issupported = SUPPORT_MUSIC_FORMATS.includes(file.type);
    if (!issupported) {
        console.log("Unsupported music file format: " + file.type); 

    } else {
        console.log("Supported music file format: " + file.type);
    }
    return issupported;
}

// Function to handle music file import
export function importMusicFile(file) {
    // Placeholder for handling the imported music file
    if (!file) return;
    console.log("Music file imported: " + file.name);
    // Additional logic to process and add the music file to the library would go here
    const reader = new FileReader();

    reader.onLoad = function(event) {
        const content = event.target.result;
        console.log("Music file content: " + content);

        // Additional code to parse and load the music file data into the music player would go here
    };
    reader.readAsArrayBuffer(file);

}

// Function to handle playlist file import
export function importPlaylistFile(file) {
    if (!file) return;
    console.log("Playlist file imported:" + file.name);
    const reader = new FileReader();

    reader.onload = function(event) {
        const content = event.target.result;
        console.log("Playlist content: " + content);

        // Additional code to parse and load the playlist data into the music player would go here
    };
    reader.readAsText(file);
}
