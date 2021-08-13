/**
 * Resets the game after a barbarian death or the game is completed.
 */
function resetGame() {
    renderAtRestFrame(BARBARIAN_SPRITE);

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

    show(LIFE1);
    show(LIFE2);
    hideAllMessages();
}

/**
 * Resets settings after barbarian death when he has more lives.
 */
function resetGameContinue() {
    hide($('.life' + numLives));
    hide(CONTROL_MESSAGE);
}

/**
 * Reset all the sprite positions.
 */
function resetSpritePositions() {
    let spritesOnScreen = SCREENS[screenNumber][OPPONENTS];
    for (const sprite of SPRITES) {
        let isSpriteOnScreen = $.inArray(sprite, spritesOnScreen) !== -1;
        setDisplay(sprite[SPRITE], isSpriteOnScreen ? 'block' : 'none');
        setProperty(sprite, ACTION, getProperty(sprite, RESET, ACTION));
        setProperty(sprite, DIRECTION, getProperty(sprite, RESET, DIRECTION));
        setSpriteLeft(sprite, getProperty(sprite, RESET, LEFT));
        setCss(getProperty(sprite, SPRITE).css('bottom', getProperty(sprite, RESET, BOTTOM) + 'px'));
        setProperty(sprite, STATUS, getProperty(sprite, RESET, STATUS));
    }
}

/**
 * Resets trap doors when the game is restarted.
 */
function resetTrapDoors() {
    for (let scrNo of Object.keys(SCREENS)) {
        let trapDoors = SCREENS[scrNo][TRAP_DOORS];
        for (let trapDoor of trapDoors) {
            if (parseInt(scrNo) !== screenNumber) {
                trapDoor[ELEMENT].css('display', 'none');
            }
            trapDoor[ELEMENT].css('bottom', trapDoor[RESET][BOTTOM]);
        }
    }
}

/**
 * Initializes the current screen
 */
function initializeScreen() {
    let trapDoors = SCREENS[screenNumber][TRAP_DOORS];
    for (let trapDoor of trapDoors) {
        show(trapDoor[ELEMENT]);
        setCss(trapDoor[ELEMENT], trapDoor[RESET][BOTTOM] + 'px');
    }

    let monsterSprites = filterBarbarianSprite(SCREENS[screenNumber][OPPONENTS]);

    for (let monsterSprite of monsterSprites) {
        setSpriteLeft(monsterSprite, getProperty(monsterSprite, RESET, LEFT));
        setSpriteHighlight(monsterSprite, false);
        setCss(getProperty(monsterSprite, SPRITE).css('bottom', getProperty(monsterSprite, RESET, BOTTOM) + 'px'));
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
    if (compareProperty(BARBARIAN_SPRITE, STATUS, DEAD)) {
        resetGame();
        hideAllMessages();
        startMonsterAttacks();
        performAction(BARBARIAN_SPRITE, STOP, 0);
    }
}

/**
 * Handles the pause keypress event ("p" key).
 */
function handlePauseKeypress() {
    if (!compareProperty(BARBARIAN_SPRITE, STATUS, DEAD)) {
        if (isPaused) {
            hide(PAUSE_MESSAGE);
            isPaused = false;
            if (getProperty(BARBARIAN_SPRITE, ACTION) !== undefined) {
                performAction(BARBARIAN_SPRITE, getProperty(BARBARIAN_SPRITE, ACTION), 0);
            }
            startMonsterAttacks(true);
            setSoundsPauseState(false);
        } else {
            show(PAUSE_MESSAGE);
            isPaused = true;
            setSoundsPauseState(true);
        }
    }
}

/**
 * Handles the hints keypress event ("h" key).
 */
function handleHintsKeypress() {
    hide(SOUND_ON_MESSAGE);
    hide(SOUND_OFF_MESSAGE);

    hide(hints ? HINTS_ON_MESSAGE : HINTS_OFF_MESSAGE);
    show(hints ? HINTS_OFF_MESSAGE : HINTS_ON_MESSAGE);
    isHints = !isHints;

    setTimeout(function () {
        hide(HINTS_ON_MESSAGE);
        hide(HINTS_OFF_MESSAGE);
    }, TOGGLE_MESSAGE_TIME);
}

/**
 * Handles the sound keypress event ("x" key).
 */
function handleSoundKeypress() {
    hide(HINTS_ON_MESSAGE);
    hide(HINTS_OFF_MESSAGE);

    hide(sound ? SOUND_ON_MESSAGE : SOUND_OFF_MESSAGE);
    show(sound ? SOUND_OFF_MESSAGE : SOUND_ON_MESSAGE);
    setSoundsPauseState(sound);
    isSoundOn = !isSoundOn;

    setTimeout(function () {
        hide(SOUND_OFF_MESSAGE);
        hide(SOUND_ON_MESSAGE);
    }, TOGGLE_MESSAGE_TIME);
}

/**
 * Handles the run keypress event ("r" key).
 */
function handleRunKeypress() {
    getProperty(BARBARIAN_SPRITE, FPS, WALK);
    if (getProperty(BARBARIAN_SPRITE, ACTION) !== RUN && isBarbarianAliveOrJustDied()) {
        performAction(BARBARIAN_SPRITE, RUN, 0);
    }
}

/**
 * Handles the jump keypress event ("j" key).
 */
function handleJumpKeypress() {
    if (getProperty(BARBARIAN_SPRITE, ACTION) !== JUMP && isBarbarianAliveOrJustDied()) {
        performAction(BARBARIAN_SPRITE, JUMP, 1);
    }
}

/**
 * Handles the stop keypress event ("s" key).
 */
function handleStopKeypress() {
    if (isBarbarianAliveOrJustDied()) {
        performAction(BARBARIAN_SPRITE, STOP, 1);
    }
}

/**
 * Handles the move right keypress event (right arrow key).
 */
function handleRightKeypress() {
    if ((getProperty(BARBARIAN_SPRITE, ACTION) !== WALK || getProperty(BARBARIAN_SPRITE, DIRECTION) !== RIGHT) && isBarbarianAliveOrJustDied()) {
        setProperty(BARBARIAN_SPRITE, DIRECTION, RIGHT);
        performAction(BARBARIAN_SPRITE, WALK, 0);
    }
}

/**
 * Handles the move right keypress event (left arrow key).
 */
function handleLeftKeypress() {
    if ((BARBARIAN_SPRITE[ACTION] !== WALK || BARBARIAN_SPRITE[DIRECTION] !== LEFT) && isBarbarianAliveOrJustDied()) {
        setProperty(BARBARIAN_SPRITE, DIRECTION, LEFT);
        performAction(BARBARIAN_SPRITE, WALK, 0);
    }
}

/**
 * Handles the attack keypress event ("a" key).
 */
function handleAttackKeypress() {
    if (getProperty(BARBARIAN_SPRITE, ACTION) !== ATTACK && isBarbarianAliveOrJustDied()) {
        getProperty(BARBARIAN_SPRITE, SPRITE).stop()
        playGruntSound();
        performAction(BARBARIAN_SPRITE, ATTACK, 1);
    }
}

/**
 * Determines if the sprite has hit the left screen boundary.
 * @param sprite the sprite to check boundary conditions for
 * @returns {boolean|boolean} true if the sprite as hit the left boundary, false otherwise
 */
function hitLeftBoundary(sprite) {
    return !compareProperty(sprite, DIRECTION, RIGHT) && getProperty(sprite, SPRITE).offset().left === 0;
}

/**
 * Determines if the sprite has hit the right screen boundary.
 * @param sprite the sprite to check boundary conditions for
 * @returns {boolean|boolean} true if the sprite as hit the right boundary, false otherwise
 */
function hitRightBoundary(sprite) {
    return compareProperty(sprite, DIRECTION, RIGHT) && getProperty(sprite, SPRITE).offset().left === windowWidth - getSpriteWidth(sprite);
}

/**
 * Determines if the barbarian is alive or just recently died.
 * @returns {boolean}
 */
function isBarbarianAliveOrJustDied() {
    return !compareProperty(BARBARIAN_SPRITE, STATUS, DEAD) || isBarbarianJustDied();
}

/**
 * Determines if the barbarian has just died.
 * @returns {boolean} true if the barbarian has just died, false otherwise.
 */
function isBarbarianJustDied() {
    return new Date().getTime() - getProperty(BARBARIAN_SPRITE, DEATH, TIME) < JUST_DIED_THRESHOLD;
}



