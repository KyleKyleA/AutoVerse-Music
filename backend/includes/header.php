<?php 

    $title = "Auto Verse Music";


?>
<!-- Author: Kyle Angeles -->
<!-- Date: 1/1/2026 -->
<!-- File: index.html -->
<!-- Description: This is the main page for the web application -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auto Verse - Music Player</title>

    <!-- Tailwind CDN -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Your CSS -->
    <link rel="stylesheet" href="FrontEnd/style.css">

    <!-- Additional styles or scripts -->
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>

<body>

<div class="container">

    <!-- Header Section -->
    <header>
         <div class="brand-section">
            <div class="brand-title">AutoVerse</div>
            <div class="search">
                <input type="text" id="searchInput" placeholder="Search..." title="Search">
                <button id="searchBtn">🔍</button>
            </div>
        </div>
        <!-- Search Panel for the user where they can search up music or playlists -->
        <div id="searchPanel" class="search-panel hidden">
            <textarea id="searchArea" placeholder="Search your music or playlists..."></textarea>
        </div>

        <div id="searchResults" class="search-results"></div>



        <!-- Navigation bar -->
        <nav>
            <a href="#" data-view="home-view">Home</a>
            <a href="#" data-view="Register-view">Register</a>
            <a href="#" data-view="Login-view">Login</a>
            <a href="#" data-view="DashBoard-view">Dashboard</a>
            <a href="#" data-view="Contact-us-view">Contact-us</a>
            <a href="#" data-view="Profile-view">Profile</a>
            <a href="#" data-view="About-us-view">About-us</a>
        </nav>
    </header>