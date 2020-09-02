function stop(sprite) {
    var isRight = sprite[DIRECTION] === RIGHT;
    var x = -1 * (isRight ? sprite[STOP_POSITION][RIGHT] : sprite[STOP_POSITION][LEFT]) * sprite[SPRITE].width();
    var y = isRight ? (-1 * sprite[STOP_POSITION][RIGHT_HEIGHT])
                    : -1 * sprite[STOP_POSITION][LEFT_HEIGHT] * sprite[SPRITE].height();

    sprite[SPRITE].css('background-position', x + 'px ' + y + 'px');
    sprite[SPRITE].stop();
}

function actionHelper(sprite, opponents, requestedAction, times) {
    sprite[SPRITE].stop();

    console.log('requested action is:' + requestedAction);
    if (requestedAction === STOP) {
        sprite[CURRENT_PIXELS_PER_SECOND] = 0;
        stop(sprite);
        return;
    } else if ((requestedAction === ATTACK && !sprite[HAS_MOVING_ATTACK])) {
        sprite[CURRENT_PIXELS_PER_SECOND] = 0;
    } else if (requestedAction === RUN) {
        sprite[CURRENT_PIXELS_PER_SECOND] = sprite[PIXELS_PER_SECOND] * RUN_SPEED_INCREASE_FACTOR;
    } else {
        sprite[CURRENT_PIXELS_PER_SECOND] = sprite[PIXELS_PER_SECOND];
    }

    if (requestedAction !== ATTACK || sprite[HAS_MOVING_ATTACK]) {
        move(sprite, requestedAction);
    }

    animateSprite(sprite,
        opponents,
        requestedAction,
        sprite[DIRECTION] === RIGHT ? RIGHT : LEFT,
        times);
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

function moveRight(sprite) {
    var distance = windowWidth - sprite[SPRITE].offset().left;
    sprite[SPRITE].animate({left: windowWidth + 'px'}, distance / sprite[PIXELS_PER_SECOND] * 1000, 'linear');
}

function moveLeft(sprite) {
    var distance = sprite[SPRITE].offset().left;
    sprite[SPRITE].animate({left: '0px'}, distance / sprite[PIXELS_PER_SECOND] * 1000, 'linear');
}

function runRight(sprite) {
    var distance = (windowWidth - sprite[SPRITE].offset().left);
    sprite[SPRITE].animate({left: windowWidth + 'px'}, distance / sprite[PIXELS_PER_SECOND] / RUN_SPEED_INCREASE_FACTOR * 1000, 'linear');
}

function runLeft(sprite) {
    var distance = sprite[SPRITE].offset().left;
    sprite[SPRITE].animate({left: '0px'}, distance / sprite[PIXELS_PER_SECOND] / RUN_SPEED_INCREASE_FACTOR * 1000, 'linear');
}

function getDeathDelay(sprite, opponent) {
    var spritePixelsPerSecond = sprite[CURRENT_PIXELS_PER_SECOND];
    var opponentPixelsPerSecond = opponent[CURRENT_PIXELS_PER_SECOND];
    var separation = Math.abs(sprite[SPRITE].offset().left - opponent[SPRITE].offset().left);

    var relativePps = sprite[DIRECTION] === opponent[DIRECTION]
        ? Math.abs(opponentPixelsPerSecond - spritePixelsPerSecond)
        : Math.abs(opponentPixelsPerSecond + spritePixelsPerSecond);
    return DEFAULT_DEATH_DELAY + (separation / relativePps) * 1000;
}

function monsterTurnaround(sprite, opponents) {
    var turned = false;
    if (sprite[NAME] !== BARBARIAN_SPRITE_NAME) {
        var isPassedLeft = sprite[SPRITE].offset().left + sprite[SPRITE].width()*1.5 < BARBARIAN_SPRITE[SPRITE].offset().left;
        var isPassedRight = sprite[SPRITE].offset().left - sprite[SPRITE].width()*1.5 > BARBARIAN_SPRITE[SPRITE].offset().left;

        if (sprite[DIRECTION] === LEFT && (isPassedLeft || sprite[SPRITE].offset().left === 0)) {
            sprite[DIRECTION] = RIGHT;
            actionHelper(sprite, opponents, WALK, 0);
            turned = true;
        } else if (sprite[DIRECTION] === RIGHT && (isPassedRight
            || sprite[SPRITE].offset().left === $(document).width() - sprite[SPRITE].width())) {
            sprite[DIRECTION] = LEFT;
            actionHelper(sprite, opponents, WALK, 0);
            turned = true;
        }

    }

}

function hitBoundry(sprite) {
    if (hitLeftBoundry(sprite) || hitRightBoundry(sprite)) {
        // Since we are stopping set the frame to the stop frame (1st frame when walking)
        renderSpriteFrame(sprite, WALK, 0);
        sprite[ACTION] = STOP;
        return true;
    }
    return false;
}

async function animateSprite(sprite, opponents, requestedAction, requestedDirection, times) {
    var path = sprite[FRAMES][requestedAction][sprite[DIRECTION]][FRAMES];

    sprite[ACTION] = requestedAction;
    sprite[DIRECTION] = requestedDirection;

    var index = 0;
    var fightOver = false;

    while (sprite[ACTION] === requestedAction && sprite[DIRECTION] === requestedDirection) {

        // If the sprite has been killed delay stopping the animation to let the action sequence complete
        if (sprite[STATUS] === DEAD) {
            setTimeout(function () {
                fightOver = true;
            }, sprite[DEATH][DELAY] * (1 / sprite[FPS]));
        }
        if(fightOver || fightSequence(sprite, opponents) || monsterTurnaround(sprite, opponents)) {
            break;
        }

        renderSpriteFrame(sprite, requestedAction, path[index]);

        if (sprite[ACTION] === STOP || hitBoundry(sprite)) {
            break;
        }

        await sleep(1000 / sprite[FPS]);

        // loop the sprite animation
        index++;
        if (index == path.length) {
            if (times < 1 || --times > 0) {
                index = 0;
            } else {
                break;
            }
        }
    }

    // Action is over, reset state so the action can be repeated if desired
    if (sprite[ACTION] !== WALK && sprite[NAME] === BARBARIAN_SPRITE_NAME && sprite[ACTION] === requestedAction) {
        sprite[ACTION] = undefined;
        sprite[SPRITE].stop();
    }

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
    return sprite[DIRECTION] === LEFT && sprite[SPRITE].offset().left === 0;
}

function hitRightBoundry(sprite) {
    return sprite[DIRECTION] === RIGHT && sprite[SPRITE].offset().left === windowWidth;
}

function getProximity(sprite, opponent) {
    return sprite[SPRITE].offset().left - opponent[SPRITE].offset().left;
}

function death(sprite) {
    console.log('==> death an action is ' + sprite[ACTION]);
    sprite[STATUS] = DEAD;
    setTimeout(function () {
        animateDeath(sprite)
    }, sprite[DEATH][DELAY] * (1 / sprite[FPS]));
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
