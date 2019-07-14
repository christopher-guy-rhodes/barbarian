/**
 * Starts an attack to the left or right depending on the direction the barbarian is moving.
 */
function attack() {
    actionHelper(action, undefined, ATTACK_RIGHT_FRAMES, ATTACK_LEFT_FRAMES, ATTACK, ATTACK, ATTACK_RIGHT_OFFSET, ATTACK_LEFT_OFFSET);
}

/**
 * Starts an jump to the left or right depending on the direction the barbarian is moving.
 */
function jump() {
    actionHelper(action, false, JUMP_RIGHT_FRAMES, JUMP_LEFT_FRAMES, JUMP, JUMP, JUMP_RIGHT_OFFSET, JUMP_LEFT_OFFSET);
}

/**
 * Starts the barbarian running to the left or right depending on the direction the barbarian is moving.
 */
function run() {
    actionHelper(action, true, RUN_RIGHT_FRAMES, RUN_LEFT_FRAMES, RUN, RUN, RUN_RIGHT_OFFSET, RUN_LEFT_OFFSET);
}


/**
 * Stops the sprite and position animation. Puts the barbarian sprite in the appropriate stop position.
 *
 * @param action The current action.
 * @returns The new action if the barbarian was moving, the unchanged action otherwise.
 */
function stop(action) {
    var isRight = direction === RIGHT;

    var x = isRight ? (-1 * STOP_RIGHT_POSITION * barbarian.width()) 
                    : (-1 * STOP_LEFT_POSITION * barbarian.width());

    var y = isRight ? (-1 * STOP_RIGHT_HEIGHT_OFFSET) 
                        : -1 * STOP_LEFT_HEIGHT_OFFSET * barbarian.height();
    barbarian.css('background-position', x + 'px ' + y + 'px');
    barbarian.stop();
}

function right() {
    if (!shouldThrottleDirectionChange(RIGHT)) {
        barbarian.stop();
        var distance = (windowWidth - barbarian.offset().left);
        barbarian.animate({left: windowWidth + 'px'}, distance / SPRITE_PIXELS_PER_SECOND * 1000, 'linear');

        animateSprite([1, 2, 3, 4, 5, 6], WALK, RIGHT, 0);
    } 
}

function left() {
    if (!shouldThrottleDirectionChange(LEFT)) {
        var oldLeft = barbarian.offset().left;
        barbarian.stop();
        var distance = barbarian.offset().left;
        barbarian.animate({left: '0px'}, distance / SPRITE_PIXELS_PER_SECOND * 1000, 'linear');

        animateSprite([13, 12, 11, 10, 9, 8], LEFT, LEFT, 1);
    }
}

function actionHelper(action, isRunning, rightFrames, leftFrames, rightAction, leftAction, rightOffset, leftOffset) {
    barbarian.stop();
    var isRight = direction === RIGHT;
    if (typeof isRunning !== 'undefined') {
        isRunning ? isRight ? runRight() : runLeft()
                  : isRight ? moveRight() : moveLeft();
    }
    
    animateSprite(isRight ? rightFrames : leftFrames, isRight ? rightAction : leftAction, isRight ? RIGHT : LEFT, isRight ? rightOffset : leftOffset);
}
