const consumerKey = import.meta.env.VITE_TM_CONSUMER_KEY;
var nearbyEvents;

async function fetchNearbyEvents(latlong, radius) {
    let size = 200;
    let url = `https://app.ticketmaster.com/discovery/v2/events?apikey=${consumerKey}&latlong=${latlong}&radius=${radius}&unit=miles&classificationName=music&size=${size}`;

    let response = await fetch(url);
    let data = await response.json();
    let events = data._embedded.events || [];

    // for (let event of events) {
    //     console.log(event.name + ' ' + event.classifications[0].genre.name);
    // }
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

///////////////////////////////////////////////////////////////////////////////

$('#search').click(async function() {
    let location = document.getElementById('location').value;
    let radius = document.getElementById('radius').value;
    let isInputValid = radiusInputHandling(radius);

    if (!isInputValid) {
        return;
    }

    nearbyEvents = await fetchNearbyEvents(location, radius);

    let dateSettings = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    for (let event of nearbyEvents) {
        let date = new Date(event.dates.start.localDate);
        createEventDiv(
            event.images[0].url,
            event.name,
            event.classifications[0].genre.name,
            event._embedded.venues[0].name,
            date.toLocaleDateString('en-US', dateSettings),
            toStandardTime(event.dates.start.localTime));
    }
});