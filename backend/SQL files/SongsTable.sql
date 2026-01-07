-- Songs Table
-- Author: Kyle Angeles
-- file: SongsTable.sql
-- Description: Creating a table for the music that will list down the basic fields a song would have 
-- just in spotify which will include like description of the song and artist, and the serial number of the song 
-- starting with incrementation of 1 

CREATE TABLE songs (
	song_id SERIAL PRIMARY KEY,
	song_title VARCHAR (255), -- FK
	song_artist VARCHAR (255),
	song_duration INTERVAL,
	file_url TEXT,
	cover_url TEXT
		

);
