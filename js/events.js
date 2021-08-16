/**
 * Resets the game after a barbarian death or the game is completed.
 */
function resetGame() {
    renderAtRestFrame(BARBARIAN_CHARACTER);

    if (numLives < 1) {
        resetGameOver();
    } else {
        resetGameContinue();
    }
    resetTrapDoors();
    resetSpritePositions();
    initializeScreen();
}

/**
 * Resets settings after game is over.
 */
function resetGameOver() {
    numLives = 3;
    screenNumber = 0;
    setCss(BACKDROP, 'background-position', '0px');

    for (let i = 1; i < numLives; i++) {
        setCss($('.life' + i), 'display', 'block');
    }
    hideAllMessages();
}

/**
 * Resets settings after barbarian death when he has more lives.
 */
function resetGameContinue() {
    setCss($('.life' + numLives), 'display', 'none');
    setCss(CONTROL_MESSAGE, 'display', 'none');
}

/**
 * Reset all the sprite positions.
 */
function resetSpritePositions() {
    let spritesOnScreen = getProperty(SCREENS, screenNumber, OPPONENTS);
    for (const sprite of SPRITES) {
        let isSpriteOnScreen = $.inArray(sprite, spritesOnScreen) !== -1;
        setProperty(sprite, ACTION, getProperty(sprite, RESET, ACTION));
        setProperty(sprite, DIRECTION, getProperty(sprite, RESET, DIRECTION));
        setProperty(sprite, STATUS, getProperty(sprite, RESET, STATUS));
        setCharacterCss(sprite, 'display', isSpriteOnScreen ? 'block' : 'none');
        setCharacterCss(sprite, 'left',  getProperty(sprite, RESET, LEFT) + 'px');
        setCharacterCss(sprite, 'bottom', getProperty(sprite, RESET, BOTTOM) + 'px');
    }
}

/**
 * Resets trap doors when the game is restarted.
 */
function resetTrapDoors() {
    for (let scrNo of Object.keys(SCREENS)) {
        let trapDoors = getProperty(SCREENS, scrNo, TRAP_DOORS);
        for (let trapDoor of trapDoors) {
            if (parseInt(scrNo) !== screenNumber) {
                setCss(getProperty(trapDoor, ELEMENT), 'display', 'none');
            }
            setCss(getProperty(trapDoor, ELEMENT), 'bottom', getProperty(trapDoor, RESET, BOTTOM) + 'px');
        }
    }
}

/**
 * Initializes the current screen
 */
function initializeScreen() {
    let trapDoors = getProperty(SCREENS, screenNumber, TRAP_DOORS);
    for (let trapDoor of trapDoors) {
        setCss(getProperty(trapDoor, ELEMENT), 'display', 'block');
        setCss(getProperty(trapDoor, ELEMENT), getProperty(trapDoor, RESET, BOTTOM) + 'px');
    }

    let monsterSprites = filterBarbarianCharacter(getProperty(SCREENS, screenNumber, OPPONENTS));

    for (let monsterSprite of monsterSprites) {
        setCharacterCss(monsterSprite, 'left', getProperty(monsterSprite, RESET, LEFT) + 'px');
        setCharacterCss(monsterSprite, 'bottom', getProperty(monsterSprite, RESET, BOTTOM) + 'px');
        setCharacterCss(monsterSprite, 'filter', "brightness(100%)");
        setProperty(monsterSprite, STATUS, DEAD);
    }
}

/**
 * Determines whether the keypress event should be throttled based on how recently a keypress event happened.
 * @param lastKeypressTime the last time a keypress happened
 * @returns {boolean} true if the keypress should be throttled, false otherwise
 */
function shouldThrottle(lastKeypressTime) {
    let elapsed = KEYPRESS_THROTTLE_DELAY;
    if (typeof lastKeypressTime !== undefined) {
        elapsed = new Date().getTime() - lastKeypressTime;
    }
    return elapsed < KEYPRESS_THROTTLE_DELAY;
}

/**
 * Handles the space bar keypress event that restarts the game after a barbarian death or game completion.
 */
function handleSpaceKeypress() {
    if (compareProperty(BARBARIAN_CHARACTER, STATUS, DEAD)) {
        resetGame();
        hideAllMessages();
        startMonsterAttacks();
        performAction(BARBARIAN_CHARACTER, STOP, 0);
    }
}

/**
 * Handles the pause keypress event ("p" key).
 */
function handlePauseKeypress() {
    if (!compareProperty(BARBARIAN_CHARACTER, STATUS, DEAD)) {
        if (isPaused) {
            setCss(PAUSE_MESSAGE, 'display', 'none');
            isPaused = false;
            if (!compareProperty(BARBARIAN_CHARACTER, ACTION, undefined)) {
                console.log('unpausing and index is' + pauseFrameIndex);
                performAction(BARBARIAN_CHARACTER, getProperty(BARBARIAN_CHARACTER, ACTION), getProperty(BARBARIAN_ACTION_NUM_TIMES, ACTION), pauseFrameIndex);
                pauseFrameIndex = 0;
            }
            startMonsterAttacks(true);
            setSoundsPauseState(false);
        } else {
            setCss(PAUSE_MESSAGE, 'display', 'block');
            isPaused = true;
            setSoundsPauseState(true);
        }
    }
}

/**
 * Handles the hints keypress event ("h" key).
 */
function handleHintsKeypress() {
    setCss(SOUND_ON_MESSAGE, 'display', 'none');
    setCss(SOUND_OFF_MESSAGE, 'display', 'none');

    setCss(hints ? HINTS_ON_MESSAGE : HINTS_OFF_MESSAGE, 'display', 'none');
    setCss(hints ? HINTS_OFF_MESSAGE : HINTS_ON_MESSAGE, 'display', 'block');
    isHints = !isHints;

    setTimeout(function () {
        setCss(HINTS_ON_MESSAGE, 'display', 'none');
        setCss(HINTS_OFF_MESSAGE, 'display', 'none');
    }, TOGGLE_MESSAGE_TIME);
}

/**
 * Handles the sound keypress event ("x" key).
 */
function handleSoundKeypress() {
    setCss(HINTS_ON_MESSAGE, 'display', 'none');
    setCss(HINTS_OFF_MESSAGE, 'display', 'none');

    setCss(sound ? SOUND_ON_MESSAGE : SOUND_OFF_MESSAGE, 'display', 'none');
    setCss(sound ? SOUND_OFF_MESSAGE : SOUND_ON_MESSAGE, 'display', 'block');
    setSoundsPauseState(sound);
    isSoundOn = !isSoundOn;

    setTimeout(function () {
        setCss(SOUND_OFF_MESSAGE, 'display', 'none');
        setCss(SOUND_ON_MESSAGE, 'display', 'none');
    }, TOGGLE_MESSAGE_TIME);
}

/**
 * Handles the run keypress event ("r" key).
 */
function handleRunKeypress() {
    getProperty(BARBARIAN_CHARACTER, FPS, WALK);
    if (!compareProperty(BARBARIAN_CHARACTER, ACTION, RUN) && isBarbarianAliveOrJustDied()) {
        performAction(BARBARIAN_CHARACTER, RUN, getProperty(BARBARIAN_ACTION_NUM_TIMES, RUN));
    }
}

/**
 * Handles the jump keypress event ("j" key).
 */
function handleJumpKeypress() {
    if (!compareProperty(BARBARIAN_CHARACTER, ACTION, JUMP) && isBarbarianAliveOrJustDied()) {
        performAction(BARBARIAN_CHARACTER, JUMP, getProperty(BARBARIAN_ACTION_NUM_TIMES, JUMP));
    }
}

/**
 * Handles the stop keypress event ("s" key).
 */
function handleStopKeypress() {
    if (isBarbarianAliveOrJustDied()) {
        performAction(BARBARIAN_CHARACTER, STOP, getProperty(BARBARIAN_ACTION_NUM_TIMES, STOP));
    }
}

/**
 * Handles the move right keypress event (right arrow key).
 */
function handleRightKeypress() {
    if ((!compareProperty(BARBARIAN_CHARACTER, ACTION, WALK) || !compareProperty(BARBARIAN_CHARACTER, DIRECTION, RIGHT))
        && isBarbarianAliveOrJustDied()) {
        setProperty(BARBARIAN_CHARACTER, DIRECTION, RIGHT);
        performAction(BARBARIAN_CHARACTER, WALK, getProperty(BARBARIAN_ACTION_NUM_TIMES, WALK));
    }
}

/**
 * Handles the move right keypress event (left arrow key).
 */
function handleLeftKeypress() {
    if ((!compareProperty(BARBARIAN_CHARACTER, ACTION, WALK) || !compareProperty(BARBARIAN_CHARACTER, DIRECTION, LEFT))
        && isBarbarianAliveOrJustDied()) {
        setProperty(BARBARIAN_CHARACTER, DIRECTION, LEFT);
        performAction(BARBARIAN_CHARACTER, WALK, getProperty(BARBARIAN_ACTION_NUM_TIMES, WALK));
    }
}

/**
 * Handles the attack keypress event ("a" key).
 */
function handleAttackKeypress() {
    if (!compareProperty(BARBARIAN_CHARACTER, ACTION, ATTACK) && isBarbarianAliveOrJustDied()) {
        getProperty(BARBARIAN_CHARACTER, SPRITE).stop();
        playGruntSound();
        performAction(BARBARIAN_CHARACTER, ATTACK, getProperty(BARBARIAN_ACTION_NUM_TIMES, ATTACK));
    }
}

/**
 * Determines if the sprite has hit the left screen boundary.
 * @param character the character to check boundary conditions for
 * @returns {boolean|boolean} true if the sprite as hit the left boundary, false otherwise
 */
function hitLeftBoundary(character) {
    return !compareProperty(character, DIRECTION, RIGHT) && getProperty(character, SPRITE).offset().left === 0;
}

/**
 * Determines if the character has hit the right screen boundary.
 * @param character the character check boundary conditions for
 * @returns {boolean|boolean} true if the sprite as hit the right boundary, false otherwise
 */
function hitRightBoundary(character) {
    return compareProperty(character, DIRECTION, RIGHT) && getProperty(character, SPRITE).offset().left ===
            windowWidth - getProperty(character, SPRITE).width();
}

/**
 * Determines if the barbarian is alive or just recently died.
 * @returns {boolean}
 */
function isBarbarianAliveOrJustDied() {
    return !compareProperty(BARBARIAN_CHARACTER, STATUS, DEAD) || isBarbarianJustDied();
}

/**
 * Determines if the barbarian has just died.
 * @returns {boolean} true if the barbarian has just died, false otherwise.
 */
function isBarbarianJustDied() {
    return new Date().getTime() - getProperty(BARBARIAN_CHARACTER, DEATH, TIME) < JUST_DIED_THRESHOLD;
}



