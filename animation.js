async function animateSprite(sprite, requestedAction, requestedDirection, times) {

    const path = sprite[FRAMES][requestedAction][sprite[DIRECTION]][FRAMES];

    sprite[ACTION] = requestedAction;
    sprite[DIRECTION] = requestedDirection;

    let index = 0;
    let fightOver = false;
    let gameOver = false;

    if (sprite[NAME] == BARBARIAN_SPRITE_NAME) {
        console.log("==> requestedAction for " + sprite[NAME] + ":" + requestedAction);
    }
    while (sprite[ACTION] === requestedAction && sprite[DIRECTION] === requestedDirection && index < path.length) {

        // If the sprite has been killed delay stopping the animation to let the action sequence complete
        if (isDead(sprite)) {
            setTimeout(function () {
                fightOver = true;
            }, sprite[DEATH][DELAY] * (1 / sprite[FPS]));
        }

        if (lives < 1) {
            setTimeout(function () {
                gameOver = true;
            }, 2 * BARBARIAN_SPRITE[DEATH][DELAY] * (1 / sprite[FPS]));
        }

        // If the action starts a new animation or the current one should terminate break out of the loop
        if (pause ||
            gameOver ||
            handleObstacles(sprite, getObstacles(sprite)) ||
            !isSpriteCurrentOpponent(sprite) ||
            fightOver ||
            fightSequence(sprite, SCREENS[screenNumber][OPPONENTS]) ||
            monsterTurnaround(sprite, SCREENS[screenNumber][OPPONENTS]) ||
            handleBoundry(sprite)) {
            if (sprite[NAME] == BARBARIAN_SPRITE_NAME) {
                console.log("==> requestedAction for " + sprite[NAME] + ":" + requestedAction + " and we bailed. fight over:" + fightOver);
            }
            break;
        }

        renderSpriteFrame(sprite, requestedAction, path[index++]);
        await sleep(1000 / sprite[FPS]);

        if (index == path.length) {
            // If times is 0 we loop infinitely, if times is set decrement it and keep looping
            if (times === 0 || --times > 0) {
                index = 0;
            }
        }
    }

    // Action is over, reset state so the action can be executed again if desired
    if (pause || gameOver) {
        sprite[SPRITE].stop();
    }else if (sprite[ACTION] != WALK && !isMonster(sprite) && sprite[ACTION] === requestedAction) {
        sprite[ACTION] = undefined;
        sprite[SPRITE].stop();
    }

}

function actionHelper(sprite, requestedAction, times) {
    sprite[SPRITE].stop();

    if (requestedAction === STOP) {
        sprite['currentPixelsPerSecond'] = 0;
        stop(sprite);
        return;
    } else if (requestedAction === FALL) {
        sprite[ACTION] = FALL;
        stop(sprite);
        animateFall(sprite);
        return;
    } else if ((requestedAction === ATTACK && !sprite[HAS_MOVING_ATTACK])) {
        sprite['currentPixelsPerSecond'] = 0;
    } else if (requestedAction === RUN) {
        sprite['currentPixelsPerSecond'] = sprite[PIXELS_PER_SECOND] * RUN_SPEED_INCREASE_FACTOR;
    } else {
        sprite['currentPixelsPerSecond'] = sprite[PIXELS_PER_SECOND];
    }

    if (requestedAction !== SIT && (requestedAction !== ATTACK || sprite[HAS_MOVING_ATTACK])) {
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
    scrolling = true;
    if (reverse) {
        sprite[SPRITE].animate({left:  (windowWidth - sprite[SPRITE].width()/2) + 'px'}, (numberOfIterations * sleepPerIterationDuration), 'linear');
    } else {
        sprite[SPRITE].animate({left: '-' + (sprite[SPRITE].width() / 2) + 'px'}, (numberOfIterations * sleepPerIterationDuration), 'linear');
    }
    for (let i = 0; i < numberOfIterations ; i++) {
        if (reverse) {
            $('.backdrop').css('background-position', '-' + (numberOfIterations*ADVANCE_SCREEN_PIXELS_PER_FRAME - ((i+1)*ADVANCE_SCREEN_PIXELS_PER_FRAME)) + 'px');
        } else {
            $('.backdrop').css('background-position', '-' + (i + 1) * ADVANCE_SCREEN_PIXELS_PER_FRAME + 'px');
        }
        await sleep(sleepPerIterationDuration);
    }
    scrolling = false;
    startMonsterAttacks();
    resetBarbarianActions();
}

function stop(sprite) {
    const isRight = sprite[DIRECTION] === RIGHT;
    const x = -1 * (isRight ? sprite[STOP_POSITION][RIGHT]
        : sprite[STOP_POSITION][LEFT]) * sprite[SPRITE].width();
    const y = isRight ? (-1 * sprite[STOP_POSITION][RIGHT_HEIGHT])
        : -1 * sprite[STOP_POSITION][LEFT_HEIGHT] * sprite[SPRITE].height();

    sprite[SPRITE].css('background-position', x + 'px ' + y + 'px');
    sprite[SPRITE].stop();
}

function move(sprite, requestedAction) {
    const isRight = sprite[DIRECTION] === RIGHT;
    (requestedAction === RUN) ? isRight
        ? runRight(sprite) : runLeft(sprite)
        : isRight ? moveRight(sprite) : moveLeft(sprite);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function fall(sprite) {
    const bottom = sprite[SPRITE].css('bottom').substring(0, sprite[SPRITE].css('bottom').length - 2);
    const distance = parseInt(bottom) + (sprite[SPRITE].height() / 2);


    sprite[SPRITE].animate({bottom: 0}, distance / FALLING_PIXELS_PER_SECOND * 1000,  'linear');

    setTimeout(function () {
        sprite[SPRITE].css('display', 'none');
    }, distance / FALLING_PIXELS_PER_SECOND * 1000) ;
}

function moveRight(sprite) {
    const distance = windowWidth - sprite[SPRITE].offset().left - (sprite[SPRITE].width() / 2);
    sprite[SPRITE].animate({left: windowWidth - (sprite[SPRITE].width() / 2) + 'px'},
        distance / sprite['currentPixelsPerSecond'] * 1000, 'linear');
}

function moveLeft(sprite) {
    const distance = sprite[SPRITE].offset().left + (sprite[SPRITE].width() / 2);
    sprite[SPRITE].animate({left: '-' + (sprite[SPRITE].width() / 2) + 'px'},
        distance / sprite['currentPixelsPerSecond'] * 1000, 'linear');
}

function runRight(sprite) {
    const distance = (windowWidth - sprite[SPRITE].offset().left) - (sprite[SPRITE].width() / 2);
    sprite[SPRITE].animate({left: windowWidth - (sprite[SPRITE].width() / 2) +  'px'},
        distance / sprite['currentPixelsPerSecond'] * 1000, 'linear');
}

function runLeft(sprite) {
    const distance = sprite[SPRITE].offset().left + (sprite[SPRITE].width() / 2);
    sprite[SPRITE].animate({left: '-' + (sprite[SPRITE].width() / 2) + 'px'},
        distance / sprite['currentPixelsPerSecond'] * 1000, 'linear');
}

function getDeathDelay(sprite, opponent) {
    const separation = Math.abs(sprite[SPRITE].offset().left - opponent[SPRITE].offset().left);

    const relativePps = sprite[DIRECTION] === opponent[DIRECTION]
        ? opponent['currentPixelsPerSecond'] - sprite['currentPixelsPerSecond']
        : opponent['currentPixelsPerSecond'] + sprite['currentPixelsPerSecond'];
    return DEFAULT_DEATH_DELAY + (separation / Math.abs(relativePps)) * 1000;
}

function monsterTurnaround(sprite, opponents) {
    if (!isMonster(sprite)) {
        return false;
    }

    const isPassedLeft = sprite[DIRECTION] === LEFT &&
        sprite[SPRITE].offset().left + sprite[SPRITE].width() * 1.5 < BARBARIAN_SPRITE[SPRITE].offset().left ||
        hitLeftBoundry(sprite);
    const isPassedRight = sprite[DIRECTION] === RIGHT &&
        sprite[SPRITE].offset().left - sprite[SPRITE].width() * 1.5 > BARBARIAN_SPRITE[SPRITE].offset().left ||
        hitRightBoundry(sprite);

    if (isPassedLeft || isPassedRight) {
        sprite[DIRECTION] = isPassedLeft ? RIGHT : LEFT;
        actionHelper(sprite, WALK, 0);
        return true;
    } else {
        return false;
    }
}

function initializeScreen() {
    if (screenNumber !== 1) {
        $('.bridge').css('display', 'none');
        DOG_SPRITE[SPRITE].css('display', 'none');
    }

}

function startMonsterAttacks() {
    if (screenNumber === 0) {
        actionHelper(MONSTER_SPRITE, WALK, 0);
    }
    if (screenNumber == 1 && DOG_SPRITE[STATUS] != DEAD) {
        //DOG_SPRITE[SPRITE].animate({left: 1100}, ADVANCE_SCREEN_SCROLL_DURATION, 'linear');
        DOG_SPRITE[SPRITE].css('display', 'block');
        $('.bridge').css('display', 'block');
        actionHelper(DOG_SPRITE, SIT, 0);
    }
}

function resetBarbarianActions() {
    BARBARIAN_SPRITE[POSITIONS][ATTACK] = {};
    BARBARIAN_SPRITE[POSITIONS][JUMP] = {};
}



function handleBoundry(sprite) {
    const isRightBoundry = hitRightBoundry(sprite);
    const isLeftBoundry = hitLeftBoundry(sprite);

    if (!isLeftBoundry && !isRightBoundry) {
        return false;
    }

    if (isLeftBoundry || isRightBoundry) {
        if (isLeftBoundry && screenNumber > 0) {
            screenNumber--;
            advanceBackdrop(sprite, true);
        }
        if (isRightBoundry && sprite[NAME] === BARBARIAN_SPRITE_NAME) {

            if (screenNumber < 1 && areAllMonstersDeadOnScreen()) {
                screenNumber++;
                advanceBackdrop(sprite);
            }
        }

        // Since we are stopping set the frame to the stop frame (1st frame when walking)
        renderSpriteFrame(sprite, WALK, 0);
        sprite[ACTION] = STOP;
        return true;
    }
    return false;
}


function renderSpriteFrame(sprite, requestedAction, position) {
    const heightOffsetGridUnits = sprite[FRAMES][requestedAction][sprite[DIRECTION]][HEIGHT_OFFSET];
    const heightOffset = heightOffsetGridUnits * sprite[SPRITE].height();
    sprite[SPRITE].css('background-position',(-1*position*sprite[SPRITE].width()) + 'px ' + -1*heightOffset + 'px');
}

function renderDeathSpriteFrame(sprite, position) {
    const heightOffset = sprite[DEATH][ANIMATION][sprite[DIRECTION]][HEIGHT_OFFSET] * sprite[DEATH][SPRITE].height();
    sprite[DEATH][SPRITE].css('background-position',
        (-1*position*sprite[DEATH][SPRITE].width()) + 'px ' + -1*heightOffset + 'px');
}

function hitLeftBoundry(sprite) {
    return sprite[DIRECTION] === LEFT && sprite[SPRITE].offset().left === (-1*sprite[SPRITE].width() / 2);
}

function hitRightBoundry(sprite) {
    return sprite[DIRECTION] === RIGHT && sprite[SPRITE].offset().left === windowWidth - sprite[SPRITE].width() / 2;
}

function handleDeath(sprite) {
    sprite[DEATH_TIME] = new Date().getTime();
    sprite[STATUS] = DEAD;
    if (!isMonster(sprite)) {
        lives--;
    }
}

function death(sprite) {
    handleDeath(sprite);
    setTimeout(function () {
        animateDeath(sprite);
        if (!isMonster(sprite) && lives > 0) {
            $('.start_message').css('display', 'block');
        }
        if (!isMonster(sprite) && lives < 1) {
            console.log('lives is ' + lives + ' and that is less than 1');
            $('.game_over').css('display', 'block');
        }
    }, sprite[DEATH][DELAY] * (1 / sprite[FPS]));
}

function isAliveOrJustDied() {
    return !isDead(BARBARIAN_SPRITE) || new Date().getTime() - BARBARIAN_SPRITE[DEATH_TIME] < 500;
}

async function animateFall(sprite) {
    sprite[SPRITE].stop();
    handleDeath(sprite);
    if (!isMonster(sprite) && lives < 1) {
        $('.game_over').css('display', 'block');
    }

    fall(sprite);
    const direction = sprite[DIRECTION];
    const frames = sprite[FRAMES][FALL][direction][FRAMES];
    for(var i = 0; i < frames.length; i++) {
        renderSpriteFrame(sprite, FALL, frames[i])
        await sleep(1000 / sprite[FPS]);
    }
}

async function animateDeath(sprite) {

    console.log('animating death for ' + sprite[NAME]);
    sprite[SPRITE].stop();

    if (sprite[NAME] !== BARBARIAN_SPRITE_NAME) {
        sprite[DEATH][SPRITE].css('left', sprite[SPRITE].offset().left - sprite[SPRITE].width() / 2);
        sprite[DEATH][SPRITE].css('display', 'block');
        sprite[SPRITE].css('display', 'none');
    }

    const direction = sprite[DIRECTION];
    const frames = sprite[DEATH][ANIMATION];
    for (let i = 0; i < frames[direction][FRAMES].length; i++) {
        const position = frames[direction][FRAMES][i];
        renderDeathSpriteFrame(sprite, position);
        await sleep(1000 / sprite[DEATH][ANIMATION][FPS]);
    }

    if (sprite[NAME] !== BARBARIAN_SPRITE_NAME) {
        sprite[DEATH][SPRITE].css('display', 'none');
    }
}
