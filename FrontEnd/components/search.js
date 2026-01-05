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
 


// Function to handle search functionality
document.getElementById("searchInput").addEventListener("input", function(event) {
    const query = event.target.value.toLowerCase();

    // PlaceHolder for the search logic
    console.log("Searching for: " + query);

    // Filtering
    const resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = ""; // Clear previous results

    // Placeholder data for demonstration
    const sampleData = [
        "Song One",
        "Another Song",
        "Third Track",
        "Fourth Melody",
        "Fifth Harmony"
    ];
    // Filter and display results 
    // when the user imports a search query
    const filteredResults = sampleData.filter(item => item.toLowerCase().includes(query));
    filteredResults.forEach(result => {
        const resultItem = document.createElement("div");
        resultItem.textContent = result;
        resultsContainer.appendChild(resultItem);
    });

});
