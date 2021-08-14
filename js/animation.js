/**
 * Handles the animation and fight sequences for the available actions that a character has (RUN, ATTACK etc).
 * @param character the character to execute the action for
 * @param action the action to execute
 * @param numberOfTimes the number of times to execute the action (zero for infinite)
 */
function performAction(character, action, numberOfTimes) {
    getProperty(character, SPRITE).stop();
    moveFromPositionToBoundary(character, action, getProperty(character, PIXELS_PER_SECOND, action));
    animateCharacter(character, action, getProperty(character, DIRECTION), numberOfTimes)
        .then(function () {
        }, error => handlePromiseError(error));
}

/**
 * Animate a character using the requested action. Stops when a different action is requested or the action has happened
 * "numberOfTimes" times. If times is set to zero the animation will not terminate unless a new action is requested.
 * @param character the character to animate
 * @param requestedAction the requested action (WALK, ATTACK etc.)
 * @param requestedDirection the requested direction (LEFT, RIGHT etc.)
 * @param numberOfTimes the number of times to perform the action (0 for infinite)
 * @returns {Promise<void>} a void promise
 */
async function animateCharacter(character, requestedAction, requestedDirection, numberOfTimes) {

    let frames = getProperty(character, FRAMES, requestedAction, getProperty(character, DIRECTION), FRAMES);

    setProperty(character, ACTION, requestedAction);
    setProperty(character, DIRECTION, requestedDirection);

    let index = 0;
    let isGameOver = false;
    let counter = numberOfTimes;

    while (compareProperty(character, ACTION, requestedAction) &&
           compareProperty(character, DIRECTION, requestedDirection) &&
           index < frames.length) {

        highlightAttackRange(character);

        // Delay the game over setting to allow for the barbarian to fall before the animation is stopped
        if (numLives < 1) {
            setTimeout(function () {
                isGameOver = true;
            },getProperty(character, DEATH, DELAY) * (1 / getProperty(character, FPS, getProperty(character, ACTION))));
        }

        // If the action starts a new animation or the current one should terminate break out of the loop
        if (handleStop(character) ||
            isPaused ||
            isGameOver ||
            handleObstacles(character) ||
            !getProperty(SCREENS, screenNumber, OPPONENTS).includes(character) ||
            compareProperty(character, STATUS, DEAD) ||
            handleFightSequence(character) ||
            handleMonsterTurnaround(character) ||
            handleBoundary(character)) {
            break;
        }

        renderSpriteFrame(character, requestedAction, getProperty(character, DIRECTION), frames[index++]);
        await sleep(MILLISECONDS_PER_SECOND / getProperty(character, FPS, requestedAction));

        if (index === frames.length) {
            // If times is 0 we loop infinitely, if times is set decrement it and keep looping
            if (counter === 0 || --counter > 0) {
                index = 0;
            }
        }
    }

    if (isPaused || isGameOver) {
        getProperty(character, SPRITE).stop();
    } else if (!compareProperty(character, ACTION, WALK) &&
               compareProperty(character, NAME, BARBARIAN_SPRITE_NAME) &&
               compareProperty(character, ACTION, requestedAction)) {
        // Action is over, reset state so the action can be executed again if desired
        setProperty(character, ACTION, undefined);
        getProperty(character, SPRITE).stop();
    }
}

/**
 * Handles trap door animation.
 * @param character the character interacting with the trap door
 */
function animateTrapDoor(character) {
    if (compareProperty(character, NAME, BARBARIAN_SPRITE_NAME)) {
        let trapDoors = getProperty(SCREENS, screenNumber, TRAP_DOORS);
        for (let trapDoor of trapDoors) {
            if (testCss(getProperty(trapDoor, ELEMENT), 'display', 'block') &&
                    getProperty(character, SPRITE).offset().left >= getProperty(trapDoor, TRIGGER, LEFT)) {
                moveToPosition(getProperty(trapDoor, ELEMENT), getProperty(trapDoor, TRIGGER, TIME), undefined, 0);

                setTimeout(function() {
                    getProperty(trapDoor, ELEMENT).css('display', 'none');
                }, getProperty(trapDoor, TRIGGER, TIME));
            }
        }
    }
}

/**
 * Moves from the current position to the boundary.
 * @param character the character to move to the boundary
 * @param action the character action
 * @param pixelsPerSecond the rate at which to move
 */
function moveFromPositionToBoundary(character, action, pixelsPerSecond) {
    if (pixelsPerSecond <= 0) {
        // If the sprite isn't moving (stop, non-moving attack etc.) to not move it to the boundary
        return;
    }

    let x, y = undefined;
    if (action === FALL) {
        y = 0;
    } else if (compareProperty(character, DIRECTION, RIGHT)) {
        x = windowWidth - getProperty(character, SPRITE).width();
    } else {
        x = 0;
    }

    moveSpriteToPosition(character, x, y, pixelsPerSecond);
}

/**
 * Stops the character from moving and sets the position to a natural standing motion.
 * @param character the character to stop
 * @returns {boolean} true if the movement should stop, false otherwise
 */
function handleStop(character) {

    if (!compareProperty(character, ACTION, STOP)) {
        return false;
    }

    getProperty(character, SPRITE).stop();
    renderAtRestFrame(character);
    return true;
}

/**
 * Renders the first "at rest" walking frame for the character.
 * @param character the sprite to render the at rest frame for
 */
function renderAtRestFrame(character) {
    let position = compareProperty(character, DIRECTION, LEFT)
        ? getProperty(character, FRAMES, WALK, getProperty(character, DIRECTION), FRAMES).length
        : 0;
    renderSpriteFrame(character, WALK, getProperty(character, DIRECTION), position);
}

/**
 * Moves a character to a position on the plane.
 * @param character the sprite to move
 * @param x the x coordinate to move to
 * @param y the y coordinate to move to
 * @param pixelsPerSecond the rate at which to move
 */
function moveSpriteToPosition(character, x, y, pixelsPerSecond) {
    let distanceX = x === undefined ? 0 : Math.abs(x - getProperty(character, SPRITE).offset().left);
    let distanceY = y === undefined ? 0 : Math.abs(y - stripPxSuffix(getProperty(character, SPRITE).css('bottom')));
    let distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
    let duration = distance / pixelsPerSecond * MILLISECONDS_PER_SECOND;

    moveToPosition(getProperty(character, SPRITE), duration, x, y);
}

/**
 * Move the element to position x, y and make the animation take duration seconds.
 * @param element the element to animate
 * @param duration the duration of the animation
 * @param x the x coordinate
 * @param y the y coordinate
 */
function moveToPosition(element, duration, x, y) {
    element.animate({left: x + 'px', bottom: y + 'px'}, duration, 'linear')
}

/**
 * Scrolls the backdrop and moves the character along with it.
 * @param character the sprite to scroll along with the background
 * @param direction the direction the screen will move
 * @returns {Promise<void>} a void promise
 */
async function advanceBackdrop(character, direction) {
    let pixelsPerIteration = ADVANCE_SCREEN_PIXELS_PER_SECOND / ADVANCE_SCREEN_PIXELS_PER_FRAME;
    let numberOfIterations = windowWidth / pixelsPerIteration;
    let sleepPerIteration = (ADVANCE_SCREEN_DURATION_SECONDS / numberOfIterations) * MILLISECONDS_PER_SECOND;

    actionsLocked = true;
    let x = getProperty(character, DIRECTION) === RIGHT ? 0 : windowWidth - getProperty(character, SPRITE).width();

    // The barbarian is travelling a distance that is shorter by his width. Adjust the pixels per second so his
    // scrolling finishes at the same time
    let adjustedPixelsPerSecond = (windowWidth - getProperty(character, SPRITE).width() /
            ADVANCE_SCREEN_DURATION_SECONDS);
    moveSpriteToPosition(character, x, undefined, adjustedPixelsPerSecond);

    for (let i = 0; i < numberOfIterations ; i++) {
        let offset = (i + 1) * pixelsPerIteration;
        let position = direction === RIGHT ? numberOfIterations * pixelsPerIteration - offset : offset;
        setCss(BACKDROP, 'background-position', -1*position + 'px');
        await sleep(sleepPerIteration);
    }
    actionsLocked = false;
    initializeScreen();
    startMonsterAttacks();
}

/**
 * Sleep for ms milliseconds.
 * @param ms the number of milliseconds to sleep
 * @returns {Promise<void>} a void promise
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Causes the monster to chase the barbarian of once the barbarian has passed the monster.
 * @param character the monster sprite
 * @returns {boolean} true if the monster has passed the sprite, false otherwise
 */
function handleMonsterTurnaround(character) {
    if (compareProperty(character, NAME, BARBARIAN_SPRITE_NAME)) {
        return false;
    }

    let isPassedLeft = getProperty(character, DIRECTION) === LEFT &&
        getProperty(character, SPRITE).offset().left + getProperty(character, SPRITE).width() * PASSING_MULTIPLIER <
                getProperty(BARBARIAN_CHARACTER, SPRITE).offset().left || hitLeftBoundary(character);
    let isPassedRight = getProperty(character, DIRECTION) === RIGHT &&
        getProperty(character, SPRITE).offset().left - getProperty(character, SPRITE).width() * PASSING_MULTIPLIER >
                getProperty(BARBARIAN_CHARACTER, SPRITE).offset().left || hitRightBoundary(character);

    if (isPassedLeft || isPassedRight) {
        setProperty(character, DIRECTION, isPassedLeft ? RIGHT : LEFT);
        performAction(character, WALK, 0);
        return true;
    } else {
        return false;
    }
}

/**
 * Starts the monster attacks for the monsters on the current screen. Normally the monsters need to be dead before they
 * will be started unless the game is being unpaused.
 * @param unpausing true if the function was called in the context of unpausing the game
 */
function startMonsterAttacks(unpausing = false) {
    let monsterSprites = filterBarbarianSprite(SCREENS[screenNumber][OPPONENTS]);

    for (let monsterSprite of monsterSprites) {

        if ((getProperty(monsterSprite, STATUS) === DEAD && !unpausing) ||
            (getProperty(monsterSprite, STATUS) === ALIVE && unpausing)) {
            setSpriteCss(monsterSprite, 'display', 'block');
            setProperty(monsterSprite, STATUS, ALIVE);
            playSound(getProperty(monsterSprite, SOUND));
            performAction(monsterSprite, getProperty(monsterSprite, RESET, ACTION), 0);
        }
    }
}

/**
 * Hides the opponents and trap doors on the current screen
 */
function hideOpponentsAndTrapDoors() {
    let opponents = filterBarbarianSprite(getOpponents());
    for (let opponent of opponents) {
        setSpriteCss(opponent, 'display', 'none');
        setSpriteCss(getProperty(opponent, DEATH), 'display', 'none');
    }

    let trapDoors = getProperty(SCREENS, screenNumber, TRAP_DOORS);
    if (trapDoors !== undefined) {
        for (let artifact of trapDoors) {
            setCss(getProperty(artifact, ELEMENT), 'display', 'none');
        }
    }
}

/**
 * Updates and scrolls the screen when the barbarian hits a screen boundary.
 * @param character the barbarian sprite
 * @returns {boolean} true if the
 */
function handleBoundary(character) {
    if (!compareProperty(character, NAME, BARBARIAN_SPRITE_NAME)) {
        return false;
    }
    let isRightBoundary = hitRightBoundary(character);
    let isLeftBoundary = hitLeftBoundary(character);

    if (!isLeftBoundary && !isRightBoundary) {
        return false;
    }

    if (isLeftBoundary && screenNumber > 0) {
        hideOpponentsAndTrapDoors();
        screenNumber = screenNumber - 1;
        advanceBackdrop(character, RIGHT)
            .then(function() {}, error => handlePromiseError(error));
    } else if (isRightBoundary) {
        if (!compareProperty(SCREENS, screenNumber, undefined) && areAllMonstersDeadOnScreen()) {
            hideOpponentsAndTrapDoors();
            screenNumber = screenNumber + 1;
            if (!compareProperty(SCREENS, screenNumber, undefined)) {
                advanceBackdrop(character, LEFT)
                    .then(function() {}, error => handlePromiseError(error));
            }
        }
        if (compareProperty(SCREENS, screenNumber, undefined)) {
            setCss(DEMO_OVER_MESSAGE, 'display', 'block');
            setProperty(BARBARIAN_CHARACTER, STATUS, DEAD);
            screenNumber = 0;
            numLives = 0;
        }
    }

    renderAtRestFrame(character);
    setProperty(character, ACTION, STOP);
    return true;
}

/**
 * Renders a character frame by adjusting the vertical and horizontal background position.
 * @param character the character to render a frame for
 * @param requestedAction the action used to find the proper frame
 * @param direction the direction the sprite is facing
 * @param position the horizontal background position offset
 */
function renderSpriteFrame(character, requestedAction, direction, position) {
    let heightOffset = getProperty(character, FRAMES, requestedAction, direction, HEIGHT_OFFSET) *
            getProperty(character, SPRITE).height();

    setSpriteCss(character, 'background-position',
        -1*position*getProperty(character, SPRITE).width() + 'px ' + -1*heightOffset + 'px');
}

/**
 * Animate the death of a character.
 * @param character the character to animate the death for
 * @returns {Promise<void>} a void promise
 */
async function animateDeath(character) {
    getProperty(character, SPRITE).stop();
    setSpriteCss(getProperty(character, DEATH), 'left', getProperty(character, SPRITE).offset().left + 'px');
    actionsLocked = compareProperty(character, NAME, BARBARIAN_SPRITE_NAME);
    setSpriteCss(character[DEATH], 'display', 'block');

    if (!compareProperty(character, NAME, BARBARIAN_SPRITE_NAME)) {
        setSpriteCss(character, 'display', 'none');
    }

    let frames = getProperty(character, DEATH, FRAMES, DEATH, getProperty(character, DIRECTION), FRAMES);
    for (let frame of frames) {
        renderSpriteFrame(character[DEATH], DEATH, getProperty(character, DIRECTION), frame);
        await sleep(MILLISECONDS_PER_SECOND / character[DEATH][FRAMES][DEATH][FPS]);
    }

    actionsLocked = false;

    if (!compareProperty(character, NAME, BARBARIAN_SPRITE_NAME)) {
        setSpriteCss(getProperty(character, DEATH), 'display', 'none');
    }
}

