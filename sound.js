function startThemeSong() {
    if (isSound() && !isPaused()) {
        SOUNDS[THEME_SONG].play();
    }
}

function playSound(sound) {
    if (isSound()) {
        SOUNDS[sound].play();
    }
}

function setSoundsPauseState(state) {
    if (isSound()) {
        if (state) {
            for (let sound of Object.values(SOUNDS)) {
                sound.pause();
            }
        } else {
            SOUNDS[THEME_SONG].play();
        }
    }
}

function playGruntSound() {
    if (isSound()) {
        SOUNDS[GRUNT_SOUND].play();
    }
}

function playGrowlSound() {
    if (isSound()) {
        SOUNDS[GROWL_SOUND].play();
    }
}

function playFireSound() {
    if (isSound()) {
        SOUNDS[FIRE_SOUND].play();
        setTimeout(function () {
            SOUNDS[FIRE_SOUND].pause();
        }, 3000);
    }
}

function playFallSound() {
    if (isSound()) {
        SOUNDS[FALL_SOUND].play();
    }
}
