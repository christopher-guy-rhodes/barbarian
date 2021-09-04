/**
 * Plays the theme song if sound is enabled and the game is not paused.
 */
function playThemeSong() {
    // Theme song can be undefined because there is a problem where it won't play when running the server locally
    if (isSoundOn && !isPaused && !compareProperty(SOUNDS, THEME_SONG, undefined)) {
        getProperty(SOUNDS, THEME_SONG).play();
    }
}

/**
 * Plays the specified sound if sound is enabled .
 * @param sound the sound to play
 */
function playSound(snd) {
    if (isSoundOn) {
        getProperty(SOUNDS, snd).play();
    }
}

/**
 * Pauses all sounds if the game is paused, start the theme song if if the game is not paused.
 */
function setSoundsPauseState() {
    if (isSoundOn) {
        if (isPaused) {
            stopAllSounds()
        } else if (!compareProperty(SOUNDS, THEME_SONG, undefined)) {
            getProperty(SOUNDS, THEME_SONG).play();
        }
    }
}

function stopAllSounds() {
    for (let sound of Object.values(SOUNDS)) {
        sound.pause();
    }
}

/**
 * Play the grunt sound if sound is enabled.
 */
function playGruntSound() {
    if (isSoundOn) {
        getProperty(SOUNDS, GRUNT_SOUND).play();
    }
}

/**
 * Play the growl sound if sound is enabled.
 */
function playGrowlSound() {
    if (isSoundOn) {
        getProperty(SOUNDS, GROWL_SOUND).play();
    }
}

/**
 * Play the fire sound if sound is enabled.
 */
function playFireSound() {
    if (isSoundOn) {
        getProperty(SOUNDS, FIRE_SOUND).play();
        setTimeout(function () {
            getProperty(SOUNDS, FIRE_SOUND).pause();
        }, 3000);
    }
}

/**
 * Play the fall sound if sound is enabled.
 */
function playFallSound() {
    if (isSoundOn) {
        getProperty(SOUNDS, FALL_SOUND).play();
    }
}
