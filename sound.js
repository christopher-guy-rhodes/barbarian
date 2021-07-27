function initializeThemeSong() {
    if (sound) {
        theme = new Audio('/sounds/theme.mp3');
    }
}

function startThemeSong() {
    if (sound && !pause) {
        theme.play();
        theme.loop = true;
    }
}

function pauseThemeSong() {
    if (sound) {
        theme.pause();
    }
}

function unpauseThemeSong() {
    if (sound) {
        theme.play();
    }
}

function playGruntSound() {
    if (sound) {
        var audio = new Audio('/sounds/grunt.mp3');
        audio.play();
        setTimeout(function () {
            audio.pause();
        }, 800);
    }

}
