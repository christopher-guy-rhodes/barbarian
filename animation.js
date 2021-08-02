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
            }, 2 * getDeathDelay(sprite) * (1 / getFps(sprite)));
        }

        // If the action starts a new animation or the current one should terminate break out of the loop
        if (isPaused() ||
            gameOver ||
            handleObstacles(sprite) ||
            !isSpriteCurrentOpponent(sprite) ||
            isDead(sprite) ||
            fightSequence(sprite) ||
            monsterTurnaround(sprite) ||
            handleBoundary(sprite)) {
            break;
        }

        renderSpriteFrame(sprite, requestedAction, frames[index++]);
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

async function animateFall(sprite) {
    stopSpriteMovement(sprite);
    if (!isMonster(sprite) && getLives() < 1) {
        show(GAME_OVER_MESSAGE);
    }

    if (isSound()) {
        playFallSound();
    }

    animateVerticalFall(sprite);
    const frames = getFrames(sprite, FALL, getDirection(sprite));
    for(let frame of frames) {
        renderSpriteFrame(sprite, FALL, frame);
        await sleep(MILLISECONDS_PER_SECOND / getFps(sprite, FALL));
    }
}

function animateVerticalFall(sprite) {
    let distance = parseInt(getBottom(sprite).substring(0, getBottom(sprite).length - 2));
    let duration = distance / FALLING_PIXELS_PER_SECOND * MILLISECONDS_PER_SECOND;
    moveVerticalToBoundary(sprite, DOWN, duration);
    setTimeout(function () {
        hideSprite(sprite);
        setAction(sprite, STOP);
    }, distance / FALLING_PIXELS_PER_SECOND * MILLISECONDS_PER_SECOND) ;
}

function performAction(sprite, action, times) {
    if (action === FALL) {
        fallAction(sprite);
    } else if (action === STOP) {
        stopAction(sprite);
    } else {
        stopSpriteMovement(sprite);
        if (getPixelsPerSecond(sprite, action) > 0) {
            moveFromPositionToBoundary(sprite, action);
        }
        animateSprite(sprite, action, getDirection(sprite), times)
            .then(function () {
            }, error => handlePromiseError(error));
    }
}

function fallAction(sprite) {
    stopSpriteMovement(sprite);
    setAction(sprite, FALL);
    setLives(0);
    handleDeath(sprite);
    animateFall(sprite).then(function() {}, error => handlePromiseError(error));
}

function stopAction(sprite) {
    stopSpriteMovement(sprite);
    const isRight = getDirection(sprite) === RIGHT;
    const x = -1 * (isRight ? getRightStopPosition(sprite)
                            : getLeftStopPosition(sprite)) * getWidth(sprite);
    const y = isRight ? (-1 * getRightHeightStopPosition(sprite))
        : -1 * getLeftHeightStopPosition(sprite) * getHeight(sprite);

    setSpriteBackgroundPosition(sprite, x, y);
    stopSpriteMovement(sprite);
    setAction(BARBARIAN_SPRITE, STOP);
}

function moveFromPositionToBoundary(sprite, action) {
    let pixelsPerSecond = getPixelsPerSecond(sprite, action);
    if (pixelsPerSecond === 0) {
        return;
    }
    const isRight = getDirection(sprite) === RIGHT;
    const distance = isRight ? windowWidth - getLeft(sprite) - getWidth(sprite) : getLeft(sprite);
    const duration = distance / getPixelsPerSecond(sprite, action) * MILLISECONDS_PER_SECOND;
    const x = isRight ? windowWidth - getWidth(sprite) : 0;
    moveToHorizontalPosition(sprite, x, getPixelsPerSecond(sprite, action));
}

function moveToHorizontalPosition(sprite, x, pixelsPerSecond) {
    let isRight = x > getLeft(sprite);
    let distance = Math.abs(x - getLeft(sprite));
    let duration = distance / pixelsPerSecond * MILLISECONDS_PER_SECOND;


    getElement(sprite).animate({left: x + 'px'}, duration, 'linear');
}

function moveVerticalToBoundary(sprite, direction, duration) {
    let bottom = direction === DOWN ? '0px' : '800px';
    getElement(sprite).animate({bottom: bottom}, duration,  'linear');
}

async function advanceBackdrop(sprite, direction) {
    let pixelsPerIteration = ADVANCE_SCREEN_PIXELS_PER_SECOND / ADVANCE_SCREEN_PIXELS_PER_FRAME;
    let numberOfIterations = windowWidth / pixelsPerIteration;
    let sleepPerIteration = (ADVANCE_SCREEN_DURATION / numberOfIterations) * MILLISECONDS_PER_SECOND;

    setScrolling(true);
    const x = getDirection(sprite) === RIGHT ? 0 : windowWidth - getWidth(sprite);


    // The barbarian is only travelling a shorter distance equal to his width. Adjust the pixels per second so it
    // finishes at the same time as the screen scroll
    let adjustedPixelsPerSecond = (windowWidth - getWidth(sprite)) / ADVANCE_SCREEN_DURATION;
    moveToHorizontalPosition(sprite, x, adjustedPixelsPerSecond);

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

function monsterTurnaround(sprite) {
    if (!isMonster(sprite)) {
        return false;
    }

    const isPassedLeft = getDirection(sprite) === LEFT &&
        getLeft(sprite) + getWidth(sprite) * PASSING_MULTIPLIER < getLeft(BARBARIAN_SPRITE) ||
        hitLeftBoundary(sprite);
    const isPassedRight = getDirection(sprite) === RIGHT &&
        getLeft(sprite) - getWidth(sprite) * PASSING_MULTIPLIER > getLeft(BARBARIAN_SPRITE) ||
        hitRightBoundry(sprite);

    if (isPassedLeft || isPassedRight) {
        setDirection(sprite,isPassedLeft ? RIGHT : LEFT);
        performAction(sprite, WALK, 0);
        return true;
    } else {
        return false;
    }
}

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

function handleBoundary(sprite) {
    const isRightBoundary = hitRightBoundry(sprite);
    const isLeftBoundary = hitLeftBoundary(sprite);

    if (!isLeftBoundary && !isRightBoundary) {
        return false;
    }

    if (isLeftBoundary && getScreenNumber() > 0) {
        hideOpponentsAndArtifacts();
        setScreenNumber(getScreenNumber() - 1);
        advanceBackdrop(sprite, RIGHT)
            .then(function() {}, error => handlePromiseError(error));
    }
    if (isRightBoundary && !isMonster(sprite)) {
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

    // Since we are stopping set the frame to the stop frame (1st frame when walking)
    renderSpriteFrame(sprite, WALK, 0);
    setAction(sprite, STOP);
    return true;
}

function renderSpriteFrame(sprite, requestedAction, position) {
    const heightOffsetGridUnits = sprite[FRAMES][requestedAction][sprite[DIRECTION]][HEIGHT_OFFSET];
    const heightOffset = heightOffsetGridUnits * getHeight(sprite);
    setSpriteBackgroundPosition(sprite, (-1*position*getWidth(sprite)), -1*heightOffset);
}

function renderDeathSpriteFrame(sprite, position) {
    const heightOffset = sprite[DEATH][FRAMES][DEATH][sprite[DIRECTION]][HEIGHT_OFFSET] * getHeight(sprite[DEATH]);
    setSpriteBackgroundPosition(sprite[DEATH], (-1*position*getWidth(sprite[DEATH])), -1*heightOffset);
}

function hitLeftBoundary(sprite) {
    return getDirection(sprite) === LEFT && getLeft(sprite) === 0;
}

function hitRightBoundry(sprite) {
    return getDirection(sprite) === RIGHT && getLeft(sprite) === windowWidth - getWidth(sprite);
}

async function animateBarbarianDeath(sprite) {
    stopSpriteMovement(sprite);
    setBarbarianDying(true);

    const frames = getFrames(sprite[DEATH], DEATH, getDirection(sprite));
    for (let frame of frames) {
        renderDeathSpriteFrame(sprite, frame);
        await sleep(MILLISECONDS_PER_SECOND / sprite[DEATH][FRAMES][DEATH][FPS]);
    }

    setBarbarianDying(false);
}

async function animateMonsterDeath(sprite) {
    stopSpriteMovement(sprite);
    setLeft(sprite[DEATH], getLeft(sprite));
    showSprite(sprite[DEATH]);
    hideSprite(sprite);

    const frames = getFrames(sprite[DEATH], DEATH, getDirection(sprite));
    for (let frame of frames) {
        renderDeathSpriteFrame(sprite, frame);
        await sleep(MILLISECONDS_PER_SECOND / sprite[DEATH][FRAMES][DEATH][FPS]);
    }

    hideSprite(sprite[DEATH]);
}

function isAliveOrJustDied() {
    return !isDead(BARBARIAN_SPRITE) || isJustDied();
}

function isJustDied() {
    return new Date().getTime() - getDeathTime(BARBARIAN_SPRITE) < JUST_DIED_THRESHOLD;
}





