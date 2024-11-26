const clientId = import.meta.env.VITE_CLIENT_ID;

var accessToken;

const startUrl = "http://localhost:5173";
const redirectUri = "http://localhost:5173/callback";
const scope = "user-top-read";
const authUrl = 'https://accounts.spotify.com/authorize?' +
    'client_id=' + clientId +
    '&response_type=token' +
    '&redirect_uri=' + redirectUri +
    '&scope=' + scope;

async function start(){
    if (window.location.href.length <= redirectUri.length) {
        window.location.href = authUrl;
    }
    else {
        accessToken = getAccessTokenFromUrl();
        let topArtists = await fetchTopArtists(accessToken);
        
        sessionStorage.setItem("topArtists", JSON.stringify(topArtists));
        window.location.href = 'music-taste.html';
    }
}

function getAccessTokenFromUrl() {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    return params.get('access_token');
}

async function fetchTopArtists(accessToken) {
    const limit = 50;
    const response = await fetch(
        `https://api.spotify.com/v1/me/top/artists?limit=${limit}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data.items;
}

function startPrompt(id) {
    let start = document.getElementById(id);

    if (window.location.href.length <= redirectUri.length) {
        start.textContent = "Login to Spotify";
    }
    else {
        start.textContent = "Start";
    }
}

///////////////////////////////////////////////////////////////////////////////

$(document).ready(function() {
    startPrompt('start');
});

$('#start').click(function() {
    start();
});