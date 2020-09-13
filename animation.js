var RUN_SPEED_INCREASE_FACTOR = 1.5;
var DEFAULT_DEATH_DELAY = 2000;

function actionHelper(sprite, opponents, requestedAction, times) {
    sprite[SPRITE].stop();

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

function stop(sprite) {
    var isRight = sprite[DIRECTION] === RIGHT;
    var x = -1 * (isRight ? sprite[STOP_POSITION][RIGHT] : sprite[STOP_POSITION][LEFT]) * sprite[SPRITE].width();
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

function moveRight(sprite) {
    var distance = windowWidth - sprite[SPRITE].offset().left - (sprite[SPRITE].width() / 2);
    sprite[SPRITE].animate({left: windowWidth - (sprite[SPRITE].width() / 2) + 'px'}, distance / sprite[CURRENT_PIXELS_PER_SECOND] * 1000, 'linear');
}

function moveLeft(sprite) {
    var distance = sprite[SPRITE].offset().left + (sprite[SPRITE].width() / 2);
    sprite[SPRITE].animate({left: '-' + (sprite[SPRITE].width() / 2) + 'px'}, distance / sprite[CURRENT_PIXELS_PER_SECOND] * 1000, 'linear');
}

function runRight(sprite) {
    var distance = (windowWidth - sprite[SPRITE].offset().left) - (sprite[SPRITE].width() / 2);
    sprite[SPRITE].animate({left: windowWidth - (sprite[SPRITE].width() / 2) +  'px'}, distance / sprite[CURRENT_PIXELS_PER_SECOND] * 1000, 'linear');
}

function runLeft(sprite) {
    var distance = sprite[SPRITE].offset().left + (sprite[SPRITE].width() / 2);
    sprite[SPRITE].animate({left: '-' + (sprite[SPRITE].width() / 2) + 'px'}, distance / sprite[CURRENT_PIXELS_PER_SECOND] * 1000, 'linear');
}

function getDeathDelay(sprite, opponent) {
    var separation = Math.abs(sprite[SPRITE].offset().left - opponent[SPRITE].offset().left);

    var relativePps = sprite[DIRECTION] === opponent[DIRECTION]
        ? opponent[CURRENT_PIXELS_PER_SECOND] - sprite[CURRENT_PIXELS_PER_SECOND]
        : opponent[CURRENT_PIXELS_PER_SECOND] + sprite[CURRENT_PIXELS_PER_SECOND];
    return DEFAULT_DEATH_DELAY + (separation / Math.abs(relativePps)) * 1000;
}

function monsterTurnaround(sprite, opponents) {
    if (sprite[NAME] !== BARBARIAN_SPRITE_NAME) {
        var isPassedLeft = sprite[SPRITE].offset().left + sprite[SPRITE].width()*1.5 < BARBARIAN_SPRITE[SPRITE].offset().left;
        var isPassedRight = sprite[SPRITE].offset().left - sprite[SPRITE].width()*1.5 > BARBARIAN_SPRITE[SPRITE].offset().left;

        if (sprite[DIRECTION] === LEFT && (isPassedLeft || sprite[SPRITE].offset().left === -1*(sprite[SPRITE].width()/2))) {
            sprite[DIRECTION] = RIGHT;
            actionHelper(sprite, opponents, WALK, 0);
            return true;
        } else if (sprite[DIRECTION] === RIGHT && (isPassedRight
            || sprite[SPRITE].offset().left === $(document).width() - (sprite[SPRITE].width()))) {
            sprite[DIRECTION] = LEFT;
            actionHelper(sprite, opponents, WALK, 0);
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
    scrolling = false;
}

function hitBoundry(sprite) {
    var isRightBoundry = hitRightBoundry(sprite);
    var isLeftBoundry = hitLeftBoundry(sprite);
    if (isLeftBoundry || isRightBoundry) {
        console.log('==> at boundry and position is' + sprite[SPRITE].offset().left + ' direction is ' + sprite[DIRECTION]);
        if (sprite[SPRITE].offset().left === -1*sprite[SPRITE].width()/2 && screenNumber > 0) {
            canAdvance = true;
            screenNumber--;
            advanceBackdrop(sprite, true);
        }
        if (canAdvance && isRightBoundry && sprite[NAME] === BARBARIAN_SPRITE_NAME) {
            console.log(sprite[SPRITE].offset().left);
            canAdvance = false;
            screenNumber++;
            advanceBackdrop(sprite);
        }

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

    main:
    while (sprite[ACTION] === requestedAction && sprite[DIRECTION] === requestedDirection) {

        if (sprite[NAME] === BARBARIAN_SPRITE_NAME) {
            if (SCREENS[screenNumber]) {
                var obstacles = SCREENS[screenNumber];
                for (var i = 0; i < obstacles[sprite[DIRECTION]].length; i++) {
                    var obstacle = obstacles[sprite[DIRECTION]][i];
                    var left = sprite[SPRITE].offset().left;
                    var isPassedBoundry = false;
                    console.log('considering:' + obstacle[LEFT] + ' distance: ' + pixelsFromObsticle);
                    var pixelsFromObsticle = Math.abs(obstacle[LEFT] - left);
                    if (pixelsFromObsticle > 50) {
                        continue;
                    }
                    if (sprite[DIRECTION] === RIGHT) {
                        isPassedBoundry = left >= obstacle[LEFT];
                    } else {
                        isPassedBoundry = left <= obstacle[LEFT];
                    }
                    if (isPassedBoundry && sprite[SPRITE].css('bottom') !== obstacle[HEIGHT] + 'px') {
                        var bottom = sprite[SPRITE].css('bottom');
                        bottom = bottom.substring(0, bottom.length - 2);
                        console.log('obstacle: ' + obstacle[LEFT] + ' obstacle height:' + obstacle[HEIGHT] + ' bottom ' + bottom);
                        var isDownhill = obstacle[HEIGHT] <= bottom;
                        console.log('isDownhill:' + isDownhill);
                        console.log("==> jump actions: %o", sprite[POSITIONS][JUMP]);
                        var jumpPosition = sprite[POSITIONS][JUMP][BARBARIAN_SPRITE_NAME];
                        if (isDownhill || obstacle[JUMP_RANGE] && (jumpPosition > obstacle[JUMP_RANGE][0] && jumpPosition < obstacle[JUMP_RANGE][1])) {
                            sprite[SPRITE].css('bottom', obstacle[HEIGHT] + 'px');
                        } else {
                            console.log('stopping');
                            actionHelper(sprite, opponents, STOP, 1);
                            break main;
                        }
                    }
                    console.log('left:' + left + ' obstacle left:' + obstacle['left']);

                }
            }
        }
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
    return sprite[DIRECTION] === LEFT && sprite[SPRITE].offset().left === (-1*sprite[SPRITE].width() / 2);
}

function hitRightBoundry(sprite) {
    return sprite[DIRECTION] === RIGHT && sprite[SPRITE].offset().left === windowWidth - sprite[SPRITE].width() / 2;
}

function getProximity(sprite, opponent) {
    return sprite[SPRITE].offset().left - opponent[SPRITE].offset().left;
}

function death(sprite) {
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
