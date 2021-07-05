
async function animateSprite(sprite, requestedAction, requestedDirection, times) {

    var path = sprite[FRAMES][requestedAction][sprite[DIRECTION]][FRAMES];

    sprite[ACTION] = requestedAction;
    sprite[DIRECTION] = requestedDirection;

    var index = 0;
    var fightOver = false;

    while (sprite[ACTION] === requestedAction && sprite[DIRECTION] === requestedDirection && index < path.length) {

        // If the sprite has been killed delay stopping the animation to let the action sequence complete
        if (isDead(sprite)) {
            setTimeout(function () {
                fightOver = true;
            }, sprite[DEATH][DELAY] * (1 / sprite[FPS]));
        }

        // If the action starts a new animation or the current one should terminate break out of the loop
        if (handleObstacles(sprite, getObstacles(sprite)) ||
            !isSpriteCurrentOpponent(sprite) ||
            fightOver ||
            fightSequence(sprite, SCREENS[screenNumber][OPPONENTS]) ||
            monsterTurnaround(sprite, SCREENS[screenNumber][OPPONENTS]) ||
            hitBoundry(sprite)) {
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
    if (spite[ACTION] != WALK && !isMonster(sprite) && sprite[ACTION] === requestedAction) {
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

function stop(sprite) {
    var isRight = sprite[DIRECTION] === RIGHT;
    var x = -1 * (isRight ? sprite[STOP_POSITION][RIGHT]
                          : sprite[STOP_POSITION][LEFT]) * sprite[SPRITE].width();
    var y = isRight ? (-1 * sprite[STOP_POSITION][RIGHT_HEIGHT])
                    : -1 * sprite[STOP_POSITION][LEFT_HEIGHT] * sprite[SPRITE].height();

    sprite[SPRITE].css('background-position', x + 'px ' + y + 'px');
    sprite[SPRITE].stop();
}

function move(sprite, requestedAction) {
    var isRight = sprite[DIRECTION] === RIGHT;
    (requestedAction === RUN) ? isRight
        ? runRight(sprite) : runLeft(sprite)
        : isRight ? moveRight(sprite) : moveLeft(sprite);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function fall(sprite) {
    var bottom = sprite[SPRITE].css('bottom').substring(0, sprite[SPRITE].css('bottom').length - 2);
    var distance = parseInt(bottom) + (sprite[SPRITE].height() / 2);
    sprite[SPRITE].animate({bottom: -1*200}, distance / FALLING_PIXELS_PER_SECOND * 1000,  'linear');
}

function moveRight(sprite) {
    var distance = windowWidth - sprite[SPRITE].offset().left - (sprite[SPRITE].width() / 2);
    sprite[SPRITE].animate({left: windowWidth - (sprite[SPRITE].width() / 2) + 'px'}, distance / sprite['currentPixelsPerSecond'] * 1000, 'linear');
}

function moveLeft(sprite) {
    var distance = sprite[SPRITE].offset().left + (sprite[SPRITE].width() / 2);
    sprite[SPRITE].animate({left: '-' + (sprite[SPRITE].width() / 2) + 'px'}, distance / sprite['currentPixelsPerSecond'] * 1000, 'linear');
}

function runRight(sprite) {
    var distance = (windowWidth - sprite[SPRITE].offset().left) - (sprite[SPRITE].width() / 2);
    sprite[SPRITE].animate({left: windowWidth - (sprite[SPRITE].width() / 2) +  'px'}, distance / sprite['currentPixelsPerSecond'] * 1000, 'linear');
}

function runLeft(sprite) {
    var distance = sprite[SPRITE].offset().left + (sprite[SPRITE].width() / 2);
    sprite[SPRITE].animate({left: '-' + (sprite[SPRITE].width() / 2) + 'px'}, distance / sprite['currentPixelsPerSecond'] * 1000, 'linear');
}

function getDeathDelay(sprite, opponent) {
    var separation = Math.abs(sprite[SPRITE].offset().left - opponent[SPRITE].offset().left);

    var relativePps = sprite[DIRECTION] === opponent[DIRECTION]
        ? opponent['currentPixelsPerSecond'] - sprite['currentPixelsPerSecond']
        : opponent['currentPixelsPerSecond'] + sprite['currentPixelsPerSecond'];
    return DEFAULT_DEATH_DELAY + (separation / Math.abs(relativePps)) * 1000;
}

function monsterTurnaround(sprite, opponents) {
    if (isMonster(sprite)) {
        var isPassedLeft = sprite[DIRECTION] === LEFT &&
            sprite[SPRITE].offset().left + sprite[SPRITE].width()*1.5 < BARBARIAN_SPRITE[SPRITE].offset().left ||
            hitLeftBoundry(sprite);
        var isPassedRight = sprite[DIRECTION] === RIGHT &&
            sprite[SPRITE].offset().left - sprite[SPRITE].width()*1.5 > BARBARIAN_SPRITE[SPRITE].offset().left ||
            hitRightBoundry(sprite);

        if (isPassedLeft) {
            sprite[DIRECTION] = RIGHT;
            actionHelper(sprite, WALK, 0);
            return true;
        } else if (isPassedRight) {
            sprite[DIRECTION] = LEFT;
            actionHelper(sprite, WALK, 0);
            return true;
        }
    }
    return false;
}

async function advanceBackdrop(sprite, reverse = false) {
    scrolling = true;
    var width = windowWidth;
    var buffer = 0;
    var pixelsPerSecond = 1500;
    var pixelsPerFrame = 10;

    var sleepPerIterationDuration = (1000 / pixelsPerSecond) * pixelsPerFrame;
    var numberOfIterations = width / pixelsPerFrame;

    if (screenNumber !== 1) {
        $('.bridge').css('display', 'none');
        DOG_SPRITE[SPRITE].css('display', 'none');
    }

    // Animate the sprite to move with the screen scroll. The animation is set to take as long as the screen scroll takes
    if (reverse) {
        sprite[SPRITE].animate({left:  (windowWidth - sprite[SPRITE].width()/2) + 'px'}, (numberOfIterations * sleepPerIterationDuration) + buffer, 'linear');
    } else {
        sprite[SPRITE].animate({left: '-' + (sprite[SPRITE].width() / 2) + 'px'}, (numberOfIterations * sleepPerIterationDuration) + buffer, 'linear');
    }
    for (i = 0; i < numberOfIterations ; i++) {
        if (reverse) {
            $('.backdrop').css('background-position', '-' + (numberOfIterations*pixelsPerFrame - ((i+1)*pixelsPerFrame)) + 'px');
        } else {
            $('.backdrop').css('background-position', '-' + (i + 1) * pixelsPerFrame + 'px');
        }
        await sleep(sleepPerIterationDuration);
    }

    if (screenNumber == 1 && DOG_SPRITE[STATUS] != DEAD) {
        DOG_SPRITE[SPRITE].animate({left: 1100}, 1000, 'linear');
        DOG_SPRITE[SPRITE].css('display', 'block');
        $('.bridge').css('display', 'block');
        actionHelper(DOG_SPRITE, SIT, 0);
    }

    BARBARIAN_SPRITE[POSITIONS][ATTACK] = {};
    BARBARIAN_SPRITE[POSITIONS][JUMP] = {};

    scrolling = false;
}

function hitBoundry(sprite) {
    var isRightBoundry = hitRightBoundry(sprite);
    var isLeftBoundry = hitLeftBoundry(sprite);
    if (isLeftBoundry || isRightBoundry) {
        if (sprite[SPRITE].offset().left === -1*sprite[SPRITE].width()/2 && screenNumber > 0) {
            canAdvance = true;
            screenNumber--;
            advanceBackdrop(sprite, true);
        }
        if (canAdvance && isRightBoundry && sprite[NAME] === BARBARIAN_SPRITE_NAME) {
            canAdvance = false;

            if (screenNumber < 1) {
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
    var heightOffsetGridUnits = sprite[FRAMES][requestedAction][sprite[DIRECTION]][HEIGHT_OFFSET];
    var heightOffset = heightOffsetGridUnits * sprite[SPRITE].height();
    sprite[SPRITE].css('background-position',(-1*position*sprite[SPRITE].width()) + 'px ' + -1*heightOffset + 'px');
}

function renderDeathSpriteFrame(sprite, position) {
    var heightOffset = sprite[DEATH][ANIMATION][sprite[DIRECTION]][HEIGHT_OFFSET] * sprite[DEATH][SPRITE].height();
    sprite[DEATH][SPRITE].css('background-position',(-1*position*sprite[DEATH][SPRITE].width()) + 'px ' + -1*heightOffset + 'px');
}

function hitLeftBoundry(sprite) {
    return sprite[DIRECTION] === LEFT && sprite[SPRITE].offset().left === (-1*sprite[SPRITE].width() / 2);
}

function hitRightBoundry(sprite) {
    return sprite[DIRECTION] === RIGHT && sprite[SPRITE].offset().left === windowWidth - sprite[SPRITE].width() / 2;
}

function death(sprite) {
    sprite[STATUS] = DEAD;
    setTimeout(function () {
        animateDeath(sprite)
    }, sprite[DEATH][DELAY] * (1 / sprite[FPS]));
}

async function animateFall(sprite) {
    console.log(sprite[NAME] + ' is falling');
    sprite[SPRITE].stop();
    sprite[STATUS] = DEAD;

    fall(sprite);
    var direction = sprite[DIRECTION];
    var frames = sprite[FRAMES][FALL][direction][FRAMES];
    for(var i = 0; i < frames.length; i++) {
        renderSpriteFrame(sprite, FALL, frames[i])
        await sleep(1000 / sprite[FPS]);
    }
}

async function animateDeath(sprite) {

    sprite[SPRITE].stop();
    sprite[STATUS] = DEAD;

    if (sprite[NAME] !== BARBARIAN_SPRITE_NAME) {
        sprite[DEATH][SPRITE].css('left', sprite[SPRITE].offset().left - sprite[SPRITE].width() / 2);
        sprite[DEATH][SPRITE].css('display', 'block');
        sprite[SPRITE].css('display', 'none');
    }

    var direction = sprite[DIRECTION];
    var frames = sprite[DEATH][ANIMATION];
    for (var i = 0; i < frames[direction][FRAMES].length; i++) {
        var position = frames[direction][FRAMES][i];
        renderDeathSpriteFrame(sprite, position);
        await sleep(1000 / sprite[DEATH][ANIMATION][FPS]);
    }

    if (sprite[NAME] !== BARBARIAN_SPRITE_NAME) {
        sprite[DEATH][SPRITE].css('display', 'none');
    }
}
