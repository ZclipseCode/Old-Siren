const clientId = import.meta.env.VITE_CLIENT_ID;

var accessToken;

const redirectUri = "http://localhost:5173/callback";
const scope = "user-top-read";
const authUrl = 'https://accounts.spotify.com/authorize?' +
    'client_id=' + clientId +
    '&response_type=token' +
    '&redirect_uri=' + redirectUri +
    '&scope=' + scope;

async function start(){
    if (window.location.href == redirectUri) {
        window.location.href = authUrl;
    }
    else {
        accessToken = getAccessTokenFromUrl();
        let topTracks = await fetchTopTracks(accessToken);
        console.log(topTracks);
    }
}

function getAccessTokenFromUrl() {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    return params.get('access_token');
}

async function fetchTopTracks(accessToken) {
    const limit = 50;
    const response = await fetch(
        `https://api.spotify.com/v1/me/top/tracks?limit=${limit}`,
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

///////////////////////////////////////////////////////////////////////////////

$('#start').click(function() {
    start();
});