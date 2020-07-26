/**
 * Starts an attack to the left or right depending on the direction the barbarian is moving.
 *
 * @param direction the direction the barbarian is moving
 */
function attack(sprite, direction) {
    barbarianAttackTime = new Date().getTime();
    actionHelper(sprite, direction, undefined, ATTACK_FRAMES, ATTACK, 1);
}

/**
 * Starts an jump to the left or right depending on the direction the barbarian is moving.
 *
 * @param direction the direction the barbarian is moving
 */
function jump(sprite, direction) {
    barbarianJumpTime = new Date().getTime();
    actionHelper(sprite, direction, false, JUMP_FRAMES, JUMP, 1);
}

/**
 * Starts the barbarian running to the left or right depending on the direction the barbarian is moving.
 *
 * @param direction the direction the barbarian is moving
 */
function run(sprite, direction) {
    actionHelper(sprite, direction, true, RUN_FRAMES, RUN);
}

/**
 * Starts the barbarian walking to the left or right depending on the direction the barbarian is moving.
 *
 * @param direction the direction the barbarian is moving
 */
function walk(sprite, direction) {
    actionHelper(sprite, direction, false, WALK_FRAMES, WALK);
}

/**
 * Stops the sprite and position animation. Puts the barbarian sprite in the appropriate stop position.
 *
 * @param action The current action.
 * @returns The new action if the barbarian was moving, the unchanged action otherwise.
 */
function stop(sprite, direction) {
    var isRight = direction === RIGHT;

    var x = isRight ? (-1 * STOP_RIGHT_POSITION * sprite['sprite'].width())
                    : (-1 * STOP_LEFT_POSITION * sprite['sprite'].width());

    var y = isRight ? (-1 * STOP_RIGHT_HEIGHT_OFFSET)
                        : -1 * STOP_LEFT_HEIGHT_OFFSET * sprite['sprite'].height();
    sprite['sprite'].css('background-position', x + 'px ' + y + 'px');
    sprite['sprite'].stop();
}

function actionHelper(sprite, direction, isRunning, frames, requestedAction, times = 0) {
    sprite['sprite'].stop();
    var isRight = direction === RIGHT;
    if (typeof isRunning !== 'undefined') {
        isRunning ? isRight ? runRight(sprite) : runLeft(sprite)
                  : isRight ? moveRight(sprite) : moveLeft(sprite);
    }

    animateSprite(sprite, frames[direction]['FRAMES'], requestedAction, isRight ? RIGHT : LEFT, frames[direction]['HEIGHT_OFFSET'], times);
}
