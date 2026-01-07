# Author: Kyle Angeles
# File: backend/app.pu
#Description: This is the main application file for the backend server using Flask.
# It sets up the flask application and defines a simple route for testing.
#Test route returns a welcome message
from tempfile import template
from flask import Flask, render_template
import psycopg2 
app = Flask(__name__)

@app.route("/")
def home_world():
    return "<p>Welcome to the AutoVerse Music Backend!</p"

# Function to connect to the PSQL database 
def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",
        database="kyleangeles_db",
        user="KyleAngeles",
        password="123"
    )
    
    return conn

@app.route("/")
def index():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM songs;")
    songs = cur.fetchall()
    cur.close()
    conn.close()
    return render_template("index.html", songs=songs)

    


if __name__ == "__main__":
    app.run(debug=True)