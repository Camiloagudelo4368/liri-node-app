// read and set any environment variables with the dotenv package
require("dotenv").config();

// Import the keys.js file and store it in a variable.
var keys = require("./keys.js");
var axios = require("axios");
var fs = require("fs");
var Spotify = require('node-spotify-api');

// Access your keys information like so
var spotifyNew = new Spotify(keys.spotify);


var action = process.argv[2];
var value = process.argv[3];
var artistsList = [];

// concert-this
if (action === "concert-this") {
    searchSpotify(value);
}

// spotify-this-song
if (action === "spotify-this-song") {
    searchSpotify(value);
}

// movie-this
if (action === "movie-this") {
    searchMovie(value);
}


/**
 *Serach for concert events
 *
 * @param {*} _value event to search
 */
function searchConcert(_value){

}

/**
 *Serch tracks on spotify
 *
 * @param {*} _value name of Song to search
 */
function searchSpotify(_value) {

    spotifyNew.search({ type: 'track', query: _value, limit: '1' })
        .then(function (response) {

            if (response.tracks.items.length > 0) {

                var item = response.tracks.items[0];

                if (item.artists.length > 0) {
                    item.artists.forEach(element => {
                        artistsList.push(element.name)
                    });
                }

                var spotifyObject = {
                    artists: artistsList,
                    name: item.name,
                    "preview Link": item.preview_url,
                    album: item.album.name
                };

                return console.log(JSON.stringify(spotifyObject, null, 2));

            }
            else {
                searchSpotify("The Sign, Ace of Base");
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

/**
 *Search moive
 *
 * @param {*} _value name of movie
 */
function searchMovie(_value) {
    axios.get("http://www.omdbapi.com/?t=" + _value.split(' ').join('+') + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            var rottenRating = 'NULL';

            response.data.Ratings.forEach(element => {
                if (element.Source === 'Rotten Tomatoes') {
                    console.log(element)
                    rottenRating = element.Value;
                }
            })

            // console.log(response.data)
            var movieObject = {
                Title: response.data.Title,
                "Released": response.data.Released,
                Rating: response.data.imdbRating,
                "Rotten Tomatoes Rating": rottenRating,
                Country: response.data.Country,
                Language: response.data.Language,
                Plot: response.data.PLot,
                Actors: response.data.Actors
            }

            return console.log(JSON.stringify(movieObject, null, 2));
        }
    );
}



// do-what-it-says