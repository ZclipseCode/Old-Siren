var topArtists = JSON.parse(sessionStorage.getItem("topArtists"));
var genreOccurences = new Map();
var sortedGenres;

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
    if (a.occurences < b.occurences) {
        return -1;
    }
    if (a.occurences > b.occurences) {
        return 1;
    }
    return 0;
}

function setSortedGenres() {
    let genres = Array.from(genreOccurences, ([genre, occurences]) => ({ genre, occurences }));
    sortedGenres = genres.sort(sortGenres);
    sortedGenres.reverse();
}

function setGenresElement(id) {
    let genres = document.getElementById(id);
    genres.textContent = `${sortedGenres[0].genre}, ${sortedGenres[1].genre}, ${sortedGenres[2].genre}... and more!`;
}

///////////////////////////////////////////////////////////////////////////////

$(document).ready(function() {
    setGenreOccurences();
    setSortedGenres();
    setGenresElement('genres');
    sessionStorage.setItem('genres', JSON.stringify(sortedGenres))
});