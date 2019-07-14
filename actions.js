/**
 * Starts an attack to the left or right depending on the direction the barbarian is moving.
 */
function attack() {
    actionHelper(action, undefined, ATTACK_RIGHT_FRAMES, ATTACK_LEFT_FRAMES, ATTACK_RIGHT, ATTACK_LEFT, ATTACK_RIGHT_OFFSET, ATTACK_LEFT_OFFSET);
}

/**
 * Starts an jump to the left or right depending on the direction the barbarian is moving.
 */
function jump() {
    actionHelper(action, false, JUMP_RIGHT_FRAMES, JUMP_LEFT_FRAMES, JUMP_RIGHT, JUMP_LEFT, JUMP_RIGHT_OFFSET, JUMP_LEFT_OFFSET);
}

/**
 * Starts the barbarian running to the left or right depending on the direction the barbarian is moving.
 */
function run() {
    actionHelper(action, true, RUN_RIGHT_FRAMES, RUN_LEFT_FRAMES, RUN_RIGHT, RUN_LEFT, RUN_RIGHT_OFFSET, RUN_LEFT_OFFSET);
}


/**
 * Stops the sprite and position animation. Puts the barbarian sprite in the appropriate stop position.
 *
 * @param action The current action.
 * @param previousAction The previous action. 
 * @returns The new action if the barbarian was moving, the unchanged action otherwise.
 */
function stop(action, previousAction) {
    console.log('stop:' + action);
    var isRight = isFacingRight(previousAction);

    var x = isRight ? (-1 * STOP_RIGHT_POSITION * barbarian.width()) 
                    : (-1 * STOP_LEFT_POSITION * barbarian.width());

    var y = isRight ? (-1 * STOP_RIGHT_HEIGHT_OFFSET) 
                        : -1 * STOP_LEFT_HEIGHT_OFFSET * barbarian.height();
    barbarian.css('background-position', x + 'px ' + y + 'px');
    barbarian.stop();
    newAction = isRight ? STOP_RIGHT : STOP_LEFT; 
    return newAction;
}

function right() {
    if (action !== RIGHT && !shouldThrottleDirectionChange(RIGHT)) {
        barbarian.stop();
        var distance = (windowWidth - barbarian.offset().left);
        barbarian.animate({left: windowWidth + 'px'}, distance / SPRITE_PIXELS_PER_SECOND * 1000, 'linear');

        animateSprite([1, 2, 3, 4, 5, 6], RIGHT, 0, 0);
    } 
}

function left() {
    if (action !== LEFT && !shouldThrottleDirectionChange(LEFT)) {
        var oldLeft = barbarian.offset().left;
        barbarian.stop();
        var distance = barbarian.offset().left;
        barbarian.animate({left: '0px'}, distance / SPRITE_PIXELS_PER_SECOND * 1000, 'linear');

        animateSprite([13, 12, 11, 10, 9, 8], LEFT, 1);
    }
}

function actionHelper(action, isRunning, rightFrames, leftFrames, rightAction, leftAction, rightOffset, leftOffset) {
    barbarian.stop();
    console.log('action:' + action);
    var isRight = isFacingRight(action);
    if (typeof isRunning !== 'undefined') {
        isRunning ? isRight ? runRight() : runLeft()
                  : isRight ? moveRight() : moveLeft();
    }
    
    animateSprite(isRight ? rightFrames : leftFrames, isRight ? rightAction : leftAction, isRight ? rightOffset : leftOffset);
}


