/**
 * Handles the animation and fight sequences for the available actions that a character has (RUN, ATTACK etc).
 * @param character the character to execute the action for
 * @param action the action to execute
 * @param numberOfTimes the number of times to execute the action (zero for infinite)
 * @param index optional starting index (used for resuming paused games)
 */
function performAction(character, action, numberOfTimes, index = 0) {
    setProperty(character, PREVIOUS_ACTION, getProperty(character, ACTION));
    getProperty(character, SPRITE).stop();
    moveFromPositionToBoundary(character, action, getProperty(character, PIXELS_PER_SECOND, action));
    animateCharacter(character, action, getProperty(character, DIRECTION), getProperty(character, VERTICAL_DIRECTION), numberOfTimes, index)
        .then(function () {
        }, error => handlePromiseError(error));
}

/**
 * Animate a character using the requested action. Stops when a different action is requested or the action has happened
 * numberOfTimes times. If numberOfTimes is set to zero the animation will not terminate unless a new action is
 * requested.
 * @param character the character to animate
 * @param requestedAction the requested action (WALK, ATTACK etc.)
 * @param requestedDirection the requested direction (LEFT, RIGHT)
 * @param requestedVerticalDirection the requested vertical direction (UP, DOWN)
 * @param numberOfTimes the number of times to perform the action (0 for infinite)
 * @param idx optional starting index (used for resuming paused games)
 * @returns {Promise<void>} a void promise
 */
async function animateCharacter(character, requestedAction, requestedDirection, requestedVerticalDirection, numberOfTimes, idx = 0) {

    let frames = getProperty(character, FRAMES, requestedAction, getProperty(character, DIRECTION), FRAMES);

    setProperty(character, ACTION, requestedAction);

    let index = idx;
    let isGameOver = false;
    let counter = numberOfTimes;

    while (compareProperty(character, ACTION, requestedAction) &&
           compareProperty(character, DIRECTION, requestedDirection) &&
           compareProperty(character, VERTICAL_DIRECTION, requestedVerticalDirection) &&
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
            handlePaused(character, index) ||
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
               !compareProperty(character, ACTION, SWIM) &&
               compareProperty(character, NAME, BARBARIAN_SPRITE_NAME) &&
               compareProperty(character, ACTION, requestedAction)) {
        // Action is over, reset state so the action can be executed again if desired
        setProperty(character, ACTION, undefined);
        getProperty(character, SPRITE).stop();
    }
}

/**
 * Saves off the frame index if pausing and the character is the barbarian.
 * @param character the character getting paused
 * @param index the frame index to save off if pausing
 * @returns {boolean} true if the game is paused, false otherwise
 */
function handlePaused(character, index) {
    if (isPaused && compareProperty(character, NAME, BARBARIAN_SPRITE_NAME)) {
        pauseFrameIndex = index;
    }
    return isPaused;
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
    } else {

        if (compareProperty(SCREENS, screenNumber, WATER, true) && !compareProperty(character, NAME, BARBARIAN_SPRITE_NAME)) {
            let barbarianY = stripPxSuffix(getCss(getProperty(BARBARIAN_CHARACTER, SPRITE), 'bottom'));
            y = stripPxSuffix(getProperty(character, SPRITE).css('bottom'));
            if (barbarianY > y) {
                y = SCREEN_HEIGHT - getProperty(character, SPRITE).height() / 2;
            } else {
                y = SCREEN_BOTTOM;
            }
        } else if (compareProperty(character, VERTICAL_DIRECTION, UP)) {
            y = SCREEN_HEIGHT - getProperty(character, SPRITE).height() / 2;
        } else if (compareProperty(character, VERTICAL_DIRECTION, DOWN)) {
            y = SCREEN_BOTTOM;
        }

        if (compareProperty(character, DIRECTION, LEFT)) {
            x = 0;
        } else if (compareProperty(character, DIRECTION, RIGHT)) {
            x = windowWidth - getProperty(character, SPRITE).width();
        }
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
    setProperty(character, VERTICAL_DIRECTION, undefined);
    return true;
}

/**
 * Renders the first "at rest" walking frame for the character.
 * @param character the sprite to render the at rest frame for
 */
function renderAtRestFrame(character) {
    let action = compareProperty(SCREENS, screenNumber, WATER, true) ? SWIM : WALK;
    let position = compareProperty(character, DIRECTION, LEFT)
        ? getProperty(character, FRAMES, action, getProperty(character, DIRECTION), FRAMES).length - 1
        : 0;

    renderSpriteFrame(character, action, getProperty(character, DIRECTION), position);
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
    actionsLocked = true;

    await moveBackdrop(character, direction, false);
    if (compareProperty(SCREENS, screenNumber, WATER, true)) {
        // Scroll the water up
        await moveBackdrop(character, direction, true);
    }

    actionsLocked = false;
    initializeScreen();
    startMonsterAttacks();
}

/**
 * Scroll the backdrop horizontally or vertically
 * @param character the character to move along with the background
 * @param direction the direction to scroll the screen
 * @param isVertical whether the scrolling is vertical
 * @returns {Promise<void>}
 */
async function moveBackdrop(character, direction , isVertical) {
    let pixelsPerSecond = isVertical ? ADVANCE_SCREEN_VERTICAL_PIXELS_PER_SECOND : ADVANCE_SCREEN_PIXELS_PER_SECOND;
    let screenDimension = isVertical ? SCREEN_HEIGHT : SCREEN_WIDTH;

    let pixelsPerIteration = pixelsPerSecond / ADVANCE_SCREEN_PIXELS_PER_FRAME;
    let numberOfIterations = screenDimension / pixelsPerIteration;
    let sleepPerIteration = (ADVANCE_SCREEN_DURATION_SECONDS / numberOfIterations) * MILLISECONDS_PER_SECOND;

    let x, y, distance, screenOffset = undefined;
    if (isVertical) {
        y = SCREEN_HEIGHT - getProperty(character, SPRITE).height() / 2;
        distance = Math.abs(y - stripPxSuffix(getProperty(character, SPRITE).css('bottom')));
    } else {
        x = getProperty(character, DIRECTION) === RIGHT ? 0 : windowWidth - getProperty(character, SPRITE).width();
        distance = SCREEN_WIDTH - getProperty(character, SPRITE).width();
    }
    let adjustedPixelsPerSecond = distance / ADVANCE_SCREEN_DURATION_SECONDS;
    moveSpriteToPosition(character, x, y, adjustedPixelsPerSecond);

    let backgroundPosition = isVertical ? 'background-position-y' : 'background-position-x';
    let currentPosition = parseInt(stripPxSuffix(getCss(BACKDROP, backgroundPosition)));

    for (let i = 0; i < numberOfIterations; i++) {
        let offset = (i + 1) * pixelsPerIteration;
        let directionCompare = isVertical ? UP : RIGHT;
        let position = direction === directionCompare ? (currentPosition + offset) : (currentPosition - offset);

        setCss(BACKDROP, backgroundPosition,position + 'px');
        await sleep(sleepPerIteration);
    }
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

    if (compareProperty(character, RESET, TURNAROUND, false)) {
        if (hitLeftBoundary(character) || hitRightBoundary(character)) {
            setCss(getProperty(character, SPRITE), 'display', 'none');
            setProperty(character, STATUS, DEAD);
            return true;
        }
        return false;
    }


    let isPassedLeft = getProperty(character, DIRECTION) === LEFT &&
        getProperty(character, SPRITE).offset().left + getProperty(character, SPRITE).width() * PASSING_MULTIPLIER <
                getProperty(BARBARIAN_CHARACTER, SPRITE).offset().left || hitLeftBoundary(character);
    let isPassedRight = getProperty(character, DIRECTION) === RIGHT &&
        getProperty(character, SPRITE).offset().left - getProperty(character, SPRITE).width() * PASSING_MULTIPLIER >
                getProperty(BARBARIAN_CHARACTER, SPRITE).offset().left || hitRightBoundary(character);

    if ((isPassedLeft || isPassedRight) && compareProperty(character, RESET, TURNAROUND, true)) {
        setProperty(character, DIRECTION, isPassedLeft ? RIGHT : LEFT);
        performAction(character, WALK, getProperty(character, RESET, NUMBER_OF_TIMES));
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
    let monsterSprites = filterBarbarianCharacter(SCREENS[screenNumber][OPPONENTS]);

    for (let monsterSprite of monsterSprites) {

        if ((getProperty(monsterSprite, STATUS) === DEAD && !unpausing) ||
            (getProperty(monsterSprite, STATUS) === ALIVE && unpausing)) {
            setCharacterCss(monsterSprite, 'display', 'block');
            setProperty(monsterSprite, STATUS, ALIVE);
            if (!compareProperty(monsterSprite, SOUND, undefined)) {
                playSound(getProperty(monsterSprite, SOUND));
            }
            performAction(monsterSprite, getProperty(monsterSprite, RESET, ACTION), getProperty(monsterSprite, RESET, NUMBER_OF_TIMES));
        }
    }
}

/**
 * Hides the opponents and trap doors on the current screen
 */
function hideOpponentsAndTrapDoors() {
    let opponents = filterBarbarianCharacter(getOpponents());
    for (let opponent of opponents) {
        setCharacterCss(opponent, 'display', 'none');
        setCharacterCss(getProperty(opponent, DEATH), 'display', 'none');
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

    if (isLeftBoundary && compareProperty(SCREENS, screenNumber, ALLOWED_SCROLL_DIRECTIONS, LEFT, true)) {
        hideOpponentsAndTrapDoors();
        screenNumber = screenNumber - 1;
        advanceBackdrop(character, RIGHT)
            .then(function() {}, error => handlePromiseError(error));
    } else if (isRightBoundary && compareProperty(SCREENS, screenNumber, ALLOWED_SCROLL_DIRECTIONS, RIGHT, true)) {
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

    setCharacterCss(character, 'background-position',
        -1*position*getProperty(character, SPRITE).width() + 'px ' + -1*heightOffset + 'px');
}

/**
 * Animate the death of a character.
 * @param character the character to animate the death for
 * @returns {Promise<void>} a void promise
 */
async function animateDeath(character) {
    getProperty(character, SPRITE).stop();
    setCharacterCss(getProperty(character, DEATH), 'left', getProperty(character, SPRITE).offset().left + 'px');
    actionsLocked = compareProperty(character, NAME, BARBARIAN_SPRITE_NAME);
    setCharacterCss(character[DEATH], 'display', 'block');

    if (!compareProperty(character, NAME, BARBARIAN_SPRITE_NAME)) {
        setCharacterCss(character, 'display', 'none');
    }

    let frames = getProperty(character, DEATH, FRAMES, DEATH, getProperty(character, DIRECTION), FRAMES);
    for (let frame of frames) {
        renderSpriteFrame(character[DEATH], DEATH, getProperty(character, DIRECTION), frame);
        await sleep(MILLISECONDS_PER_SECOND / character[DEATH][FRAMES][DEATH][FPS]);
    }

    actionsLocked = false;

    if (!compareProperty(character, NAME, BARBARIAN_SPRITE_NAME)) {
        setCharacterCss(getProperty(character, DEATH), 'display', 'none');
    }
}

