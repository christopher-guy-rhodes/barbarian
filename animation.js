/**
 * Handles the animation and fight sequences for the available actions that a sprite has (RUN, ATTACK etc).
 * @param sprite the sprite to execute the action for
 * @param action the action to execute
 * @param times the number of times to execute the action (zero for infinite)
 */
function performAction(sprite, action, times) {
    stopSpriteMovement(sprite);
    let pixelsPerSecond = getPixelsPerSecond(sprite, action);
    moveFromPositionToBoundary(sprite, action, pixelsPerSecond);
    animateSprite(sprite, action, getDirection(sprite), times)
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

    const frames = getFrames(sprite, requestedAction, getDirection(sprite));

    setAction(sprite, requestedAction);
    setDirection(sprite, requestedDirection);

    let index = 0;
    let gameOver = false;
    let counter = times;

    while (getAction(sprite) === requestedAction && getDirection(sprite) === requestedDirection && index < frames.length) {

        highlightAttackRange(sprite);

        // Delay the game over setting to allow for the barbarian to fall before the animation is stopped
        if (getLives() < 1) {
            setTimeout(function () {
                gameOver = true;
            }, 2 * getDeathDelay(sprite) * (1 / getFps(sprite, getAction(sprite))));
        }

        // If the action starts a new animation or the current one should terminate break out of the loop
        if (handleStop(sprite) ||
            isPaused() ||
            gameOver ||
            handleObstacles(sprite) ||
            !isSpriteCurrentOpponent(sprite) ||
            isDead(sprite) ||
            handleFightSequence(sprite) ||
            handleMonsterTurnaround(sprite) ||
            handleBoundary(sprite)) {
            break;
        }

        renderSpriteFrame(sprite, requestedAction, getDirection(sprite), frames[index++]);
        await sleep(MILLISECONDS_PER_SECOND / getFps(sprite, requestedAction));

        if (index === frames.length) {
            // If times is 0 we loop infinitely, if times is set decrement it and keep looping
            if (counter === 0 || --counter > 0) {
                index = 0;
            }
        }
    }

    if (isPaused() || gameOver) {
        stopSpriteMovement(sprite);
    } else if (!isWalking(sprite) && !isMonster(sprite) && getAction(sprite) === requestedAction) {
        // Action is over, reset state so the action can be executed again if desired
        setAction(sprite, undefined);
        stopSpriteMovement(sprite);
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
        return;
    }

    let x, y = undefined;
    if (action === FALL) {
        y = 0;
    } else if (isMovingRight(sprite)) {
        x = windowWidth - getWidth(sprite);
    } else {
        x = 0;
    }

    moveToPosition(sprite, x, y, pixelsPerSecond);
}

/**
 * Stops the barbarian sprite from moving and sets the position to a natural standing motion.
 * @param sprite the sprite to stop
 * @returns {boolean} true if the movement should stop, false otherwise
 */
function handleStop(sprite) {

    if (getAction(sprite) !== STOP) {
        return false;
    }

    stopSpriteMovement(sprite);
    console.log('setting render stop frame');

    // Set sprite to the fist walking frame when it stops so it is not in an awkward position
    comeToRest(sprite);
    return true;

    /*
    let x, y = undefined;
    if (getDirection(sprite) === RIGHT) {
        x = getRightStopPosition(sprite);
        y = -1 * getRightHeightStopPosition(sprite)
    } else {
        x = getLeftStopPosition(sprite) * getWidth(sprite);
        y = -1 * getLeftHeightStopPosition(sprite) * getHeight(sprite);
    }

    setSpriteBackgroundPosition(sprite, x, y);
    */
    return true;
}

function comeToRest(sprite) {
    renderSpriteFrame(sprite, WALK, getDirection(sprite), getDirection(sprite) === LEFT
        ? sprite[FRAMES][WALK][getDirection(sprite)][FRAMES].length
        : 0);
}

/**
 * Moves a sprite to a position on the plane.
 * @param sprite the sprite to move
 * @param x the x coordinate to move to
 * @param y the y coordinate to move to
 * @param pixelsPerSecond the rate at which to move
 */
function moveToPosition(sprite, x, y, pixelsPerSecond) {
    let distanceX = x === undefined ? 0 : Math.abs(x - getLeft(sprite));
    let distanceY = y === undefined ? 0 : Math.abs(y - getBottom(sprite));
    let distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
    let duration = distance / pixelsPerSecond * MILLISECONDS_PER_SECOND;

    getElement(sprite).animate({left: x + 'px', bottom: y + 'px'}, duration, 'linear');
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
    let sleepPerIteration = (ADVANCE_SCREEN_DURATION / numberOfIterations) * MILLISECONDS_PER_SECOND;

    setScrolling(true);
    const x = getDirection(sprite) === RIGHT ? 0 : windowWidth - getWidth(sprite);

    // The barbarian is travelling a distance that is shorter by his width. Adjust the pixels per second so his
    // scrolling finishes at the same time
    let adjustedPixelsPerSecond = (windowWidth - getWidth(sprite)) / ADVANCE_SCREEN_DURATION;
    moveToPosition(sprite, x, undefined, adjustedPixelsPerSecond);

    for (let i = 0; i < numberOfIterations ; i++) {
        let offset = (i + 1) * pixelsPerIteration;
        let position = direction === RIGHT ? numberOfIterations * pixelsPerIteration - offset : offset;
        setBackgroundPosition(BACKDROP, '-' + position);
        await sleep(sleepPerIteration);
    }
    setScrolling(false);
    initializeScreen();
    startMonsterAttacks();
}

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

    const isPassedLeft = getDirection(sprite) === LEFT &&
        getLeft(sprite) + getWidth(sprite) * PASSING_MULTIPLIER < getLeft(BARBARIAN_SPRITE) ||
        hitLeftBoundary(sprite);
    const isPassedRight = getDirection(sprite) === RIGHT &&
        getLeft(sprite) - getWidth(sprite) * PASSING_MULTIPLIER > getLeft(BARBARIAN_SPRITE) ||
        hitRightBoundary(sprite);

    if (isPassedLeft || isPassedRight) {
        setDirection(sprite,isPassedLeft ? RIGHT : LEFT);
        performAction(sprite, WALK, 0);
        return true;
    } else {
        return false;
    }
}

/**
 * Initializes the current screen
 */
function initializeScreen() {
    let artifacts = SCREENS[getScreenNumber()][ARTIFACTS];
    if (artifacts !== undefined) {
        for (let artifact of artifacts) {
            show(artifact);
        }
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
 * Starts the monster attacks for the monsters on the current screen. Normally the monsters need to be dead before they
 * will be started unless the game is being unpaused.
 * @param unpausing true if the function was called in the context of unpausing the game
 */
function startMonsterAttacks(unpausing = false) {
    let monsterSprites = filterBarbarianSprite(SCREENS[getScreenNumber()][OPPONENTS]);

    for (let monsterSprite of monsterSprites) {

        if ((getStatus(monsterSprite) === DEAD && !unpausing) || (getStatus(monsterSprite) === ALIVE && unpausing)) {
            showSprite(monsterSprite);
            setStatus(monsterSprite, ALIVE);
            playSound(getSound(monsterSprite));
            performAction(monsterSprite, getDefaultAction(monsterSprite), 0);
        }
    }
}

/**
 * Hides the opponents and artifacts on the current screen
 */
function hideOpponentsAndArtifacts() {
    let opponents = filterBarbarianSprite(getOpponents());
    for (let opponent of opponents) {
        hideSprite(opponent);
        hideSprite(opponent[DEATH]);
    }

    let artifacts = SCREENS[getScreenNumber()][ARTIFACTS];
    if (artifacts !== undefined) {
        for (let artifact of artifacts) {
            hide(artifact);
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
    const isRightBoundary = hitRightBoundary(sprite);
    const isLeftBoundary = hitLeftBoundary(sprite);

    if (!isLeftBoundary && !isRightBoundary) {
        return false;
    }

    if (isLeftBoundary && getScreenNumber() > 0) {
        hideOpponentsAndArtifacts();
        setScreenNumber(getScreenNumber() - 1);
        advanceBackdrop(sprite, RIGHT)
            .then(function() {}, error => handlePromiseError(error));
    } else if (isRightBoundary) {
        if (SCREENS[getScreenNumber()] !== undefined && areAllMonstersDeadOnScreen()) {
            hideOpponentsAndArtifacts();
            setScreenNumber(getScreenNumber()+1);
            if (SCREENS[getScreenNumber()] !== undefined) {
                advanceBackdrop(sprite, LEFT)
                    .then(function() {}, error => handlePromiseError(error));
            }
        }
        if (SCREENS[getScreenNumber()] === undefined) {
            show(DEMO_OVER_MESSAGE);
            setLives(0);
            setStatus(BARBARIAN_SPRITE, DEAD);
            setScreenNumber(0);
        }
    }

    comeToRest(sprite);
    setAction(sprite, STOP);
    return true;
}

/**
 * Renders a sprite frame by adjusting the vertical and horizontal background position
 * @param sprite the sprite to render a frame for
 * @param requestedAction the action used to find the proper frame
 * @param position the horizontal background position offset
 */
function renderSpriteFrame(sprite, requestedAction, direction, position) {
    const heightOffset = sprite[FRAMES][requestedAction][direction][HEIGHT_OFFSET] * getHeight(sprite);
    setSpriteBackgroundPosition(sprite, (-1*position*getWidth(sprite)), -1*heightOffset);
}

/**
 * Animate the death of a sprite
 * @param sprite the sprite to animate the death for
 * @returns {Promise<void>} a void promise
 */
async function animateDeath(sprite) {
    stopSpriteMovement(sprite);
    setLeft(sprite[DEATH], getLeft(sprite));
    setBarbarianDying(!isMonster(sprite));
    showSprite(sprite[DEATH]);

    if (isMonster(sprite)) {
        hideSprite(sprite);
    }

    let frames = getFrames(sprite[DEATH], DEATH, getDirection(sprite));
    for (let frame of frames) {
        renderSpriteFrame(sprite[DEATH], DEATH, getDirection(sprite), frame);
        await sleep(MILLISECONDS_PER_SECOND / sprite[DEATH][FRAMES][DEATH][FPS]);
    }

    setBarbarianDying(false);

    if (isMonster(sprite)) {
        hideSprite(sprite[DEATH]);
    }
}


