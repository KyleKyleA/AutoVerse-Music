-- Playlistg table
-- Author: Kyle Angeles
-- file: playlistTable.sql

CREATE TABLE playlists (
	playlist_id SERIAL PRIMARY KEY,
	user_id INT NOT NULL,
	playlist_title varchar(255),
	create_date TIMESTAMP,
	description VARCHAR (255),
	is_public BOOLEAN DEFAULT FALSE
);