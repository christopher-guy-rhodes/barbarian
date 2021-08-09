function isActionsLocked() {
    return actionsLocked;
}

function setActionsLocked(value) {
    actionsLocked = value;
}

function isHints() {
    return hints;
}

function setHints(status) {
    hints = status;
}

function isPaused() {
    return pause;
}

function setPaused(state) {
    pause = state;
}

function isSound() {
    return sound;
}

function setSound(status) {
    sound = status;
}

function getScreenNumber() {
    return screenNumber;
}

function setScreenNumber(number) {
    screenNumber = number;
}

/**
 * Resets the game after a barbarian death or the game is completed.
 */
function resetGame() {
    renderAtRestFrame(BARBARIAN_SPRITE);
    resetSpritePositions();

    if (getLives() < 1) {
        resetGameOver();
    } else {
        resetGameContinue();
    }
    resetTrapDoors();
    initializeScreen();
}

/**
 * Resets settings after game is over.
 */
function resetGameOver() {
    setLives(3);
    setScreenNumber(0);
    setBackgroundPosition(BACKDROP, 0);
    show(LIFE1);
    show(LIFE2);
    hideAllMessages();
}

/**
 * Resets settings after barbarian death when he has more lives.
 */
function resetGameContinue() {
    hide($('.life' + getLives()));
    hide(CONTROL_MESSAGE);
}

/**
 * Reset all the sprite positions.
 */
function resetSpritePositions() {
    let spritesOnScreen = SCREENS[getScreenNumber()][OPPONENTS];
    for (const sprite of SPRITES) {
        let isSpriteOnScreen = $.inArray(sprite, spritesOnScreen) !== -1;
        setDisplay(sprite[SPRITE], isSpriteOnScreen ? 'block' : 'none');
        setAction(sprite, getResetAction(sprite));
        setDirection(sprite, getResetDirection(sprite));
        setLeft(sprite, getResetLeft(sprite));
        setSpriteBottom(sprite, getResetBottom(sprite));
        setStatus(sprite, getResetStatus(sprite));
    }
}

/**
 * Resets trap doors when the game is restarted.
 */
function resetTrapDoors() {
    console.log('reset trap doors');
    for (let screenNumber of Object.keys(SCREENS)) {
        if (parseInt(screenNumber) === getScreenNumber()) {
            continue;
        }
        let trapDoors = SCREENS[screenNumber][TRAP_DOORS];
        for (let trapDoor of trapDoors) {
            trapDoor[ELEMENT].css('display', 'none');
            trapDoor[ELEMENT].css('bottom', trapDoor[RESET][BOTTOM]);
        }
    }
}

/**
 * Initializes the current screen
 */
function initializeScreen() {
    console.log('initialize screen');
    let trapDoors = SCREENS[getScreenNumber()][TRAP_DOORS];
    for (let trapDoor of trapDoors) {
        show(trapDoor[ELEMENT]);
        setBottom(trapDoor[ELEMENT], trapDoor[RESET][BOTTOM]);
    }

    let monsterSprites = filterBarbarianSprite(SCREENS[getScreenNumber()][OPPONENTS]);

    for (let monsterSprite of monsterSprites) {
        setLeft(monsterSprite, getResetLeft(monsterSprite));
        setHighlight(monsterSprite, false);
        setSpriteBottom(monsterSprite, getResetBottom(monsterSprites));
        setStatus(monsterSprite, DEAD);
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
    if (isDead(BARBARIAN_SPRITE)) {
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
    if (!isDead(BARBARIAN_SPRITE)) {
        if (isPaused()) {
            hide(PAUSE_MESSAGE);
            setPaused(false);
            if (getAction(BARBARIAN_SPRITE) !== undefined) {
                performAction(BARBARIAN_SPRITE, getAction(BARBARIAN_SPRITE), 0);
            }
            startMonsterAttacks(true);
            setSoundsPauseState(false);
        } else {
            show(PAUSE_MESSAGE);
            setPaused(true);
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

    hide(isHints() ? HINTS_ON_MESSAGE : HINTS_OFF_MESSAGE);
    show(isHints() ? HINTS_OFF_MESSAGE : HINTS_ON_MESSAGE);
    setHints(!isHints());

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

    hide(isSound() ? SOUND_ON_MESSAGE : SOUND_OFF_MESSAGE);
    show(isSound() ? SOUND_OFF_MESSAGE : SOUND_ON_MESSAGE);
    setSoundsPauseState(isSound());
    setSound(!isSound());

    setTimeout(function () {
        hide(SOUND_OFF_MESSAGE);
        hide(SOUND_ON_MESSAGE);
    }, TOGGLE_MESSAGE_TIME);
}

/**
 * Handles the run keypress event ("r" key).
 */
function handleRunKeypress() {
    if (getAction(BARBARIAN_SPRITE) !== RUN && isBarbarianAliveOrJustDied()) {
        performAction(BARBARIAN_SPRITE, RUN, 0);
    }
}

/**
 * Handles the jump keypress event ("j" key).
 */
function handleJumpKeypress() {
    if (getAction(BARBARIAN_SPRITE) !== JUMP && isBarbarianAliveOrJustDied()) {
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
    if ((getAction(BARBARIAN_SPRITE) !== WALK || getDirection(BARBARIAN_SPRITE) !== RIGHT) && isBarbarianAliveOrJustDied()) {
        setDirection(BARBARIAN_SPRITE, RIGHT);
        performAction(BARBARIAN_SPRITE, WALK, 0);
    }
}

/**
 * Handles the move right keypress event (left arrow key).
 */
function handleLeftKeypress() {
    if ((BARBARIAN_SPRITE[ACTION] !== WALK || BARBARIAN_SPRITE[DIRECTION] !== LEFT) && isBarbarianAliveOrJustDied()) {
        setDirection(BARBARIAN_SPRITE, LEFT);
        performAction(BARBARIAN_SPRITE, WALK, 0);
    }
}

/**
 * Handles the attack keypress event ("a" key).
 */
function handleAttackKeypress() {
    if (getAction(BARBARIAN_SPRITE) !== ATTACK && isBarbarianAliveOrJustDied()) {
        stopSpriteMovement(BARBARIAN_SPRITE);
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
    return !isMovingRight(sprite) && getLeft(sprite) === 0;
}

/**
 * Determines if the sprite has hit the right screen boundary.
 * @param sprite the sprite to check boundary conditions for
 * @returns {boolean|boolean} true if the sprite as hit the right boundary, false otherwise
 */
function hitRightBoundary(sprite) {
    return isMovingRight(sprite) && getLeft(sprite) === windowWidth - getWidth(sprite);
}

/**
 * Determines if the barbarian is alive or just recently died.
 * @returns {boolean}
 */
function isBarbarianAliveOrJustDied() {
    return !isDead(BARBARIAN_SPRITE) || isBarbarianJustDied();
}

/**
 * Determines if the barbarian has just died.
 * @returns {boolean} true if the barbarian has just died, false otherwise.
 */
function isBarbarianJustDied() {
    return new Date().getTime() - getDeathTime(BARBARIAN_SPRITE) < JUST_DIED_THRESHOLD;
}



