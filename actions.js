/**
 * Starts an attack to the left or right depending on the direction the barbarian is moving.
 *
 * @param direction the direction the barbarian is moving
 */
function attack(sprite) {
    barbarianAttackTime = new Date().getTime();
    actionHelper(sprite, ATTACK_FRAMES, ATTACK, 1);
}

/**
 * Starts an jump to the left or right depending on the direction the barbarian is moving.
 *
 * @param direction the direction the barbarian is moving
 */
function jump(sprite) {
    barbarianJumpTime = new Date().getTime();
    actionHelper(sprite, JUMP_FRAMES, JUMP, 1);
}

/**
 * Starts the barbarian running to the left or right depending on the direction the barbarian is moving.
 *
 * @param direction the direction the barbarian is moving
 */
function run(sprite) {
    actionHelper(sprite, RUN_FRAMES, RUN);
}

/**
 * Starts the barbarian walking to the left or right depending on the direction the barbarian is moving.
 *
 * @param direction the direction the barbarian is moving
 */
function walk(sprite) {
    actionHelper(sprite, WALK_FRAMES, WALK);
}

/**
 * Stops the sprite and position animation. Puts the barbarian sprite in the appropriate stop position.
 *
 * @param action The current action.
 * @returns The new action if the barbarian was moving, the unchanged action otherwise.
 */
function stop(sprite) {
    var isRight = sprite['direction'] === RIGHT;

    var x = isRight ? (-1 * STOP_RIGHT_POSITION * sprite['sprite'].width())
                    : (-1 * STOP_LEFT_POSITION * sprite['sprite'].width());

    var y = isRight ? (-1 * STOP_RIGHT_HEIGHT_OFFSET)
                        : -1 * STOP_LEFT_HEIGHT_OFFSET * sprite['sprite'].height();
    sprite['sprite'].css('background-position', x + 'px ' + y + 'px');
    sprite['sprite'].stop();
}

function actionHelper(sprite, frames, requestedAction, times = 0) {
    sprite['sprite'].stop();
    var isRight = sprite['direction'] === RIGHT;
    if (requestedAction !== ATTACK) {
        (requestedAction === RUN) ? isRight ? runRight(sprite) : runLeft(sprite)
                                  : isRight ? moveRight(sprite) : moveLeft(sprite);
    }

    animateSprite(sprite, frames[sprite['direction']]['FRAMES'], requestedAction, isRight ? RIGHT : LEFT, frames[sprite['direction']]['HEIGHT_OFFSET'], times);
}
