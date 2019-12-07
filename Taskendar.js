var json;
var jsonFilePath;
var pages;
var position = 0;
var previousScore = null;
var previousPosition = null;

//Get the URL parameters
const urlParams = new URLSearchParams(window.location.search);
//Get the position to open to a certain page
const positionNumber = parseInt(urlParams.get('position'));
var year = parseInt(urlParams.get('year'));

//If no date specified assume 2019
if (isNaN(year)){
    year = 2019;
}

getData()

function getData(){
    switch(year){
        case 2019:
            console.log(2019);
            jsonFilePath = "scores2019.json";
        break;
        case 2018:
            console.log(2018);
            jsonFilePath = "scores2018.json";
            
        break;
        default:
            
    }
}

loadJSON(function(response) {
    // Parse JSON string into object
    json = JSON.parse(response);
    length = json.length;
    if (positionNumber != null && positionNumber >= 0 && positionNumber < json.length){
        position = positionNumber;
    }
    generateScores(null);
    lastUpdated();
});

function lastUpdated(){
    switch(year){
        case 2019:
        var fullDateUpdated = new Date(Date.parse(json.feed.updated.$t));
            var monthUpdated = fullDateUpdated.getMonth() + 1
            document.getElementById("lastUpdate").innerHTML = "Scores last updated 07/12/2019";
        break;
        case 2018:
            document.getElementById("lastUpdate").innerHTML = "Scores last updated 25/12/2018";
        break;            
    }
}

function generateScores(next){
    function namePosition(i){
        return json[position + i].Username;
    }
    function totalScorePosition(i){
        return json[position + i].Total;
    }

    if (next == true && position + 5 < length){
        position += 5;
    } else if (next == false && position -5 >= 0) {
        position -= 5;
    } else if (next == false) {
        //If a user adjusts the position make sure they can still view everything
        position = 0;
    }

    if (history.pushState) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?position=' + position + '&year=' + year;
        window.history.pushState({path:newurl},'',newurl);
    }

    for (let i = 0; i < 5; i++){
        if (json[position + i] == null) {
            document.getElementById("name" + i).innerHTML = "-";
            document.getElementById("score" + i).innerHTML = "0";
            document.getElementById("position" + i).innerHTML = "-";
        } else if (previousScore == json[position + i].Total){
            document.getElementById("name" + i).innerHTML = namePosition(i);
            document.getElementById("score" + i).innerHTML = totalScorePosition(i);
            document.getElementById("position" + i).innerHTML = previousPosition;
        } else {
            document.getElementById("name" + i).innerHTML = namePosition(i);
            document.getElementById("score" + i).innerHTML = totalScorePosition(i);
            document.getElementById("position" + i).innerHTML = suffix(position + i + 1);
            previousPosition = suffix(position + i + 1);
            previousScore = totalScorePosition;
        }
    }
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