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

///////////////////////////////////////////////////////////////////////////////

$('#search').click(function() {
    let location = document.getElementById('location').value;
    let radius = document.getElementById('radius').value;
    let isInputValid = radiusInputHandling(radius);

    if (!isInputValid) {
        return;
    }

    nearbyEvents = fetchNearbyEvents(location, radius);
    console.log(nearbyEvents);
});