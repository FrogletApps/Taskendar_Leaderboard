var json;
var jsonFilePath;
var pages;
var pagePosition = 0;
var prevPagePosition = null;
var previousScore = null;
var previousPlace = null;

//Set the colours for picture frame background and text colour
var colours = [
    ['#7f6b00', '#fff'], // DarkGold    / White
    ['#ffd700', '#000'], // LightGold   / Black
    ['#701d1f', '#fff'], // DarkRed     / White
    ['#9d302b', '#fff'], // LightRed    / White
    ['#000000', '#fff'], // Black       / White
    ['#404040', '#fff'], // Grey        / White
    ['#ffffff', '#000']  // White       / Black
];

//Get the URL parameters
const urlParams = new URLSearchParams(window.location.search);
//Get the pagePosition to open to a certain page
const positionNumber = parseInt(urlParams.get('pagePosition'));
var year = urlParams.get('year');

//Get the JSON file for a certain year
getData()

function getData(){
    switch(year){
        //case "2020a":
        //break;
        case "2019":
            jsonFilePath = "scores2019.json";
            document.getElementById('title').innerHTML = "#12tasks 2019";
        break;
        case "2018":
            jsonFilePath = "scores2018.json";
            document.getElementById('title').innerHTML = "Taskendar 2018";
        break;
        default:
            jsonFilePath = "scores2020a.json";
            document.getElementById('title').innerHTML = "#hometasking 2020";
    }
}

//Get random colours for picture frame background/overlay text
function getRandomColour(){
    //Pick a colour
    return colours[Math.floor(Math.random() * colours.length)];
}

//Set random colours for picture frame background/overlay text
function setRandomColour(number, randomColour){
    //Set frame colours
    document.getElementById('frame'+number).style.backgroundColor = randomColour[0];
    document.getElementById('position'+number).style.color = randomColour[1];
}

loadJSON(function(response) {
    // Parse JSON string into object
    json = JSON.parse(response);
    length = json.length;
    if (positionNumber != null && positionNumber >= 0 && positionNumber < json.length){
        pagePosition = positionNumber;
    }
    generateScores(null);
    lastUpdated();
});

function lastUpdated(){
    string = "Scores last updated ";
    switch(year){
        case "2020a":
            document.getElementById("lastUpdate").innerHTML = string + "22/03/2020";
        break;
        case "2019":
            document.getElementById("lastUpdate").innerHTML = string + "24/12/2019";
        break;
        case "2018":
            document.getElementById("lastUpdate").innerHTML = string + "25/12/2018";
        break;            
    }
}

function generateScores(next){
    regenerateColours = true;
    if (next === true && pagePosition + 5 < length){
        pagePosition += 5;
    } else if (next === false && pagePosition - 5 >= 0) {
        pagePosition -= 5;
    } else if (next === false) {
        //If a user adjusts the pagePosition make sure they can still view everything
        pagePosition = 0;
    }

    //Only regenerate colours if the position has moved
    if (prevPagePosition == pagePosition){
        regenerateColours = false;
    }

    if (history.pushState) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?position=' + pagePosition + '&year=' + year;
        window.history.pushState({path:newurl},'',newurl);
    }

    for (let i = 0; i < 5; i++){
        if (regenerateColours){
            colour = getRandomColour();
            setRandomColour(i, colour);
        }
        if (json[pagePosition + i] == null) {
            document.getElementById("name" + i).innerHTML = "-";
            document.getElementById("score" + i).innerHTML = "0";
            document.getElementById("position" + i).innerHTML = "-";
        } else if (previousScore == json[pagePosition + i].Total){
            document.getElementById("name" + i).innerHTML = json[pagePosition + i].Username;
            document.getElementById("score" + i).innerHTML = json[pagePosition + i].Total;
            document.getElementById("position" + i).innerHTML = previousPlace;
        } else {
            document.getElementById("name" + i).innerHTML = json[pagePosition + i].Username;
            document.getElementById("score" + i).innerHTML = json[pagePosition + i].Total;
            document.getElementById("position" + i).innerHTML = suffix(pagePosition + i + 1);
            previousPlace = suffix(pagePosition + i + 1);
            previousScore = json[pagePosition + i].Total;
        }
    }
    prevPagePosition = pagePosition;
}

//Generate a suffix for a number
//https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
function suffix(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

//Based on code from https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
function loadJSON(callback) {   
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', jsonFilePath, true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

 //Ensures that the page can work offline
UpUp.start({
    "content-url": "Twittermaster.html",
    "assets":[
        "Twittermaster.css",
        "Twittermaster.js",
        "scores2019.json"
    ]
});