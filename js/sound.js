/**
 * Plays the theme song if sound is enabled and the game is not paused.
 */
function playThemeSong() {
    // Theme song can be undefined because there is a problem where it won't play when running the server locally
    if (isSoundOn && !isPaused && SOUNDS[THEME_SONG] !== undefined) {
        SOUNDS[THEME_SONG].play();
    }
}

/**
 * Plays the specified sound if sound is enabled .
 * @param sound the sound to play
 */
function playSound(snd) {
    if (isSoundOn) {
        SOUNDS[snd].play();
    }
}

/**
 * Pauses all sounds if the game is paused, start the theme song if if the game is not paused.
 */
function setSoundsPauseState() {
    if (isSoundOn) {
        if (isPaused) {
            for (let sound of Object.values(SOUNDS)) {
                sound.pause();
            }
        } else if (SOUNDS[THEME_SONG] !== undefined) {
            SOUNDS[THEME_SONG].play();
        }
    }
}

/**
 * Play the grunt sound if sound is enabled.
 */
function playGruntSound() {
    if (isSoundOn) {
        SOUNDS[GRUNT_SOUND].play();
    }
}

/**
 * Play the growl sound if sound is enabled.
 */
function playGrowlSound() {
    if (isSoundOn) {
        SOUNDS[GROWL_SOUND].play();
    }
}

/**
 * Play the fire sound if sound is enabled.
 */
function playFireSound() {
    if (isSoundOn) {
        SOUNDS[FIRE_SOUND].play();
        setTimeout(function () {
            SOUNDS[FIRE_SOUND].pause();
        }, 3000);
    }
}

/**
 * Play the fall sound if sound is enabled.
 */
function playFallSound() {
    if (isSoundOn) {
        SOUNDS[FALL_SOUND].play();
    }
}
