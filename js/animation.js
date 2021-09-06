/**
 * Handles the animation and fight sequences for the available actions that a character has (RUN, ATTACK etc).
 * @param character the character to execute the action for
 * @param action the action to execute
 * @param numberOfTimes the number of times to execute the action (zero for infinite)
 * @param index optional starting index (used for resuming paused games)
 */
function performAction(character, action, numberOfTimes, index = 0) {
    character.setPreviousAction(character.getAction());
    character.getSprite().stop();
    moveFromPositionToBoundary(character, action, character.getPixelsPerSecond(action));
    animateCharacter(character, action, character.getDirection(), character.getVerticalDirection(), numberOfTimes, index)
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

    let frames = character.getFrames(requestedAction, character.getDirection());

    character.setAction(requestedAction);

    let index = idx;
    let isGameOver = false;
    let counter = numberOfTimes;

    while (character.getAction() === requestedAction &&
           character.getDirection() === requestedDirection &&
           character.getVerticalDirection() === requestedVerticalDirection &&
           index < frames.length) {

        highlightAttackRange(character);

        // Delay the game over setting to allow for the barbarian to fall before the animation is stopped
        if (numLives < 1) {
            setTimeout(function () {
                isGameOver = true;
            },character.getDeathDelay() * (1 / character.getFramesPerSecond(character.getAction())));
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

        renderSpriteFrame(character, requestedAction, character.getDirection(), frames[index++]);
        await sleep(MILLISECONDS_PER_SECOND / character.getFramesPerSecond(requestedAction));

        if (index === frames.length) {
            // If times is 0 we loop infinitely, if times is set decrement it and keep looping
            if (counter === 0 || --counter > 0) {
                index = 0;
            }
        }
    }

    if (isPaused || isGameOver) {
        character.getSprite().stop();
    } else if (character.getAction() !== WALK &&
               character.getAction() !== SWIM &&
               character.getName() === BARBARIAN_SPRITE_NAME &&
               character.getAction() === requestedAction) {
        // Action is over, reset state so the action can be executed again if desired
        setProperty(character, ACTION, undefined);
        character.getSprite().stop();
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
                    character.getSprite().offset().left >= getProperty(trapDoor, TRIGGER, LEFT)) {
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
        y = -500;
    } else {

        if (compareProperty(SCREENS, screenNumber, WATER, true) && character.getName() !== BARBARIAN_SPRITE_NAME) {
            // Make water creates chase the barbarian in 2 dimensions
            let barbarianY = stripPxSuffix(getCss(BARBARIAN_CHARACTER.getSprite(), 'bottom'));
            y = stripPxSuffix(character.getSprite().css('bottom'));
            if (barbarianY > y) {
                y = SCREEN_HEIGHT - character.getSprite().height() / 2;
            } else {
                y = SCREEN_BOTTOM;
            }
        } else if (character.getVerticalDirection() === UP) {
            y = SCREEN_HEIGHT - character.getSprite().height() / 2;
        } else if (character.getVerticalDirection() === DOWN) {
            y = SCREEN_BOTTOM;
        }

        if (character.getDirection() === LEFT) {
            x = 0;
        } else if (character.getDirection() === RIGHT) {
            x = windowWidth - character.getSprite().width();
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

    if (character.getAction() !== STOP) {
        return false;
    }

    character.getSprite().stop();
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
    let position = character.getDirection() === LEFT
        ? character.getFrames(action, character.getDirection()).length
        : 0;

    renderSpriteFrame(character, action, character.getDirection(), position);
}

/**
 * Moves a character to a position on the plane.
 * @param character the sprite to move
 * @param x the x coordinate to move to
 * @param y the y coordinate to move to
 * @param pixelsPerSecond the rate at which to move
 */
function moveSpriteToPosition(character, x, y, pixelsPerSecond) {
    let distanceX = x === undefined ? 0 : Math.abs(x - character.getSprite().offset().left);
    let distanceY = y === undefined ? 0 : Math.abs(y - stripPxSuffix(character.getSprite().css('bottom')));
    let distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
    let duration = distance / pixelsPerSecond * MILLISECONDS_PER_SECOND;

    moveToPosition(character.getSprite(), duration, x, y);
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
        y = SCREEN_HEIGHT - character.getSprite().height() / 2;
        distance = Math.abs(y - stripPxSuffix(character.getSprite().css('bottom')));
    } else {
        x = getProperty(character, DIRECTION) === RIGHT ? 0 : windowWidth - character.getSprite().width();
        distance = SCREEN_WIDTH - character.getSprite().width();
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
    if (character.getName() === BARBARIAN_SPRITE_NAME) {
        return false;
    }

    if (!character.getResetTurnaround()) {
        if (hitLeftBoundary(character) || hitRightBoundary(character)) {
            setCss(character.getSprite(), 'display', 'none');
            return true;
        }
        return false;
    }


    let isPassedLeft = character.getDirection() === LEFT &&
        character.getSprite().offset().left + character.getSprite().width() * PASSING_MULTIPLIER <
                BARBARIAN_CHARACTER.getSprite().offset().left || hitLeftBoundary(character);
    let isPassedRight = character.getDirection() === RIGHT &&
        character.getSprite().offset().left - character.getSprite().width() * PASSING_MULTIPLIER >
                BARBARIAN_CHARACTER.getSprite().offset().left || hitRightBoundary(character);

    if ((isPassedLeft || isPassedRight) && character.getResetTurnaround()) {
        character.setDirection(isPassedLeft ? RIGHT : LEFT);
        performAction(character, WALK, character.getResetNumberOfTimes());
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
    let monsterCharacters = filterBarbarianCharacter(SCREENS[screenNumber][OPPONENTS]);

    for (let monsterCharacter of monsterCharacters) {

        if ((monsterCharacter.getStatus() === DEAD && !unpausing) ||
            (monsterCharacter.getStatus() === ALIVE && unpausing)) {
            setCharacterCss(monsterCharacter, 'display', 'block');
            monsterCharacter.setStatus(ALIVE);
            if (monsterCharacter.getSound() !== undefined) {
                playSound(monsterCharacter.getSound());
            }
            performAction(monsterCharacter, monsterCharacter.getResetAction(), monsterCharacter.getResetNumberOfTimes());
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
        setCss(opponent.getDeathSprite(), 'display', 'none');
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
    if (character.getName() !== BARBARIAN_SPRITE_NAME) {
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
        if (!compareProperty(SCREENS, screenNumber, undefined) && areAllMonstersDefeated()) {
            hideOpponentsAndTrapDoors();
            screenNumber = screenNumber + 1;
            if (!compareProperty(SCREENS, screenNumber, undefined)) {
                advanceBackdrop(character, LEFT)
                    .then(function() {}, error => handlePromiseError(error));
            }
        }
        if (compareProperty(SCREENS, screenNumber, undefined)) {
            setCss(DEMO_OVER_MESSAGE, 'display', 'block');
            setProperty(character, STATUS, DEAD);
            screenNumber = 0;
            numLives = 0;
        }
    }

    if (numLives !== 0) {
        // Don't render at rest frame if the game has ended since the screen number context to set it appropriately
        // is no longer set. For example if the game ends while swimming we don't want to render a walking frame.
        renderAtRestFrame(character);
    }
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
    let heightOffset = character.getHeightOffset(requestedAction, direction) * character.getSprite().height();

    setCharacterCss(character, 'background-position',
        -1*position*character.getSprite().width() + 'px ' + -1*heightOffset + 'px');
}

/**
 * Animate the death of a character.
 * @param character the character to animate the death for
 * @returns {Promise<void>} a void promise
 */
async function animateDeath(character) {
    character.getSprite().stop();
    character.getDeathSprite().css('left', character.getSprite().offset().left + 'px');
    actionsLocked = character.getName() === BARBARIAN_SPRITE_NAME;
    character.getDeathSprite().css('display', 'block');

    if (character.getName() !== BARBARIAN_SPRITE_NAME) {
        character.getSprite().css('display', 'none');
    }

    let frames = character.getDeathFrames(character.getDirection());
    let heightOffset = character.getDeathSpriteHeightOffset(character.getDirection()) * character.getSprite().height();
    for (let frame of frames) {
        //renderSpriteFrame(character[DEATH], DEATH, getProperty(character, DIRECTION), frame);

        setCss(character.getDeathSprite(), 'background-position',
            -1*frame*character.getSprite().width() + 'px ' + -1*heightOffset + 'px');

        await sleep(MILLISECONDS_PER_SECOND / character.getDeathFramesPerSecond());
    }

    actionsLocked = false;

    if (!compareProperty(character, NAME, BARBARIAN_SPRITE_NAME)) {
        setCss(character.getDeathSprite(), 'display', 'none');
    }
}

