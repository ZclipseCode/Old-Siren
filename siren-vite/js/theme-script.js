var theme;

function findTheme() {
    theme = sessionStorage.getItem('theme');
    if (theme == null || theme == '') {
        let standard = document.getElementById('theme').value;
        sessionStorage.setItem('theme', standard);
    }
}

function setTheme(newTheme, background, circles) {
    if (newTheme == 'sunset') {
        background.style.background = 'linear-gradient(0deg, #ff6a00 0%, #ee0979 100%)';
        for (let c of circles) {
            c.style.background = 'linear-gradient(0deg, #ee0979 0%, #ff6a00 100%)';
        }
    }
    else if (newTheme == 'lagoon') {
        background.style.background = 'linear-gradient(0deg, #09eb20 0%, #003605 100%)';
        for (let c of circles) {
            c.style.background = 'linear-gradient(0deg, #003605 0%, #09eb20 100%)';
        }
    }
    else if (newTheme == 'zclipse') {
        background.style.background = 'linear-gradient(0deg, #efefef 0%, #5A4ae3 100%)';
        for (let c of circles) {
            c.style.background = 'linear-gradient(0deg, #5A4ae3 0%, #efefef 100%)';
        }
    }

    sessionStorage.setItem('theme', newTheme);
}

///////////////////////////////////////////////////////////////////////////////

$(document).ready(function() {
    findTheme();
    let chooseTheme = document.getElementById('theme');
    let background = document.getElementsByClassName('masthead');
    let circles = document.getElementsByClassName('bg-circle');
    setTheme(sessionStorage.getItem('theme'), background[0], circles);
    chooseTheme.addEventListener('change', function() {
        setTheme(chooseTheme.value, background[0], circles)
    });
});