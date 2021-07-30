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

function playSound(soundPath) {
    let audio = new Audio(soundPath);
    audio.play();
}

function setThemeSongPauseState(state) {
    if (sound) {
        if (state) {
            theme.pause();
        } else {
            theme.play();
        }
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

function playGrowlSound() {
    if (isSound()) {
        let audio = new Audio('/sounds/growl.mp3');
        audio.play();
        setTimeout(function () {
            audio.pause();
        }, 4000);
    }
}

function playFireSound() {
    if (sound) {
        let audio = new Audio('/sounds/fire.mp3');
        audio.play();
        setTimeout(function () {
            audio.pause();
        }, 3000);
    }
}

function playFallSound() {
    let audio = new Audio('/sounds/fall.mp3');
    audio.play();
    setTimeout(function () {
        audio.pause();
    }, 3400);

}
