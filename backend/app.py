# Author: Kyle Angeles
# File: backend/app.pu
#Description: This is the main application file for the backend server using Flask.
# It sets up the flask application and defines a simple route for testing.
#Test route returns a welcome message
from flask import Flask 
app = Flask(__name__)

@app.route("/")
def home_world():
    return "<p>Welcome to the AutoVerse Music Backend!</p"


if __name__ == "__main__":
    app.run(debug=True)