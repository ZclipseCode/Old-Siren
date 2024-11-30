const consumerKey = import.meta.env.VITE_TM_CONSUMER_KEY;
var nearbyEvents;
var genreSubstrings;

async function fetchNearbyEvents(latlong, radius) {
    let size = 200;
    let url = `https://app.ticketmaster.com/discovery/v2/events?apikey=${consumerKey}&latlong=${latlong}&radius=${radius}&unit=miles&classificationName=music&size=${size}`;

    let response = await fetch(url);
    let data = await response.json();
    let events = data._embedded.events || [];

    return events;
}

function radiusInputHandling(radius) {
    if (!isNaN(radius) && radius >= 1 && radius <= 1000) {
        return true;
    }
    alert("Radius must be a number between 1 and 1000 (inclusive).");
    return false;
}

function createEventDiv(imageSrc, name, genre, location, day, time) {
    let allEvents = document.getElementById('events');

    let div = document.createElement('div');
    allEvents.appendChild(div);
    
    let topHr = document.createElement('hr');
    div.appendChild(topHr);

    let infoContainer = document.createElement('div');
    div.appendChild(infoContainer);

    let img = document.createElement('img');
    infoContainer.appendChild(img);

    let info = document.createElement('div');
    infoContainer.appendChild(info);

    let nameHeader = document.createElement('h3');
    info.appendChild(nameHeader);

    let genreP = document.createElement('p');
    info.appendChild(genreP);

    let locationP = document.createElement('p');
    info.appendChild(locationP);

    let dayP = document.createElement('p');
    info.appendChild(dayP);

    let timeP = document.createElement('p');
    info.appendChild(timeP);

    let bottomHr = document.createElement('hr');
    div.appendChild(bottomHr);

    infoContainer.setAttribute('style', 'display: flex; align-items: center; justify-content: space-around;');

    img.setAttribute('class', 'event-image');
    if (imageSrc == null || imageSrc == '') {
        img.setAttribute('src', 'assets/img/no.png');
    }
    else {
        img.setAttribute('src', imageSrc);
    }

    info.setAttribute('class', 'event-info');

    if (name == null || name == '') {
        nameHeader.textContent = 'N/A';
    }
    else {
        nameHeader.textContent = name;
    }

    if (genre == null || genre == '') {
        genreP.textContent = 'N/A';
    }
    else {
        genre = genre[0].toUpperCase() + genre.slice(1);
        genreP.textContent = genre;
    }

    if (location == null || location == '') {
        locationP.textContent = 'N/A';
    }
    else {
        locationP.textContent = location;
    }

    if (day == null || day == '') {
        dayP.textContent = 'N/A';
    }
    else {
        dayP.textContent = day;
    }

    if (time == null || time == '') {
        timeP.textContent = 'N/A';
    }
    else {
        timeP.textContent = time;
    }
}

function toStandardTime(militaryTime) {
    if (militaryTime == null || militaryTime == '') {
        return null;
    }

    militaryTime = militaryTime.split(':');
    if (militaryTime[0] > 12) {
      return (militaryTime[0] - 12) + ':' + militaryTime[1] + ' PM';
    }
    else {
      return militaryTime[0] + ':' + militaryTime[1] + ' AM';
    }
}

function getGenreSubstrings(genres) {
    let substrings = new Array();
    for (let genre of genres) {
        let subs = genre.genre.split(' ');
        for (let sub of subs) {
            substrings.push(sub);
        }
    }
    return substrings;
}

function getCurrentLatLong(position) {
    let lat = Math.round(position.coords.latitude * 1000) / 1000;
    let long = Math.round(position.coords.longitude * 1000) / 1000;
    return lat + ',' + long;
}

function geolocationError() {
    alert('Error retrieving location.');
}

///////////////////////////////////////////////////////////////////////////////

$(document).ready(function() {
    let genres = JSON.parse(sessionStorage.getItem('genres'));
    genreSubstrings = getGenreSubstrings(genres);
});

$('#search').click(async function() {
    let allEvents = document.getElementById('events');
    while (allEvents.lastElementChild) {
        allEvents.removeChild(allEvents.lastElementChild);
    }

    let location = document.getElementById('location').value;
    let radius = document.getElementById('radius').value;
    let isInputValid = radiusInputHandling(radius);

    if (!isInputValid) {
        return;
    }

    nearbyEvents = await fetchNearbyEvents(location, radius);

    let dateSettings = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    for (let event of nearbyEvents) {
        if (event.classifications[0].genre == null) {
            continue;
        }
        let genre = event.classifications[0].genre.name.toLowerCase();
        if (!genreSubstrings.includes(genre)) {
            continue;
        }

        let date = new Date(event.dates.start.localDate);
        createEventDiv(
            event.images[0].url,
            event.name,
            genre,
            event._embedded.venues[0].name,
            date.toLocaleDateString('en-US', dateSettings),
            toStandardTime(event.dates.start.localTime));
    }
});

$('#search-current').click(async function() {
    if (!navigator.geolocation) {
        alert('Geolocation services not supported.')
        return;
    }
    let location = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve(getCurrentLatLong(position));
            },
            () => {
                reject(geolocationError);
            }
        );
    });
    if (!location) {
        return;
    }

    let allEvents = document.getElementById('events');
    while (allEvents.lastElementChild) {
        allEvents.removeChild(allEvents.lastElementChild);
    }

    let radius = document.getElementById('radius').value;
    let isInputValid = radiusInputHandling(radius);

    if (!isInputValid) {
        return;
    }
    
    nearbyEvents = await fetchNearbyEvents(location, radius);

    let dateSettings = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    for (let event of nearbyEvents) {
        if (event.classifications[0].genre == null) {
            continue;
        }
        let genre = event.classifications[0].genre.name.toLowerCase();
        if (!genreSubstrings.includes(genre)) {
            continue;
        }

        let date = new Date(event.dates.start.localDate);
        createEventDiv(
            event.images[0].url,
            event.name,
            genre,
            event._embedded.venues[0].name,
            date.toLocaleDateString('en-US', dateSettings),
            toStandardTime(event.dates.start.localTime));
    }
});