/*Author: Kyle Angeles */
/*File: app.js */
/* JavaScript file for the AutoVerse Music Player */

// Log a message indicating that the app has loaded
console.log("AutoVerse Music Player App loaded successfully.");

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
    // Placeholder for player initialization logic
    console.log("Initializing music player...");
    // Additional code to set up the player would go here

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
    



// Function to handle player button clicks
// Example: Play, Pause, Next, Previous
// Getting the ID from the html page
const audioPlayer = document.getElementById("audioPlayer");

// Function to playpause the button on the UI
function playPause () {
    if (audioPlayer.paused) {
        audioPlayer.play();
        console.log("playing: " + audioPlayer.src) ;// Want to add that text where it shows playing plus the Track naming
    } else {
        audioPlayer.pause();
        console.log("paused");
    }
}

function nextTrack () {
    audioPlayer.src = 'nexttrack.mp3';
    audioPlayer.play();
    console.log("Next track loaded and playing:  " + audioPlayer.src); // Adding something for this string 
}

function previousTrack () {
    audioPlayer.src = 'previousTrack.mp3';
    audioPlayer.play();
    console.log("Previous track loaded is now playing: " + audioPlayer.src );
}

//Button Listeners
document.querySelector(".playpause").addEventListener("click", playPause);
document.querySelector(".nexttrack").addEventListener("click", nextTrack);
document.querySelector(".previous").addEventListener("click", previousTrack);

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

// Call the initialize function when the window loads
window.onload = initializePlayer;
