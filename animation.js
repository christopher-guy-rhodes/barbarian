async function animateSprite(sprite, requestedAction, requestedDirection, times) {

    const path = sprite[FRAMES][requestedAction][sprite[DIRECTION]][FRAMES];

    setAction(sprite, requestedAction);
    setDirection(sprite, requestedDirection);

    let index = 0;
    let gameOver = false;

    while (getAction(sprite) === requestedAction && getDirection(sprite) === requestedDirection && index < path.length) {

        highlightAttackRange(sprite, SCREENS[screenNumber][OPPONENTS]);


        // Delay the game over setting to allow for the barbarian to fall before the animation is stopped
        if (getLives() < 1) {
            setTimeout(function () {
                gameOver = true;
            }, 2 * BARBARIAN_SPRITE[DEATH][DELAY] * (1 / sprite[FPS]));
        }

        // If the action starts a new animation or the current one should terminate break out of the loop
        if (isPaused() ||
            gameOver ||
            handleObstacles(sprite, getObstacles(sprite)) ||
            !isSpriteCurrentOpponent(sprite) ||
            isDead(sprite) ||
            fightSequence(sprite, SCREENS[screenNumber][OPPONENTS]) ||
            monsterTurnaround(sprite, SCREENS[screenNumber][OPPONENTS]) ||
            handleBoundry(sprite)) {
            break;
        }

        renderSpriteFrame(sprite, requestedAction, path[index++]);
        await sleep(MILLISECONDS_PER_SECOND / sprite[FPS]);

        if (index == path.length) {
            // If times is 0 we loop infinitely, if times is set decrement it and keep looping
            if (times === 0 || --times > 0) {
                index = 0;
            }
        }
    }

    if (isPaused() || gameOver) {
        stopSpriteMovement(sprite[SPRITE]);
    } else if (getAction(sprite) != WALK && !isMonster(sprite) && getAction(sprite) === requestedAction) {
        // Action is over, reset state so the action can be executed again if desired
        setAction(sprite, undefined);
        stopSpriteMovement(sprite[SPRITE]);
    }

}

function highlightAttackRange(sprite, opponents) {
    if (!isHints()) {
        return;
    }
    if (!isMonster(sprite)) {
        for (const opponent of opponents) {
            if (!isMonster(opponent)) {
                continue;
            }

            const thresholds = opponent[BARBARIAN_ATTACK_THRESHOLDS];

            const sprite_left = sprite[SPRITE].offset().left;
            const opponent_left = opponent[SPRITE].offset().left;
            const distance = Math.abs(sprite_left - opponent_left);

            if (!isDead(sprite) && (distance >= thresholds[MIN] - HIGHLIGHT_BUFFER) && (distance <= thresholds[MAX] + HIGHLIGHT_BUFFER)) {
                highlight(opponent[SPRITE]);
            } else {
                unhighlight(opponent[SPRITE]);
            }
        }
    }
}

function actionHelper(sprite, requestedAction, times) {
    stopSpriteMovement(sprite[SPRITE]);

    if (requestedAction === STOP) {
        setCurrentPixelsPerSecond(sprite, 0);
        stop(sprite);
        return;
    } else if (requestedAction === FALL) {
        setAction(sprite, FALL);
        stop(sprite);
        animateFall(sprite);
        return;
    } else if ((requestedAction === ATTACK && !hasMovingAttack(sprite))) {
        setCurrentPixelsPerSecond(sprite, 0);
    } else if (requestedAction === RUN) {
        setCurrentPixelsPerSecond(sprite,getPixelsPerSecond(sprite) * RUN_SPEED_INCREASE_FACTOR);
    } else {
        setCurrentPixelsPerSecond(sprite, getPixelsPerSecond(sprite));
    }

    if (requestedAction !== SIT && (requestedAction !== ATTACK || hasMovingAttack(sprite))) {
        move(sprite, requestedAction);
    }

    animateSprite(sprite,
        requestedAction,
        sprite[DIRECTION] === RIGHT ? RIGHT : LEFT,
        times);
}

async function advanceBackdrop(sprite, reverse = false) {
    const sleepPerIterationDuration = (ADVANCE_SCREEN_SCROLL_DURATION / ADVANCE_SCREEN_PIXELS_PER_SECOND) * ADVANCE_SCREEN_PIXELS_PER_FRAME;
    const numberOfIterations = windowWidth / ADVANCE_SCREEN_PIXELS_PER_FRAME;

    initializeScreen();

    // Animate the sprite to move with the screen scroll. The animation is set to take as long as the screen scroll takes
    setScrolling(true);
    if (reverse) {
        sprite[SPRITE].animate({left:  (windowWidth - getWidth(sprite[SPRITE])) + 'px'}, (numberOfIterations * sleepPerIterationDuration), 'linear');
    } else {
        sprite[SPRITE].animate({left: '0px'}, (numberOfIterations * sleepPerIterationDuration), 'linear');
    }
    for (let i = 0; i < numberOfIterations ; i++) {
        if (reverse) {
            setBackgroundPosition(BACKDROP, '-' + (numberOfIterations*ADVANCE_SCREEN_PIXELS_PER_FRAME - ((i+1)*ADVANCE_SCREEN_PIXELS_PER_FRAME)));
        } else {
            setBackgroundPosition(BACKDROP, '-' + (i + 1) * ADVANCE_SCREEN_PIXELS_PER_FRAME);
        }
        await sleep(sleepPerIterationDuration);
    }
    setScrolling(false);
    startMonsterAttacks();
}

function stop(sprite) {
    const isRight = getDirection(sprite) === RIGHT;
    const x = -1 * (isRight ? getRightStopPosition(sprite)
        : getLeftStopPosition(sprite)) * getWidth(sprite[SPRITE]);
    const y = isRight ? (-1 * getRightHeightStopPosition(sprite))
        : -1 * getLeftHeightStopPosition(sprite) * getHeight(sprite[SPRITE]);

    setSpriteBackgroundPosition(sprite[SPRITE], x, y);
    stopSpriteMovement(sprite[SPRITE]);
}

function move(sprite, requestedAction) {
    const isRight = getDirection(sprite) === RIGHT;
    (requestedAction === RUN) ? isRight
        ? runRight(sprite) : runLeft(sprite)
        : isRight ? moveRight(sprite) : moveLeft(sprite);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function fall(sprite) {
    const bottom = getBottom(sprite[SPRITE]).substring(0, getBottom(sprite[SPRITE]).length - 2);
    const distance = parseInt(bottom) + (getHeight(sprite[SPRITE]) / 2);

    sprite[SPRITE].animate({bottom: '0'}, distance / FALLING_PIXELS_PER_SECOND * MILLISECONDS_PER_SECOND,  'linear');

    setTimeout(function () {
        hide(sprite[SPRITE]);
        setAction(sprite, STOP);
    }, distance / FALLING_PIXELS_PER_SECOND * MILLISECONDS_PER_SECOND) ;
}

function moveRight(sprite) {
    const distance = windowWidth - getLeft(sprite[SPRITE]) - getWidth(sprite[SPRITE]);
    sprite[SPRITE].animate({left: windowWidth - getWidth(sprite[SPRITE]) + 'px'},
        distance / getCurrentPixelsPerSecond(sprite) * MILLISECONDS_PER_SECOND, 'linear');
}

function moveLeft(sprite) {
    const distance = getLeft(sprite[SPRITE]);
    sprite[SPRITE].animate({left: '0px'},
        distance / getCurrentPixelsPerSecond(sprite) * MILLISECONDS_PER_SECOND, 'linear');
}

function runRight(sprite) {
    const distance = (windowWidth - getLeft(sprite[SPRITE])) - getWidth(sprite[SPRITE]);
    sprite[SPRITE].animate({left: windowWidth - getWidth(sprite[SPRITE]) +  'px'},
        distance / sprite['currentPixelsPerSecond'] * MILLISECONDS_PER_SECOND, 'linear');
}

function runLeft(sprite) {
    const distance = getLeft(sprite[SPRITE]);
    sprite[SPRITE].animate({left: '0px'},
        distance / getCurrentPixelsPerSecond(sprite) * MILLISECONDS_PER_SECOND, 'linear');
}

function getDeathDelay(sprite, opponent) {
    const separation = Math.abs(getLeft(sprite[SPRITE]) - getLeft(opponent[SPRITE]));

    const relativePps = getDirection(sprite) === getDirection(opponent)
        ? getCurrentPixelsPerSecond(opponent) - getCurrentPixelsPerSecond(sprite)
        : getCurrentPixelsPerSecond(opponent) + getCurrentPixelsPerSecond(sprite);
    return DEFAULT_DEATH_DELAY + (separation / Math.abs(relativePps)) * MILLISECONDS_PER_SECOND;
}

function monsterTurnaround(sprite, opponents) {
    if (!isMonster(sprite)) {
        return false;
    }

    const isPassedLeft = getDirection(sprite) === LEFT &&
        getLeft(sprite[SPRITE]) + getWidth(sprite[SPRITE]) * PASSING_MULTIPLIER < getLeft(BARBARIAN_SPRITE[SPRITE]) ||
        hitLeftBoundry(sprite);
    const isPassedRight = getDirection(sprite) === RIGHT &&
        getLeft(sprite[SPRITE]) - getWidth(sprite[SPRITE]) * PASSING_MULTIPLIER > getLeft(BARBARIAN_SPRITE[SPRITE]) ||
        hitRightBoundry(sprite);

    if (isPassedLeft || isPassedRight) {
        setDirection(sprite,isPassedLeft ? RIGHT : LEFT);
        actionHelper(sprite, WALK, 0);
        return true;
    } else {
        return false;
    }
}

function initializeScreen() {
    if (screenNumber == 0) {
        setLeft(MONSTER_SPRITE[SPRITE], 850);
        unhighlight(MONSTER_SPRITE[SPRITE]);
    }
    if (screenNumber == 1) {
        DOG_SPRITE[STATUS] = DEAD;
        setLeft(DOG_SPRITE[SPRITE], '850');
        setBottom(DOG_SPRITE[SPRITE], 160);
        unhighlight(DOG_SPRITE[SPRITE]);
    } else {
        hide(DOG_SPRITE[SPRITE]);
        hide(BRIDGE);
    }
}

function startMonsterAttacks(force = false) {
    if (getScreenNumber() === 0) {
        playMonsterSound();
        if (getStatus(MONSTER_SPRITE) == DEAD || force) {
            show(MONSTER_SPRITE[SPRITE]);
            setStatus(MONSTER_SPRITE, ALIVE);
            actionHelper(MONSTER_SPRITE, WALK, 0);
        }
    }

    if (getScreenNumber() === 1) {
        playGrowlSound();
        show(BRIDGE);
        if (getStatus(DOG_SPRITE) == DEAD || force) {
            setStatus(DOG_SPRITE, ALIVE);
            show(DOG_SPRITE[SPRITE]);
            actionHelper(DOG_SPRITE, SIT, 0);
        }
    }
}

function handleBoundry(sprite) {
    const isRightBoundry = hitRightBoundry(sprite);
    const isLeftBoundry = hitLeftBoundry(sprite);

    if (!isLeftBoundry && !isRightBoundry) {
        return false;
    }

    if (isLeftBoundry && getScreenNumber() > 0) {
        screenNumber--;
        advanceBackdrop(sprite, true);
    }
    if (isRightBoundry && !isMonster(sprite)) {
        if (getScreenNumber() < 2 && areAllMonstersDeadOnScreen()) {
            setScreenNumber(getScreenNumber()+1);
            if (getScreenNumber() < 2) {
                advanceBackdrop(sprite);
            }
        }
        if (getScreenNumber() == 2) {
            hide(DEMO_OVER_MESSAGE);
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
    const heightOffset = heightOffsetGridUnits * getHeight(sprite[SPRITE]);
    setSpriteBackgroundPosition(sprite[SPRITE], (-1*position*sprite[SPRITE].width()), -1*heightOffset);
}

function renderDeathSpriteFrame(sprite, position) {
    const heightOffset = sprite[DEATH][ANIMATION][sprite[DIRECTION]][HEIGHT_OFFSET] * sprite[DEATH][SPRITE].height();
    setSpriteBackgroundPosition(sprite[DEATH][SPRITE], (-1*position*sprite[DEATH][SPRITE].width()), -1*heightOffset);
}

function hitLeftBoundry(sprite) {
    return getDirection(sprite) === LEFT && getLeft(sprite[SPRITE]) === 0;
}

function hitRightBoundry(sprite) {
    return getDirection(sprite) === RIGHT && getLeft(sprite[SPRITE]) === windowWidth - getWidth(sprite[SPRITE]);
}

function handleDeath(sprite) {
    setDeathTime(sprite, new Date().getTime());
    setStatus(sprite, DEAD);
    if (!isMonster(sprite) && getLives() > 0) {
        setLives(getLives() - 1);
    }
}

function death(sprite) {
    handleDeath(sprite);
    animateDeath(sprite);
    if (!isMonster(sprite) && getLives() > 0) {
        show(START_MESSAGE);
        if (isSound()) {
            playGruntSound();
        }
    } else {
        if (isSound()) {
            playFireSound();
        }
    }
    if (!isMonster(sprite) && getLives() < 1) {
        show(GAME_OVER_MESSAGE);
    }
}

function isAliveOrJustDied() {
    return !isDead(BARBARIAN_SPRITE) || isJustDied();
}

function isJustDied() {
    return new Date().getTime() - getDeathTime(BARBARIAN_SPRITE) < JUST_DIED_THRESHOLD;
}

async function animateFall(sprite) {
    stopSpriteMovement(sprite[SPRITE]);
    setLives(0);
    handleDeath(sprite);
    if (!isMonster(sprite) && getLivees() < 1) {
        show(GAME_OVER_MESSAGE);
    }

    if (isSound()) {
        playFallSound();
    }

    fall(sprite);
    const direction = getDirection(sprite);
    const frames = sprite[FRAMES][FALL][direction][FRAMES];
    for(var i = 0; i < frames.length; i++) {
        renderSpriteFrame(sprite, FALL, frames[i])
        await sleep(MILLISECONDS_PER_SECOND / sprite[FPS]);
    }
}

async function animateDeath(sprite) {
    if (!isMonster(sprite)) {
        setBarbarianDying(true);
    }
    stopSpriteMovement(sprite[SPRITE]);

    if (isMonster(sprite)) {
        setLeft(sprite[DEATH][SPRITE], getLeft(sprite[SPRITE]));
        show(sprite[DEATH][SPRITE]);
        hide(sprite[SPRITE]);
    }

    const direction = getDirection(sprite);
    const frames = sprite[DEATH][ANIMATION];
    for (let i = 0; i < frames[direction][FRAMES].length; i++) {
        const position = frames[direction][FRAMES][i];
        renderDeathSpriteFrame(sprite, position);
        await sleep(MILLISECONDS_PER_SECOND / sprite[DEATH][ANIMATION][FPS]);
    }

    if (isMonster(sprite)) {
        hide(sprite[DEATH][SPRITE]);
    }
    if (!isMonster(sprite)) {
        setBarbarianDying(false);
    }
}
