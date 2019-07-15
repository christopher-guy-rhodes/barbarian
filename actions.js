/**
 * Starts an attack to the left or right depending on the direction the barbarian is moving.
 *
 * @param direction the direction the barbarian is moving
 */
function attack(direction) {
    actionHelper(direction, undefined, ATTACK_FRAMES, ATTACK);
}

/**
 * Starts an jump to the left or right depending on the direction the barbarian is moving.
 *
 * @param direction the direction the barbarian is moving
 */
function jump(direction) {
    actionHelper(direction, false, JUMP_FRAMES, JUMP);
}

/**
 * Starts the barbarian running to the left or right depending on the direction the barbarian is moving.
 *
 * @param direction the direction the barbarian is moving
 */
function run(direction) {
    actionHelper(direction, true, RUN_FRAMES, RUN);
}

/**
 * Starts the barbarian walking to the left or right depending on the direction the barbarian is moving.
 *
 * @param direction the direction the barbarian is moving
 */
function walk(direction) {
    actionHelper(direction, false, WALK_FRAMES, WALK);
}

/**
 * Stops the sprite and position animation. Puts the barbarian sprite in the appropriate stop position.
 *
 * @param action The current action.
 * @returns The new action if the barbarian was moving, the unchanged action otherwise.
 */
function stop(direction) {
    var isRight = direction === RIGHT;

    var x = isRight ? (-1 * STOP_RIGHT_POSITION * barbarian.width()) 
                    : (-1 * STOP_LEFT_POSITION * barbarian.width());

    var y = isRight ? (-1 * STOP_RIGHT_HEIGHT_OFFSET) 
                        : -1 * STOP_LEFT_HEIGHT_OFFSET * barbarian.height();
    barbarian.css('background-position', x + 'px ' + y + 'px');
    barbarian.stop();
}

function actionHelper(direction, isRunning, frames, requestedAction) {
    barbarian.stop();
    var isRight = direction === RIGHT;
    if (typeof isRunning !== 'undefined') {
        isRunning ? isRight ? runRight() : runLeft()
                  : isRight ? moveRight() : moveLeft();
    }
    
    animateSprite(barbarian, 'barbarian',  frames[direction]['FRAMES'], requestedAction, isRight ? RIGHT : LEFT, frames[direction]['HEIGHT_OFFSET']);
}
