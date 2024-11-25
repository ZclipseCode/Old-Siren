var topArtists = JSON.parse(sessionStorage.getItem("topArtists"));
var genreOccurences = new Map();

function setGenreOccurences() {
    for (let i = 0; i < topArtists.length; i++) {
        let artist = topArtists[i];
        if (artist.genres) {
            for (let genre of artist.genres) {
                let occurences = genreOccurences.get(genre);
                if (!occurences) {
                    occurences = 0;
                }
                genreOccurences.set(genre, occurences + 1);
            }
        }
    }
}

function sortGenres(a, b) {
    if (a[1] < b[1]) {
        return -1;
    }
    if (a[1] > b[1]) {
        return 1;
    }
    return 0;
}

$(document).ready(function() {
    setGenreOccurences();
    console.log(genreOccurences);
});