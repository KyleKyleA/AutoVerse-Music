/*Author: Kyle Angeles */
/*File: app.js */
/* JavaScript file for the AutoVerse Music Player */

// Log a message indicating that the app has loaded
console.log("AutoVerse Music Player App loaded successfully.");

// VIEW SWITCHER
document.querySelectorAll("a[data-view").foreach(link => {
    link.addEventListener("click", () => {
        const target = link.getAttribute("data-view");


        //Hide views
        document.querySelectorAll(".view").forEach(link => {
           view.style.display = "none";
            
            });

        //Show views
        document.getElementById(target).style.display = "block";
        })
    })


// Function to initialize the music player
function initializePlayer() {
    // Placeholder for player initialization logic
    console.log("Initializing music player...");
    // Additional code to set up the player would go here

}
// Import buttons functionality
// Example: Import Music, Import Playlist
// In, this case we need a event listener for each button
document.getElementById("importMusicButton").addEventListener("click", function() {
    document.getElementById("musicFileInput").click();
})

document.getElementById("importPlaylistButton").addEventListener("click", function() {
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

}
    reader.readAsText(files);



// Function to handle player button clicks
// Example: Play, Pause, Next, Previous
const audioPlayer = document.getElementById("player-control");

// Function to playpause the button on the UI
function playPause () {
    if (audioPlayer.paused) {
        audioPlayer.play();
        console.log("playing: " ) ;// Want to add that text where it shows playing plus the Track naming
    } else {
        audioPlayer.paused();
        console.log("paused");
    }
}

// Call the initialize function when the window loads
window.onload = initializePlayer;
