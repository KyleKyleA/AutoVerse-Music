/*Author: Kyle Angeles  */
/*File: search.js  */
/*Date Modified: 1/1/2026 */
/*Description: Search Functionality  */

// Get references to search elements from the HTML page
const searchBtn = document.getElementById("searchBtn");
const searchPanel = document.getElementById("searchPanel");
const searchArea = document.getElementById("searchArea");

// Toggling Hidden 
searchBtn.addEventListener("click", () => {
    searchPanel = searchArea.classList.toggle("hidden");
});
 


// Search API endpoint
const MUSIC_API = '/backend/routes/music_routes.php';
let searchTimeout = null;

function renderSearchResults(songs, playlists, resultsContainer) {
    resultsContainer.innerHTML = "";
    if (songs && songs.length) {
        const songHeader = document.createElement("div");
        songHeader.className = "search-results-header";
        songHeader.textContent = "Songs";
        resultsContainer.appendChild(songHeader);
        songs.forEach(s => {
            const div = document.createElement("div");
            div.className = "search-result-item";
            div.textContent = (s.song_title || "Unknown") + " – " + (s.song_artist || "");
            if (s.file_url) div.setAttribute("data-file-url", s.file_url);
            resultsContainer.appendChild(div);
        });
    }
    if (playlists && playlists.length) {
        const plHeader = document.createElement("div");
        plHeader.className = "search-results-header";
        plHeader.textContent = "Playlists";
        resultsContainer.appendChild(plHeader);
        playlists.forEach(p => {
            const div = document.createElement("div");
            div.className = "search-result-item";
            div.textContent = p.playlist_title || "Untitled playlist";
            div.setAttribute("data-playlist-id", p.playlist_id);
            resultsContainer.appendChild(div);
        });
    }
    if (!(songs && songs.length) && !(playlists && playlists.length)) {
        const empty = document.createElement("div");
        empty.className = "search-result-item";
        empty.textContent = "No results.";
        resultsContainer.appendChild(empty);
    }
}

document.getElementById("searchInput").addEventListener("input", function(event) {
    const query = (event.target.value || "").trim();
    const resultsContainer = document.getElementById("searchResults");
    if (!resultsContainer) return;

    if (searchTimeout) clearTimeout(searchTimeout);
    if (!query) {
        resultsContainer.innerHTML = "";
        return;
    }

    searchTimeout = setTimeout(async () => {
        console.log("Searching for: " + query);
        try {
            const res = await fetch(`${MUSIC_API}?action=search&q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data.success) {
                renderSearchResults(data.songs || [], data.playlists || [], resultsContainer);
            } else {
                resultsContainer.innerHTML = "<div class=\"search-result-item\">Search failed.</div>";
            }
        } catch (e) {
            console.error("Search error:", e);
            resultsContainer.innerHTML = "<div class=\"search-result-item\">Could not search.</div>";
        }
    }, 300);
});
