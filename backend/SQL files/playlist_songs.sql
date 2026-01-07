-- Playlist_Songs
CREATE TABLE playlist_songs (
	playlist_id INTEGER REFERENCES playlists(playlist_id) ON DELETE CASCADE,
    song_id INTEGER REFERENCES songs(song_id) ON DELETE CASCADE,
    song_order INTEGER,
    PRIMARY KEY (playlist_id, song_id)


);