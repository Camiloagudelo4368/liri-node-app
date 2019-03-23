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

// spotify-this-song
if (action === "spotify-this-song") {
    // console.log(value)
    searchSpotify(value);
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
                    "preview Link":item.preview_url,
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



// concert-this



// movie-this

// do-what-it-says