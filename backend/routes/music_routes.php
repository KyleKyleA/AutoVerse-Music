<?php
/**
 * Music API routes – songs and playlists.
 * Connects the AutoVerse frontend to the database.
 *
 * Usage: /backend/routes/music_routes.php?action=<action> [&id=] [&q=] with GET/POST as needed.
 */
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../includes/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = trim($_GET['action'] ?? $_POST['action'] ?? '');

// Parse JSON body for POST when Content-Type is application/json
$input = [];
if ($method === 'POST' && strpos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) {
    $raw = file_get_contents('php://input');
    if ($raw !== false && $raw !== '') {
        $input = json_decode($raw, true) ?: [];
    }
} else {
    $input = $_POST;
}

$response = ['success' => false, 'message' => 'Invalid action'];
$user_id = $_SESSION['user_id'] ?? null;

function sendJson($data) {
    echo json_encode($data);
    exit;
}

function requireLogin($user_id) {
    if ($user_id === null || $user_id === '') {
        http_response_code(401);
        sendJson(['success' => false, 'message' => 'Login required']);
    }
}

switch ($action) {

    // —— Songs ——
    case 'songs':
        if ($method !== 'GET') {
            $response['message'] = 'Method not allowed';
            sendJson($response);
        }
        try {
            $stmt = $pdo->query('SELECT song_id, song_title, song_artist, song_duration::text AS song_duration, file_url, cover_url FROM songs ORDER BY song_title');
            $songs = $stmt->fetchAll();
            sendJson(['success' => true, 'songs' => $songs]);
        } catch (PDOException $e) {
            http_response_code(500);
            sendJson(['success' => false, 'message' => 'Failed to fetch songs', 'error' => $e->getMessage()]);
        }
        break;

    case 'song':
        if ($method === 'GET') {
            $id = (int) ($_GET['id'] ?? 0);
            if ($id <= 0) {
                $response['message'] = 'Invalid song id';
                sendJson($response);
            }
            try {
                $stmt = $pdo->prepare('SELECT song_id, song_title, song_artist, song_duration::text AS song_duration, file_url, cover_url FROM songs WHERE song_id = ?');
                $stmt->execute([$id]);
                $song = $stmt->fetch();
                if (!$song) {
                    http_response_code(404);
                    sendJson(['success' => false, 'message' => 'Song not found']);
                }
                sendJson(['success' => true, 'song' => $song]);
            } catch (PDOException $e) {
                http_response_code(500);
                sendJson(['success' => false, 'message' => 'Failed to fetch song', 'error' => $e->getMessage()]);
            }
        } elseif ($method === 'POST') {
            $title = trim($input['song_title'] ?? '');
            $artist = trim($input['song_artist'] ?? '');
            $duration = $input['song_duration'] ?? null; // seconds (int) or "HH:MM:SS" or "MM:SS"
            $file_url = trim($input['file_url'] ?? '');
            $cover_url = trim($input['cover_url'] ?? '');
            if ($title === '') {
                $response['message'] = 'Song title is required';
                sendJson($response);
            }
            if ($duration !== null && is_numeric($duration)) {
                $sec = (int) $duration;
                $duration = sprintf('%02d:%02d:%02d', $sec / 3600, ($sec % 3600) / 60, $sec % 60);
            }
            try {
                $stmt = $pdo->prepare('INSERT INTO songs (song_title, song_artist, song_duration, file_url, cover_url) VALUES (?, ?, ?::interval, ?, ?) RETURNING song_id, song_title, song_artist, song_duration::text AS song_duration, file_url, cover_url');
                $stmt->execute([$title, $artist, $duration ?: '0', $file_url, $cover_url]);
                $song = $stmt->fetch();
                sendJson(['success' => true, 'message' => 'Song created', 'song' => $song]);
            } catch (PDOException $e) {
                http_response_code(500);
                sendJson(['success' => false, 'message' => 'Failed to create song', 'error' => $e->getMessage()]);
            }
        } else {
            $response['message'] = 'Method not allowed';
            sendJson($response);
        }
        break;

    // —— Playlists (require login) ——
    case 'playlists':
        if ($method !== 'GET') {
            $response['message'] = 'Method not allowed';
            sendJson($response);
        }
        requireLogin($user_id);
        try {
            $stmt = $pdo->prepare('SELECT playlist_id, playlist_title, create_date, description, is_public FROM playlists WHERE user_id = ? ORDER BY create_date DESC');
            $stmt->execute([$user_id]);
            $playlists = $stmt->fetchAll();
            sendJson(['success' => true, 'playlists' => $playlists]);
        } catch (PDOException $e) {
            http_response_code(500);
            sendJson(['success' => false, 'message' => 'Failed to fetch playlists', 'error' => $e->getMessage()]);
        }
        break;

    case 'playlist':
        if ($method === 'GET') {
            $id = (int) ($_GET['id'] ?? 0);
            if ($id <= 0) {
                $response['message'] = 'Invalid playlist id';
                sendJson($response);
            }
            try {
                $stmt = $pdo->prepare('SELECT playlist_id, user_id, playlist_title, create_date, description, is_public FROM playlists WHERE playlist_id = ?');
                $stmt->execute([$id]);
                $playlist = $stmt->fetch();
                if (!$playlist) {
                    http_response_code(404);
                    sendJson(['success' => false, 'message' => 'Playlist not found']);
                }
                $stmt2 = $pdo->prepare('SELECT s.song_id, s.song_title, s.song_artist, s.song_duration::text AS song_duration, s.file_url, s.cover_url, ps.song_order FROM playlist_songs ps JOIN songs s ON s.song_id = ps.song_id WHERE ps.playlist_id = ? ORDER BY ps.song_order ASC, ps.song_id ASC');
                $stmt2->execute([$id]);
                $playlist['songs'] = $stmt2->fetchAll();
                sendJson(['success' => true, 'playlist' => $playlist]);
            } catch (PDOException $e) {
                http_response_code(500);
                sendJson(['success' => false, 'message' => 'Failed to fetch playlist', 'error' => $e->getMessage()]);
            }
        } elseif ($method === 'POST') {
            requireLogin($user_id);
            $title = trim($input['playlist_title'] ?? '');
            $description = trim($input['description'] ?? '');
            $is_public = isset($input['is_public']) ? (bool) $input['is_public'] : false;
            if ($title === '') {
                $response['message'] = 'Playlist title is required';
                sendJson($response);
            }
            try {
                $stmt = $pdo->prepare('INSERT INTO playlists (user_id, playlist_title, create_date, description, is_public) VALUES (?, ?, NOW(), ?, ?) RETURNING playlist_id, playlist_title, create_date, description, is_public');
                $stmt->execute([$user_id, $title, $description, $is_public ? 't' : 'f']);
                $playlist = $stmt->fetch();
                sendJson(['success' => true, 'message' => 'Playlist created', 'playlist' => $playlist]);
            } catch (PDOException $e) {
                http_response_code(500);
                sendJson(['success' => false, 'message' => 'Failed to create playlist', 'error' => $e->getMessage()]);
            }
        } else {
            $response['message'] = 'Method not allowed';
            sendJson($response);
        }
        break;

    case 'playlist_add_song':
        if ($method !== 'POST') {
            $response['message'] = 'Method not allowed';
            sendJson($response);
        }
        requireLogin($user_id);
        $playlist_id = (int) ($input['playlist_id'] ?? 0);
        $song_id = (int) ($input['song_id'] ?? 0);
        $song_order = isset($input['song_order']) ? (int) $input['song_order'] : null;
        if ($playlist_id <= 0 || $song_id <= 0) {
            $response['message'] = 'playlist_id and song_id are required';
            sendJson($response);
        }
        try {
            $stmt = $pdo->prepare('SELECT playlist_id FROM playlists WHERE playlist_id = ? AND user_id = ?');
            $stmt->execute([$playlist_id, $user_id]);
            if (!$stmt->fetch()) {
                http_response_code(403);
                sendJson(['success' => false, 'message' => 'Playlist not found or access denied']);
            }
            if ($song_order === null) {
                $stmt = $pdo->query("SELECT COALESCE(MAX(song_order), 0) + 1 AS next_order FROM playlist_songs WHERE playlist_id = $playlist_id");
                $song_order = (int) $stmt->fetch()['next_order'];
            }
            $stmt = $pdo->prepare('INSERT INTO playlist_songs (playlist_id, song_id, song_order) VALUES (?, ?, ?) ON CONFLICT (playlist_id, song_id) DO UPDATE SET song_order = EXCLUDED.song_order');
            $stmt->execute([$playlist_id, $song_id, $song_order]);
            sendJson(['success' => true, 'message' => 'Song added to playlist']);
        } catch (PDOException $e) {
            http_response_code(500);
            sendJson(['success' => false, 'message' => 'Failed to add song to playlist', 'error' => $e->getMessage()]);
        }
        break;

    case 'playlist_remove_song':
        if ($method !== 'POST' && $method !== 'DELETE') {
            $response['message'] = 'Method not allowed';
            sendJson($response);
        }
        requireLogin($user_id);
        $playlist_id = (int) ($input['playlist_id'] ?? $_GET['playlist_id'] ?? 0);
        $song_id = (int) ($input['song_id'] ?? $_GET['song_id'] ?? 0);
        if ($playlist_id <= 0 || $song_id <= 0) {
            $response['message'] = 'playlist_id and song_id are required';
            sendJson($response);
        }
        try {
            $stmt = $pdo->prepare('DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ? AND playlist_id IN (SELECT playlist_id FROM playlists WHERE user_id = ?)');
            $stmt->execute([$playlist_id, $song_id, $user_id]);
            sendJson(['success' => true, 'message' => 'Song removed from playlist']);
        } catch (PDOException $e) {
            http_response_code(500);
            sendJson(['success' => false, 'message' => 'Failed to remove song from playlist', 'error' => $e->getMessage()]);
        }
        break;

    // —— Search (songs and playlist titles) ——
    case 'search':
        if ($method !== 'GET') {
            $response['message'] = 'Method not allowed';
            sendJson($response);
        }
        $q = trim($_GET['q'] ?? '');
        if ($q === '') {
            sendJson(['success' => true, 'songs' => [], 'playlists' => []]);
        }
        try {
            $pattern = '%' . preg_replace('/%|_/', '\\\\$0', $q) . '%';
            $stmt = $pdo->prepare('SELECT song_id, song_title, song_artist, song_duration::text AS song_duration, file_url, cover_url FROM songs WHERE song_title ILIKE ? OR song_artist ILIKE ? ORDER BY song_title LIMIT 50');
            $stmt->execute([$pattern, $pattern]);
            $songs = $stmt->fetchAll();
            $stmt = $pdo->prepare('SELECT playlist_id, playlist_title, create_date, description FROM playlists WHERE (is_public = true OR user_id = ?) AND (playlist_title ILIKE ? OR description ILIKE ?) ORDER BY playlist_title LIMIT 20');
            $stmt->execute([$user_id ?? 0, $pattern, $pattern]);
            $playlists = $stmt->fetchAll();
            sendJson(['success' => true, 'songs' => $songs, 'playlists' => $playlists]);
        } catch (PDOException $e) {
            http_response_code(500);
            sendJson(['success' => false, 'message' => 'Search failed', 'error' => $e->getMessage()]);
        }
        break;

    default:
        $response['message'] = 'Unknown action. Use action=songs|song|playlists|playlist|playlist_add_song|playlist_remove_song|search';
        sendJson($response);
}
