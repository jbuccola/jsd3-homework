//Project 2: Madlibs
//Author: Johnny Buccola
//Date: 9/6/2016

//Generate randomized nouns for script
var startupX = ['Uber', 'Google', 'Amazon', 'Apple', 'Facebook', 'Twitter', 'Starbucks', 'Atari', 'Yoga Lessons'];
var startupY = ['Slack', 'Trello', 'Tesla', 'Hyperloop', 'Harvest', 'your Bowel Movements'];

//function to automatically return a randomized joke
function newJoke () {
    var random1 = Math.floor((Math.random() * startupX.length));
    var random2 = Math.floor((Math.random() * startupY.length));
    var ThatsTheJoke = 'A startup that is ' + startupX[random1] + ', but for ' + startupY[random2]
    return ThatsTheJoke
}

function printFavorite (item, index) {
    $favList.html((index+1) + ': ' + item + '\n');
}

var $jokeNode = $('#xForY');
var $createButton = $('#create');
var $favButton = $('#save');
var $favList = $('#favorites');
var $printButton = $('#print');

var favorites = [];

$(document).ready(function() {
    $createButton.on('click', function(event) {
        $jokeNode.text(newJoke());
    });
    $favButton.on('click', function(event) {
        favorites.push($jokeNode.text());
    })
    $printButton.on('click', function(event) {
        $favList.empty();
        for (var key in favorites) {
                $favList.append(document.createTextNode(favorites[key]));
                $favList.append(document.createElement('br'));
        }
    });
});
