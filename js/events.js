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
    setCss(BACKDROP, 'background-position', '0px 0px');

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
    let characters = new Array(BARBARIAN_CHARACTER);
    for (let scrNum of Object.keys(SCREENS)) {
        let screen = SCREENS[scrNum];
        for (let opponent of filterBarbarianCharacter(getProperty(screen, OPPONENTS))) {
            characters.push(opponent);
        }
    }

    let spritesOnScreen = getProperty(SCREENS, screenNumber, OPPONENTS);
    for (const character of characters) {
        let isSpriteOnScreen = $.inArray(character, spritesOnScreen) !== -1;
        character.setAction(character.getResetAction());
        character.setDirection(character.getResetDirection());
        character.setStatus(character.getResetStatus());
        setCharacterCss(character, 'display', isSpriteOnScreen ? 'block' : 'none');
        setCharacterCss(character, 'left',  character.getResetLeft() + 'px');
        setCharacterCss(character, 'bottom', character.getResetBottom(screenNumber) + 'px');
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
            setCss(getProperty(trapDoor, ELEMENT), 'bottom', getProperty(trapDoor, RESET, BOTTOM, screenNumber) + 'px');
        }
    }
}

/**
 * Initializes the current screen
 */
function initializeScreen() {

    if (compareProperty(SCREENS, screenNumber, WATER, true)) {
        performAction(BARBARIAN_CHARACTER, SWIM, 0);
    }

    let trapDoors = getProperty(SCREENS, screenNumber, TRAP_DOORS);
    for (let trapDoor of trapDoors) {
        setCss(getProperty(trapDoor, ELEMENT), 'display', 'block');
        setCss(getProperty(trapDoor, ELEMENT), 'bottom', getProperty(trapDoor, RESET, BOTTOM) + 'px');
    }

    let monsterSprites = filterBarbarianCharacter(getProperty(SCREENS, screenNumber, OPPONENTS));

    for (let monsterSprite of monsterSprites) {
        setCharacterCss(monsterSprite, 'left', monsterSprite.getResetLeft() + 'px');
        setCharacterCss(monsterSprite, 'bottom', monsterSprite.getResetBottom(screenNumber) + 'px');
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
function handleSpaceKeypress(event) {
    if (BARBARIAN_CHARACTER.getStatus() === DEAD) {
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
                let action = BARBARIAN_CHARACTER.getAction();
                performAction(BARBARIAN_CHARACTER, action, BARBARIAN_CHARACTER.getActionNumberOfTimes(action), pauseFrameIndex);
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

    setCss(isHints ? HINTS_ON_MESSAGE : HINTS_OFF_MESSAGE, 'display', 'none');
    setCss(isHints ? HINTS_OFF_MESSAGE : HINTS_ON_MESSAGE, 'display', 'block');
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

    setCss(isSoundOn ? SOUND_ON_MESSAGE : SOUND_OFF_MESSAGE, 'display', 'none');
    setCss(isSoundOn ? SOUND_OFF_MESSAGE : SOUND_ON_MESSAGE, 'display', 'block');
    isSoundOn = !isSoundOn;

    if (isSoundOn) {
        playThemeSong();
    } else {
        stopAllSounds();
    }


    setTimeout(function () {
        setCss(SOUND_OFF_MESSAGE, 'display', 'none');
        setCss(SOUND_ON_MESSAGE, 'display', 'none');
    }, TOGGLE_MESSAGE_TIME);
}

/**
 * Handles the run keypress event ("r" key).
 */
function handleRunKeypress() {
    if (BARBARIAN_CHARACTER.getAction() !== SWIM &&
        BARBARIAN_CHARACTER.getAction() !== RUN &&
        isBarbarianAliveOrJustDied()) {
        performAction(BARBARIAN_CHARACTER, RUN, BARBARIAN_CHARACTER.getActionNumberOfTimes(RUN));
    }
}

/**
 * Handles the jump keypress event ("j" key).
 */
function handleJumpKeypress() {
    if (BARBARIAN_CHARACTER.getAction() !== SWIM &&
        BARBARIAN_CHARACTER.getAction() !== JUMP &&
        isBarbarianAliveOrJustDied()) {
        performAction(BARBARIAN_CHARACTER, JUMP, BARBARIAN_CHARACTER.getActionNumberOfTimes(JUMP));
    }
}

/**
 * Handles the stop keypress event ("s" key).
 */
function handleStopKeypress() {
    if (!compareProperty(BARBARIAN_CHARACTER, ACTION, SWIM) && isBarbarianAliveOrJustDied()) {
        performAction(BARBARIAN_CHARACTER, STOP, BARBARIAN_CHARACTER.getActionNumberOfTimes(STOP));
    }
}

/**
 * Handles the move right keypress event (right arrow key).
 */
function handleRightKeypress() {
    let action = compareProperty(SCREENS, screenNumber, WATER, true) ? SWIM : WALK;
    if ((BARBARIAN_CHARACTER.getAction() !== action || BARBARIAN_CHARACTER.getDirection() !== RIGHT)
        && isBarbarianAliveOrJustDied()) {
        BARBARIAN_CHARACTER.setDirection(RIGHT);
        performAction(BARBARIAN_CHARACTER, action, BARBARIAN_CHARACTER.getActionNumberOfTimes(action));
    }
}

/**
 * Handles the move right keypress event (left arrow key).
 */
function handleLeftKeypress() {
    let action = compareProperty(SCREENS, screenNumber, WATER, true) ? SWIM : WALK;
    if ((BARBARIAN_CHARACTER.getAction() !== action || BARBARIAN_CHARACTER.getDirection() !== LEFT)
        && isBarbarianAliveOrJustDied()) {
        BARBARIAN_CHARACTER.setDirection(LEFT);
        performAction(BARBARIAN_CHARACTER, action, BARBARIAN_CHARACTER.getActionNumberOfTimes(action));
    }
}


/**
 * Handles the up keypress event (up arrow key);
 */
function handleUpKeypress() {
    if (BARBARIAN_CHARACTER.getAction() !== SWIM || BARBARIAN_CHARACTER.getVerticalDirection() !== UP) {
        if (compareProperty(SCREENS, screenNumber, WATER, true)) {
            BARBARIAN_CHARACTER.setVerticalDirection(UP);
            performAction(BARBARIAN_CHARACTER, SWIM, BARBARIAN_CHARACTER.getActionNumberOfTimes(SWIM));
        }
    }
}

/**
 * Handles the down keypress event (down arrow key);
 */
function handleDownKeypress() {
    if (BARBARIAN_CHARACTER.getAction() !== SWIM || BARBARIAN_CHARACTER.getVerticalDirection() !== DOWN) {
        if (compareProperty(SCREENS, screenNumber, WATER, true)) {
            BARBARIAN_CHARACTER.setVerticalDirection(DOWN);
            performAction(BARBARIAN_CHARACTER, SWIM, BARBARIAN_CHARACTER.getActionNumberOfTimes(SWIM));
        }
    }
}



/**
 * Handles the attack keypress event ("a" key).
 */
function handleAttackKeypress() {
    if (BARBARIAN_CHARACTER.getAction() !== SWIM &&
        BARBARIAN_CHARACTER.getAction() !== ATTACK &&
        isBarbarianAliveOrJustDied()) {
        BARBARIAN_CHARACTER.getSprite().stop();
        playGruntSound();
        performAction(BARBARIAN_CHARACTER, ATTACK, BARBARIAN_CHARACTER.getActionNumberOfTimes(ATTACK));
    }
}

/**
 * Determines if the sprite has hit the left screen boundary.
 * @param character the character to check boundary conditions for
 * @returns {boolean|boolean} true if the sprite as hit the left boundary, false otherwise
 */
function hitLeftBoundary(character) {
    return character.getDirection() !== RIGHT && character.getSprite().offset().left === 0;
}

/**
 * Determines if the character has hit the right screen boundary.
 * @param character the character check boundary conditions for
 * @returns {boolean|boolean} true if the sprite as hit the right boundary, false otherwise
 */
function hitRightBoundary(character) {
    return character.getDirection() === RIGHT && character.getSprite().offset().left ===
            windowWidth - character.getSprite().width();
}

/**
 * Determines if the barbarian is alive or just recently died.
 * @returns {boolean}
 */
function isBarbarianAliveOrJustDied() {
    return BARBARIAN_CHARACTER.getStatus() !== DEAD || isBarbarianJustDied();
}

/**
 * Determines if the barbarian has just died.
 * @returns {boolean} true if the barbarian has just died, false otherwise.
 */
function isBarbarianJustDied() {
    return new Date().getTime() - BARBARIAN_CHARACTER.getDeathTime() < JUST_DIED_THRESHOLD;
}

/**
 * Handle keypress events and dispatch to appropriate handlers
 * @param keypress the ASCII key code
 */
function handleKeypress(keypress) {
    playThemeSong();

    keypressTime = new Date().getTime();

    let notInnterruptable = getProperty(BARBARIAN_CHARACTER, ACTION) == FALL;
    if (!shouldThrottle(lastKeypressTime) && !notInnterruptable && !actionsLocked) {
        lastKeypressTime = keypressTime;
        keypressTime = new Date().getTime();

        if (!isPaused || compareProperty(KEYPRESS, KP_PAUSE, keypress)) {

            switch (keypress) {
                case getProperty(KEYPRESS, KP_CONTROLS):
                    if(compareProperty(BARBARIAN_CHARACTER, STATUS, DEAD)) {
                        showMessage(CONTROL_MESSAGE);
                    }
                    break;
                case getProperty(KEYPRESS, KP_MAIN):
                    if(compareProperty(BARBARIAN_CHARACTER, STATUS, DEAD)) {
                        showMessage(START_MESSAGE);
                    }
                    break;
                case getProperty(KEYPRESS, KP_SPACE):
                    handleSpaceKeypress();
                    break;
                case getProperty(KEYPRESS, KP_PAUSE):
                    handlePauseKeypress();
                    break;
                case getProperty(KEYPRESS, KP_HINTS):
                    handleHintsKeypress();
                    break;
                case getProperty(KEYPRESS, KP_SOUND):
                    handleSoundKeypress();
                    break;
                case getProperty(KEYPRESS, KP_RUN):
                    handleRunKeypress();
                    break;
                case getProperty(KEYPRESS, KP_JUMP):
                    handleJumpKeypress();
                    break;
                case getProperty(KEYPRESS, KP_STOP):
                    handleStopKeypress();
                    break;
                case getProperty(KEYPRESS, KP_RIGHT):
                    handleRightKeypress();
                    break;
                case getProperty(KEYPRESS, KP_LEFT):
                    handleLeftKeypress();
                    break;
                case getProperty(KEYPRESS, KP_ATTACK):
                    handleAttackKeypress();
                    break;
                case getProperty(KEYPRESS, KP_UP):
                    handleUpKeypress();
                    break;
                case getProperty(KEYPRESS, KP_DOWN):
                    handleDownKeypress();
                    break;
                default:
                    return; // exit this handler for other keys
            }
        }
    }

}

/**
 * Handles a mouse click.
 * @param event the evnet
 */
function clickHandler(event) {
    if (compareProperty(BARBARIAN_CHARACTER, STATUS, DEAD)) {
        handleKeypress(KEYPRESS[KP_SPACE]);
    }
    let topOfBarbarian = parseInt(stripPxSuffix(BARBARIAN_CHARACTER.getSprite().css('height')))/2 + parseInt(stripPxSuffix(BARBARIAN_CHARACTER.getSprite().css('bottom')));
    let barbarianLeft = BARBARIAN_CHARACTER.getSprite().offset().left + parseInt(stripPxSuffix(BARBARIAN_CHARACTER.getSprite().css('width')) / 2);
    let pageX = event.originalEvent.pageX;
    let clickY = event.originalEvent.pageY;
    if (clickY < 200) {
        handleKeypress(KEYPRESS[KP_JUMP]);
    } else  {
        if (BARBARIAN_CHARACTER.getAction() === WALK) {
            handleKeypress(KEYPRESS[KP_RUN]);
        } else {
            handleKeypress(KEYPRESS[pageX > barbarianLeft ? KP_RIGHT : KP_LEFT]);
        }
    }
}

/**
 * Handles a tap hold event.
 * @param event the event
 */
function tapHoldHandler(event) {
    handleKeypress(KEYPRESS[KP_PAUSE]);
}

/**
 * Handles a swipe right event.
 * @param event the event
 */
function swipeRightHandler(event){
    if (testCss(CONTROL_MESSAGE, 'display', 'block')) {
        handleKeypress(KEYPRESS[KP_MAIN])
    } else if (compareProperty(BARBARIAN_CHARACTER, STATUS, DEAD)) {
        handleKeypress(KEYPRESS[KP_CONTROLS])
    } else if (compareProperty(BARBARIAN_CHARACTER, DIRECTION, LEFT)) {
        handleKeypress(KEYPRESS[KP_STOP]);
    } else {
        handleKeypress(KEYPRESS[KP_ATTACK]);
    }
}

/**
 * Handles a swipe left event.
 * @param event the event
 */
function swipeLeftHandler(event){
    if (testCss(CONTROL_MESSAGE, 'display', 'block')) {
        handleKeypress(KEYPRESS[KP_MAIN])
    } else if (compareProperty(BARBARIAN_CHARACTER, STATUS, DEAD)) {
        handleKeypress(KEYPRESS[KP_CONTROLS])
    } else if (compareProperty(BARBARIAN_CHARACTER, DIRECTION, RIGHT)) {
        handleKeypress(KEYPRESS[KP_STOP]);
    } else {
        handleKeypress(KEYPRESS[KP_ATTACK]);
    }
}

/**
 * Set the backdrop position based on the screen number
 */
function setBackdrop() {
    setCss(BACKDROP, 'background-position', -1* SCREEN_WIDTH * screenNumber + 'px 0px');
}

/**
 * Set the viewport zoom for mobile support
 */
function setViewPort() {
    let viewportMeta = document.querySelector('meta[name="viewport"]');

    let width = $(window).width();
    let height = $(window).height();

    let scalingDimension = undefined;
    if (width > height) {
        scalingDimension = width;
    } else {
        scalingDimension = height - 50;
    }

    viewportMeta.content = viewportMeta.content.replace(/initial-scale=[^,]+/, 'initial-scale=' + (scalingDimension / 1400));

    $(window).orientationchange(function(event) {

        viewportMeta.content = viewportMeta.content.replace(/initial-scale=[^,]+/, 'initial-scale=' + (scalingDimension / 1400));
        viewportMeta.content = viewportMeta.content.replace(/width=[^,]+/, 'width=' + width);
        viewportMeta.content = viewportMeta.content.replace(/height=[^,]+/, 'height=' + height);
    });
}
