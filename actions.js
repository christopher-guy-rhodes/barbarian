/**
 * Starts an attack to the left or right depending on the direction the barbarian is moving.
 */
function attack() {
    if (!isAttacking(action)) {
        barbarian.stop();
                
        if (isFacingRight(oldaction)) {
            moveSpritePosition(ATTACK_RIGHT_FRAMES, ATTACK_RIGHT, ATTACK_RIGHT_OFFSET);
        } else if (isFacingLeft(oldaction)) {
            moveSpritePosition(ATTACK_LEFT_FRAMES, ATTACK_LEFT, ATTACK_LEFT_OFFSET);
        }
    }
}

/**
 * Stops the sprite and position animation. Puts the barbarian sprite in the appropriate stop position.
 *
 * @param action The current action.
 * @param previousAction The previous action. 
 * @returns The new action if the barbarian was moving, the unchanged action otherwise.
 */
function stop(action, previousAction) {
    var isRight = isMovingRight(previousAction);
    var isLeft = isMovingLeft(previousAction);
    var isMoving = isRight || isLeft;
    var newAction = action;
    if (isMoving) {

        var x = isRight ? (-1 * STOP_RIGHT_POSITION * barbarian.width()) 
                        : (-1 * STOP_LEFT_POSITION * barbarian.width());

        var y = isRight ? (-1 * STOP_RIGHT_HEIGHT_OFFSET) 
                        : -1 * STOP_LEFT_HEIGHT_OFFSET * barbarian.height();
        barbarian.css('background-position', x + 'px ' + y + 'px');
        barbarian.stop();
        newAction = isRight ? STOP_RIGHT : STOP_LEFT; 
    }
    return newAction;
}

function right() {
    if (action !== RIGHT && !shouldThrottleDirectionChange(RIGHT)) {
        barbarian.stop();
        var distance = (windowWidth - barbarian.offset().left);
        barbarian.animate({left: windowWidth + 'px'}, distance / SPRITE_PIXELS_PER_SECOND * 1000, 'linear');

        moveSpritePosition([1, 2, 3, 4, 5, 6], RIGHT, 0, 0);
    } 
}

function jump() {
    console.log('in jump');
    if (isMovingRight(action) || action == STOP_RIGHT) {
        console.log('jump right');
        barbarian.stop();
        var distance = (windowWidth - barbarian.offset().left);
        barbarian.animate({left: windowWidth + 'px'}, distance / SPRITE_PIXELS_PER_SECOND * 1000, 'linear');

        moveSpritePosition([48, 49, 50, 51, 52, 53, 54], JUMP_RIGHT, 6);
    } else if (isMovingLeft(action) || action == STOP_LEFT) {
        barbarian.stop();
        var distance = barbarian.offset().left;
        barbarian.animate({left: '0px'}, distance / SPRITE_PIXELS_PER_SECOND * 1000, 'linear');

        moveSpritePosition([62, 61, 60, 59, 58, 57, 56 ], JUMP_LEFT, 7);
    }
}

function left() {
    if (action !== LEFT && !shouldThrottleDirectionChange(LEFT)) {
        var oldLeft = barbarian.offset().left;
        barbarian.stop();
        var distance = barbarian.offset().left;
        barbarian.animate({left: '0px'}, distance / SPRITE_PIXELS_PER_SECOND * 1000, 'linear');

        moveSpritePosition([13, 12, 11, 10, 9, 8], LEFT, 1);
    }
}

function run() {
    if (!isMovingRight()) {
        barbarian.stop();
        var distance;
        if (action === LEFT || action === ATTACK_LEFT || action === STOP_LEFT) {
            distance = barbarian.offset().left;
            barbarian.animate({left: '0px'}, distance / SPRITE_PIXELS_PER_SECOND / RUN_SPEED_INCREASE_FACTOR  * 1000, 'linear');
        } else if (action == RIGHT || action === ATTACK_RIGHT || action === STOP_RIGHT) {
            distance = (windowWidth - barbarian.offset().left);
            barbarian.animate({left: windowWidth + 'px'}, distance / SPRITE_PIXELS_PER_SECOND / RUN_SPEED_INCREASE_FACTOR * 1000, 'linear');
        }
              
        if (oldaction === RIGHT || oldaction === ATTACK_RIGHT || oldaction === STOP_RIGHT) {
            moveSpritePosition([16, 17, 18, 19, 20, 21], RUN_RIGHT, 2);
        } else if (oldaction == LEFT || oldaction === ATTACK_LEFT || oldaction === STOP_LEFT) {
            moveSpritePosition([24, 25, 26, 27, 28, 29], RUN_LEFT, 3);
        }
    }
    return action;
}
