/**
 * Resets the game after a barbarian death or the game is completed.
 */
function resetGame() {
    game.renderAtRestFrame(game.getBarbarian());

    if (numLives < 1) {
        resetGameOver();
    } else {
        resetGameContinue();
    }
    resetSpritePositions();
    initializeScreen();
}

/**
 * Resets settings after game is over.
 */
function resetGameOver() {
    numLives = 3;
    game.getBarbarian().setScreenNumber(0);
    game.getBarbarian().setDirection(RIGHT);
    game.getBarbarian().setAction(undefined);
    game.getBarbarian().setVerticalDirection(undefined);
    game.renderAtRestFrame(game.getBarbarian());
    setCss(BACKDROP, 'background-position', '0px 0px');

    for (opponent of filterBarbarianCharacter(GAME_BOARD.getAllOpponents())) {
        if (opponent.isBarbarian()) {
            console.log('====> something wrong');
        }
        opponent.getSprite().css('display', 'none');
    }

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
    let characters = new Array(game.getBarbarian());
    for (let scrNum of GAME_BOARD.getScreenNumbers()) {
        //let screen = SCREENS[scrNum];
        for (let opponent of game.getMonstersOnScreen()) {
            characters.push(opponent);
        }
    }

    game.showBarbarian();


    let spritesOnScreen = game.getOpponentsOnScreen();
    for (const character of characters) {
        let isSpriteOnScreen = $.inArray(character, spritesOnScreen) !== -1;
        character.setAction(character.getResetAction());
        character.setDirection(character.getResetDirection());
        character.setStatus(character.getResetStatus());
        setCharacterCss(character, 'display', isSpriteOnScreen ? 'block' : 'none');
        setCharacterCss(character, 'left',  character.getResetLeft() + 'px');
        setCharacterCss(character, 'bottom', character.getResetBottom(game.getBarbarian().getScreenNumber()) + 'px');
    }
}

/**
 * Initializes the current screen
 */
function initializeScreen() {

    //performAction(BARBARIAN_CHARACTER, STOP, 1);

    if (game.isWater()) {
        game.performAction(game.getBarbarian(), SWIM);
    }

    let monsterSprites = game.getMonstersOnScreen();

    for (let monsterSprite of monsterSprites) {
        setCharacterCss(monsterSprite, 'left', monsterSprite.getResetLeft() + 'px');
        setCharacterCss(monsterSprite, 'bottom', monsterSprite.getResetBottom(game.getScreenNumber()) + 'px');
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
    if (game.isBarbarianDead()) {
        resetGame();
        hideAllMessages();
        game.startMonsterAttacks();
        game.performAction(game.getBarbarian(), STOP);
        game.renderAtRestFrame(game.getBarbarian());
    }
}

/**
 * Handles the pause keypress event ("p" key).
 */
function handlePauseKeypress() {

    if (!game.isBarbarianDead()) {
        if (game.getIsPaused()) {
            setCss(PAUSE_MESSAGE, 'display', 'none');
            game.setIsPaused(false);
            if (game.isBarbarianActionDefined()) {
                let action = game.getBarbarian().getAction();
                game.performAction(game.getBarbarian(), action, game.getPausedFrame());
                game.setPauseFrame(0);
            }
            game.startMonsterAttacks(true);
            game.setSoundsPauseState(false);
        } else {
            setCss(PAUSE_MESSAGE, 'display', 'block');
            game.setIsPaused(true);
            game.setSoundsPauseState(true);
        }
    }
}


/**
 * Handles the sound keypress event ("x" key).
 */
function handleSoundKeypress() {
    setCss(HINTS_ON_MESSAGE, 'display', 'none');
    setCss(HINTS_OFF_MESSAGE, 'display', 'none');

    setCss(game.getIsSoundOn() ? SOUND_ON_MESSAGE : SOUND_OFF_MESSAGE, 'display', 'none');
    setCss(game.getIsSoundOn() ? SOUND_OFF_MESSAGE : SOUND_ON_MESSAGE, 'display', 'block');
    game.setIsSoundOn(!game.getIsSoundOn());

    if (game.getIsSoundOn()) {
        game.playThemeSong();
    } else {
        game.stopAllSounds();
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
    if (!game.isBarbarianSwimming() &&
        !game.isBarbarianRunning() &&
        isBarbarianAliveOrJustDied()) {
        game.performAction(game.getBarbarian(), RUN);
    }
}

/**
 * Handles the jump keypress event ("j" key).
 */
function handleJumpKeypress() {
    if (!game.isBarbarianSwimming() && !game.isBarbarianJumping() && isBarbarianAliveOrJustDied()) {
        game.performAction(game.getBarbarian(), JUMP);
    }
}

/**
 * Handles the stop keypress event ("s" key).
 */
function handleStopKeypress() {
    if (!game.isBarbarianSwimming() && isBarbarianAliveOrJustDied()) {
        game.performAction(game.getBarbarian(), STOP);
        game.stopBarbarianMovement();
        game.renderAtRestFrame(game.getBarbarian());
        game.getBarbarian().setVerticalDirection(undefined);
    }
}

/**
 * Handles the move right keypress event (right arrow key).
 */
function handleRightKeypress() {
    let action = game.isWater() ? SWIM : WALK;
    if ((game.getBarbarian().getAction() !== action || !game.isBarbarianMovingRight())
        && isBarbarianAliveOrJustDied()) {
        game.getBarbarian().setDirection(RIGHT);
        game.performAction(game.getBarbarian(), action);
    }
}

/**
 * Handles the move right keypress event (left arrow key).
 */
function handleLeftKeypress() {
    let action = game.isWater() ? SWIM : WALK;
    if ((game.getBarbarian().getAction() !== action || !game.isBarbarianMovingLeft())
        && isBarbarianAliveOrJustDied()) {
        game.getBarbarian().setDirection(LEFT);
        game.performAction(game.getBarbarian(), action);
    }
}


/**
 * Handles the up keypress event (up arrow key);
 */
function handleUpKeypress() {
    if (!game.isBarbarianDead()) {
        if (!game.isBarbarianSwimming() || !game.isBarbarianMovingUp()) {
            if (game.isWater()) {
                game.getBarbarian().setVerticalDirection(UP);
                game.performAction(game.getBarbarian(), SWIM);
            }
        }
    }
}

/**
 * Handles the down keypress event (down arrow key);
 */
function handleDownKeypress() {
    if (!game.isBarbarianDead()) {
        if (!game.isBarbarianSwimming() || !game.isBarbarianMovingDown()) {
            if (game.isWater()) {
                game.getBarbarian().setVerticalDirection(DOWN);
                game.performAction(game.getBarbarian(), SWIM);
            }
        }
    }
}



/**
 * Handles the attack keypress event ("a" key).
 */
function handleAttackKeypress() {
    if (!game.isBarbarianSwimming() && isBarbarianAliveOrJustDied()) {
        game.stopBarbarianMovement();
        game.playGruntSound();
        game.performAction(game.getBarbarian(), ATTACK);
    }
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
    return !game.isBarbarianDead() || isBarbarianJustDied();
}

/**
 * Determines if the barbarian has just died.
 * @returns {boolean} true if the barbarian has just died, false otherwise.
 */
function isBarbarianJustDied() {
    return new Date().getTime() - game.getBarbarian().getDeathTime() < JUST_DIED_THRESHOLD;
}

/**
 * Handle keypress events and dispatch to appropriate handlers
 * @param keypress the ASCII key code
 */
function handleKeypress(keypress) {
    game.playThemeSong();

    keypressTime = new Date().getTime();

    if (!shouldThrottle(lastKeypressTime) && !game.getActionsLocked()) {
        lastKeypressTime = keypressTime;
        keypressTime = new Date().getTime();

        if (!game.getIsPaused() || compareProperty(KEYPRESS, KP_PAUSE, keypress)) {

            switch (keypress) {
                case getProperty(KEYPRESS, KP_CONTROLS):
                    if(game.isBarbarianDead()) {
                        showMessage(CONTROL_MESSAGE);
                    }
                    break;
                case getProperty(KEYPRESS, KP_MAIN):
                    if(game.isBarbarianDead()) {
                        showMessage(START_MESSAGE);
                    }
                    break;
                case getProperty(KEYPRESS, KP_SPACE):
                    handleSpaceKeypress();
                    break;
                case getProperty(KEYPRESS, KP_PAUSE):
                    handlePauseKeypress();
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
    if (game.isBarbarianDead()) {
        handleKeypress(KEYPRESS[KP_SPACE]);
    }
    let bottomOfBarbarian = game.getBarbarian().getY();
    let topOfBarbarian = game.getBarbarian().getHeight()/2 + bottomOfBarbarian;
    let barbarianLeft =  game.getBarbarian().getWidth()/2 + game.getBarbarian().getX();
    let pageX = event.originalEvent.pageX;
    let clickY = SCREEN_HEIGHT - event.originalEvent.pageY;


    if (game.isWater()) {
        if (clickY > topOfBarbarian + 100) {
            handleKeypress(KEYPRESS[KP_UP]);
            return;
        } else if (clickY < bottomOfBarbarian - 100) {
            handleKeypress(KEYPRESS[KP_DOWN]);
            return;
        }
    }

    if (!game.isWater() &&  clickY > 600) {
        handleKeypress(KEYPRESS[KP_JUMP]);
    } else {
        let changingDirection = game.getBarbarian().isDirectionRight() && pageX < barbarianLeft ||
            game.getBarbarian().isDirectionLeft() && pageX > barbarianLeft;
        if (game.getBarbarian().isWalking() && !changingDirection) {
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
    } else if (game.isBarbarianDead()) {
        handleKeypress(KEYPRESS[KP_CONTROLS])
    } else if (game.isBarbarianMovingLeft()) {
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
    } else if (game.isBarbarianDead()) {
        handleKeypress(KEYPRESS[KP_CONTROLS])
    } else if (game.isBarbarianMovingRight()) {
        handleKeypress(KEYPRESS[KP_STOP]);
    } else {
        handleKeypress(KEYPRESS[KP_ATTACK]);
    }
}

/**
 * Set the backdrop position based on the screen number
 */
function setBackdrop() {
    setCss(BACKDROP, 'background-position', -1* SCREEN_WIDTH * game.getScreenNumber() + 'px 0px');
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
