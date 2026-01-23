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

    const supported = SUPPORT_MUSIC_FORMATS.includes(file.type);
    if (!supported) {
        console.log("Unsupported music file format: " + file.type); 

    } else {
        console.log("Supported music file format: " + file.type);
    }
    return supported;
}

// Function to handle music file import
export async function importMusicFile(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = function(event) {
            resolve({
                name: file.name,
                type: file.type,
                data: event.target.result
            });
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// Function to handle playlist file import
export function importPlaylistFile(file) {
    if (!file) return;


    console.log("Playlist file imported:" + file.name);


    const reader = new FileReader();
    return new Promise((resolve, reject) => {
            reader.onload = function(event) {
        const content = event.target.result;
        console.log("Playlist content: " + content);
        resolve(content);
        // Additional code to parse and load the playlist data into the music player would go here
    };
    reader.readAsText(file);
});
}

// Function to handle multiple music file imports
export async function importMultipleMusicFiles(files) { 
    const importFiles = [];

    for (const files of files ) {
        if (isSupportedMusicFiles(file)) {
            const importedFile = await importMusicFile(file);
            importFiles.push(importedFile);
        } else {
            console.log("Skipping unsupported file: " + file.name);
        }
    }
}

