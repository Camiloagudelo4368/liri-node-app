require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var fs = require("fs");
var moment = require('moment');


var divider = "\n ///-----------------------------------------------------------------------------------------------///" + '\n'
var Spotify = require('node-spotify-api');
var spotifyNew = new Spotify(keys.spotify);
var action = process.argv[2];
var value = process.argv.splice(3).join('+');
var artistsList = [];


/**
 *Main liri search action
 *
 * @param {*} _action type of action Could be "concert-this", "spotify-this-song", "movie-this" or "do-what-it-says"
 * @param {*} _value value to be consulted
 */
function searchLiri(_action, _value) {
    
    if (_action === "concert-this") {
        searchConcert(_value);
    }

    if (_action === "spotify-this-song") {

        if (!_value) {
            searchSpotify("The Sign, Ace of Base");
        }
        else {
            searchSpotify(_value);
        }

    }

    if (_action === "movie-this") {
        if (!_value) {
            searchMovie("Mr. Nobody");
        }
        else {
            searchMovie(_value);
        }
    }

    if (_action === "do-what-it-says") {
        searchRandomFile();
    }

}

/**
 *Log results on log.txt file
 *
 * @param {*} text
 */
function logAction(text) {
    fs.appendFile("Log.txt", text + divider, error => {
        if (error) {
            throw error;
        }
    })
}

/**
 *Serach for concert events
 *
 * @param {*} _value event to search
 */
function searchConcert(_value) {
    axios.get("https://rest.bandsintown.com/artists/" + _value + "/events?app_id=codingbootcam").then(
        function (response) {
            var data = response.data;

            var concertList = [];

            data.forEach(element => {
                var concertObject = {
                    Name: element.venue.name,
                    Venue: element.venue.city + ', ' + element.venue.country,
                    Date: moment(element.datetime).format("MM/DD/YYYY")
                }

                concertList.push(concertObject);
            })

            logAction(JSON.stringify(concertList, null, 2));
            console.log(JSON.stringify(concertList, null, 2))
        })
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

                logAction(JSON.stringify(spotifyObject, null, 2));
                console.log(JSON.stringify(spotifyObject, null, 2));

            }
            else {
                console.log('Song not found on spotify')
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
    axios.get("http://www.omdbapi.com/?t=" + _value + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            var rottenRating = 'NULL';
            
            // Ask if any result 
            if (response.data.Response === "True") {

                response.data.Ratings.forEach(element => {
                    if (element.Source === 'Rotten Tomatoes') {
                        rottenRating = element.Value;
                    }
                })

                var movieObject = {
                    Title: response.data.Title,
                    "Released": response.data.Released,
                    Rating: response.data.imdbRating,
                    "Rotten Tomatoes Rating": rottenRating,
                    Country: response.data.Country,
                    Language: response.data.Language,
                    Plot: response.data.Plot,
                    Actors: response.data.Actors
                }

                logAction(JSON.stringify(movieObject, null, 2));
                console.log(JSON.stringify(movieObject, null, 2));
            }
            else {
                console.log("Movie not found")
            }
        }
    );
}

/**
 *Read the parameters on random file and console log
 *
 */
function searchRandomFile() {

    fs.readFile("random.txt", 'utf8', function (error, text) {

        if (error) {
            return console.log(error);
        }

        var data = text.split(",");

        console.log(data[0] + ", " + data[1])        

        if ((data[0] === "concert-this" || data[0] === "spotify-this-song" || data[0] === "movie-this") && data[1]) {
            searchLiri(data[0], data[1]);
        }
        else {
            console.log("Incorrect information on random.txt file, the program will show the default movie")
            searchLiri("movie-this", "Mr Nobody")
        }

    })
}

searchLiri(action, value);