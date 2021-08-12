/**
 * Handles the animation and fight sequences for the available actions that a sprite has (RUN, ATTACK etc).
 * @param sprite the sprite to execute the action for
 * @param action the action to execute
 * @param times the number of times to execute the action (zero for infinite)
 */
function performAction(sprite, action, times) {
    getProperty(sprite, SPRITE).stop();
    moveFromPositionToBoundary(sprite, action, getProperty(sprite, PIXELS_PER_SECOND, action));
    animateSprite(sprite, action, getProperty(sprite, DIRECTION), times)
        .then(function () {
        }, error => handlePromiseError(error));
}

/**
 * Animate a sprite using the requested action. Stops when a different action is requested of the action has happened
 * "times" times. If times is set to zero the animation will not terminate unless a new action is requested.
 * @param sprite the sprite to animate
 * @param requestedAction the requested action (WALK, ATTACK etc.)
 * @param requestedDirection the requested direction (LEFT, RIGHT etc.)
 * @param times the number of times to perform the action (0 for infinite)
 * @returns {Promise<void>} a void promise
 */
async function animateSprite(sprite, requestedAction, requestedDirection, times) {

    let frames = getProperty(sprite, FRAMES, requestedAction, getProperty(sprite, DIRECTION), FRAMES);

    setProperty(sprite, ACTION, requestedAction);
    setProperty(sprite, DIRECTION, requestedDirection);

    let index = 0;
    let gameOver = false;
    let counter = times;

    while (compareProperty(sprite, ACTION, requestedAction) &&
           compareProperty(sprite, DIRECTION, requestedDirection) &&
           index < frames.length) {

        highlightAttackRange(sprite);

        // Delay the game over setting to allow for the barbarian to fall before the animation is stopped
        if (lives < 1) {
            setTimeout(function () {
                gameOver = true;
            }, getProperty(sprite, DEATH, DELAY) * (1 / getProperty(sprite, FPS, getProperty(sprite, ACTION))));
        }

        // If the action starts a new animation or the current one should terminate break out of the loop
        if (handleStop(sprite) ||
            pause ||
            gameOver ||
            handleObstacles(sprite) ||
            !isSpriteCurrentOpponent(sprite) ||
            compareProperty(sprite, STATUS, DEAD) ||
            handleFightSequence(sprite) ||
            handleMonsterTurnaround(sprite) ||
            handleBoundary(sprite)) {
            break;
        }

        renderSpriteFrame(sprite, requestedAction, getProperty(sprite, DIRECTION), frames[index++]);
        await sleep(MILLISECONDS_PER_SECOND / getProperty(sprite, FPS, requestedAction));

        if (index === frames.length) {
            // If times is 0 we loop infinitely, if times is set decrement it and keep looping
            if (counter === 0 || --counter > 0) {
                index = 0;
            }
        }
    }

    if (pause || gameOver) {
        getProperty(sprite, SPRITE).stop();
    } else if (!compareProperty(sprite, ACTION, WALK) &&
               !isMonster(sprite) &&
               compareProperty(sprite, ACTION, requestedAction)) {
        // Action is over, reset state so the action can be executed again if desired
        setProperty(sprite, ACTION, undefined);
        getProperty(sprite, SPRITE).stop();
    }
}

/**
 * Handles trap door animation.
 * @param sprite
 */
function animateTrapDoor(sprite) {
    if (!isMonster(sprite)) {
        let trapDoors = getProperty(SCREENS, screenNumber, TRAP_DOORS);
        for (let trapDoor of trapDoors) {
            if (testCss(getProperty(trapDoor, ELEMENT), 'display', 'block') &&
                    getSpriteLeft(sprite) >= getProperty(trapDoor, TRIGGER, LEFT)) {
                moveToPosition(getProperty(trapDoor, ELEMENT), getProperty(trapDoor, TRIGGER, TIME), undefined, 0);

                setTimeout(function() {
                    getProperty(trapDoor, ELEMENT).css('display', 'none');
                }, getProperty(trapDoor, TRIGGER, TIME));
            }
        }
    }
}

/**
 * Moves from the current position to the boundary
 * @param sprite the sprite to move to the boundary
 * @param action the sprite action
 * @param pixelsPerSecond the rate at which to move
 */
function moveFromPositionToBoundary(sprite, action, pixelsPerSecond) {
    if (pixelsPerSecond <= 0) {
        // If the sprite isn't moving (stop, non-moving attack etc.) to not move it to the boundary
        return;
    }

    let x, y = undefined;
    if (action === FALL) {
        y = 0;
    } else if (compareProperty(sprite, DIRECTION, RIGHT)) {
        x = windowWidth - getSpriteWidth(sprite);
    } else {
        x = 0;
    }

    moveSpriteToPosition(sprite, x, y, pixelsPerSecond);
}

/**
 * Stops the barbarian sprite from moving and sets the position to a natural standing motion.
 * @param sprite the sprite to stop
 * @returns {boolean} true if the movement should stop, false otherwise
 */
function handleStop(sprite) {

    if (getProperty(sprite, ACTION) !== STOP) {
        return false;
    }

    getProperty(sprite, SPRITE).stop();
    renderAtRestFrame(sprite);
    return true;
}

/**
 * Renders the first "at rest" walking frame for the sprite.
 * @param sprite the sprite to render the at rest frme for
 */
function renderAtRestFrame(sprite) {
    let position = getProperty(sprite, DIRECTION) === LEFT
        ? sprite[FRAMES][WALK][getProperty(sprite, DIRECTION)][FRAMES].length
        : 0;
    renderSpriteFrame(sprite, WALK, getProperty(sprite, DIRECTION), position);
}

/**
 * Moves a sprite to a position on the plane.
 * @param sprite the sprite to move
 * @param x the x coordinate to move to
 * @param y the y coordinate to move to
 * @param pixelsPerSecond the rate at which to move
 */
function moveSpriteToPosition(sprite, x, y, pixelsPerSecond) {
    let distanceX = x === undefined ? 0 : Math.abs(x - getSpriteLeft(sprite));
    let distanceY = y === undefined ? 0 : Math.abs(y - getSpriteBottom(sprite));
    let distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
    let duration = distance / pixelsPerSecond * MILLISECONDS_PER_SECOND;

    moveToPosition(getProperty(sprite, SPRITE), duration, x, y);
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
 * Scrolls the backdrop and moves the sprite along with it
 * @param sprite the sprite to scroll along with the background
 * @param direction the direction the screen will move
 * @returns {Promise<void>} a void promise
 */
async function advanceBackdrop(sprite, direction) {
    let pixelsPerIteration = ADVANCE_SCREEN_PIXELS_PER_SECOND / ADVANCE_SCREEN_PIXELS_PER_FRAME;
    let numberOfIterations = windowWidth / pixelsPerIteration;
    let sleepPerIteration = (ADVANCE_SCREEN_DURATION_SECONDS / numberOfIterations) * MILLISECONDS_PER_SECOND;

    actionsLocked = true;
    let x = getProperty(sprite, DIRECTION) === RIGHT ? 0 : windowWidth - getSpriteWidth(sprite);

    // The barbarian is travelling a distance that is shorter by his width. Adjust the pixels per second so his
    // scrolling finishes at the same time
    let adjustedPixelsPerSecond = (windowWidth - getSpriteWidth(sprite)) / ADVANCE_SCREEN_DURATION_SECONDS;
    moveSpriteToPosition(sprite, x, undefined, adjustedPixelsPerSecond);

    for (let i = 0; i < numberOfIterations ; i++) {
        let offset = (i + 1) * pixelsPerIteration;
        let position = direction === RIGHT ? numberOfIterations * pixelsPerIteration - offset : offset;
        //setBackdropPosition(-1 * position);
        setCss(BACKDROP, 'background-position', -1*position + 'px');
        await sleep(sleepPerIteration);
    }
    actionsLocked = false;
    initializeScreen();
    startMonsterAttacks();
}

/**
 * Sleep for ms milliseconds
 * @param ms the number of milliseconds to sleep
 * @returns {Promise<void>} a void promise
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Causes the monster to chase the barbarian of once the barbarian has passed the monster.
 * @param sprite the monster sprite
 * @returns {boolean} true if the monster has passed the sprite, false otherwise
 */
function handleMonsterTurnaround(sprite) {
    if (!isMonster(sprite)) {
        return false;
    }

    let isPassedLeft = getProperty(sprite, DIRECTION) === LEFT &&
        getSpriteLeft(sprite) + getSpriteWidth(sprite) * PASSING_MULTIPLIER < getSpriteLeft(BARBARIAN_SPRITE) ||
        hitLeftBoundary(sprite);
    let isPassedRight = getProperty(sprite, DIRECTION) === RIGHT &&
        getSpriteLeft(sprite) - getSpriteWidth(sprite) * PASSING_MULTIPLIER > getSpriteLeft(BARBARIAN_SPRITE) ||
        hitRightBoundary(sprite);

    if (isPassedLeft || isPassedRight) {
        setProperty(sprite, DIRECTION, isPassedLeft ? RIGHT : LEFT);
        performAction(sprite, WALK, 0);
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
        hideSprite(opponent);
        hideSprite(opponent[DEATH]);
    }

    let trapDoors = SCREENS[screenNumber][TRAP_DOORS];
    if (trapDoors !== undefined) {
        for (let artifact of trapDoors) {
            hide(artifact[ELEMENT]);
        }
    }
}

/**
 * Updates and scrolls the screen when the barbarian hits a screen boundary.
 * @param sprite the barbarian sprite
 * @returns {boolean} true if the
 */
function handleBoundary(sprite) {
    if (isMonster(sprite)) {
        return false;
    }
    let isRightBoundary = hitRightBoundary(sprite);
    let isLeftBoundary = hitLeftBoundary(sprite);

    if (!isLeftBoundary && !isRightBoundary) {
        return false;
    }

    if (isLeftBoundary && screenNumber > 0) {
        hideOpponentsAndTrapDoors();
        screenNumber = screenNumber - 1;
        advanceBackdrop(sprite, RIGHT)
            .then(function() {}, error => handlePromiseError(error));
    } else if (isRightBoundary) {
        if (SCREENS[screenNumber] !== undefined && areAllMonstersDeadOnScreen()) {
            hideOpponentsAndTrapDoors();
            screenNumber = screenNumber + 1;
            if (SCREENS[screenNumber] !== undefined) {
                advanceBackdrop(sprite, LEFT)
                    .then(function() {}, error => handlePromiseError(error));
            }
        }
        if (SCREENS[screenNumber] === undefined) {
            show(DEMO_OVER_MESSAGE);
            lives = 0;
            setProperty(BARBARIAN_SPRITE, STATUS, DEAD);
            screenNumber = 0;
        }
    }

    renderAtRestFrame(sprite);
    setProperty(sprite, ACTION, STOP);
    return true;
}

/**
 * Renders a sprite frame by adjusting the vertical and horizontal background position
 * @param sprite the sprite to render a frame for
 * @param requestedAction the action used to find the proper frame
 * @param direction the direction the sprite is facing
 * @param position the horizontal background position offset
 */
function renderSpriteFrame(sprite, requestedAction, direction, position) {
    let heightOffset = sprite[FRAMES][requestedAction][direction][HEIGHT_OFFSET] * getSpriteHeight(sprite);
    setSpriteCss(sprite, 'background-position',
        -1*position*getSpriteWidth(sprite) + 'px ' + -1*heightOffset + 'px');
}

/**
 * Animate the death of a sprite
 * @param sprite the sprite to animate the death for
 * @returns {Promise<void>} a void promise
 */
async function animateDeath(sprite) {
    getProperty(sprite, SPRITE).stop();
    setSpriteLeft(sprite[DEATH], getSpriteLeft(sprite));
    actionsLocked = !isMonster(sprite);
    setSpriteCss(sprite[DEATH], 'display', 'block');

    if (isMonster(sprite)) {
        hideSprite(sprite);
    }

    let frames = getProperty(sprite, DEATH, FRAMES, DEATH, getProperty(sprite, DIRECTION), FRAMES);
    for (let frame of frames) {
        renderSpriteFrame(sprite[DEATH], DEATH, getProperty(sprite, DIRECTION), frame);
        await sleep(MILLISECONDS_PER_SECOND / sprite[DEATH][FRAMES][DEATH][FPS]);
    }

    actionsLocked = false;

    if (isMonster(sprite)) {
        hideSprite(sprite[DEATH]);
    }
}

