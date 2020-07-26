/**
 * Stops the sprite and position animation. Puts the sprite in the appropriate stop position.
 *
 * @param action The current action.
 * @returns The new action if the barbarian was moving, the unchanged action otherwise.
 */
function stop(sprite) {
    var isRight = sprite[DIRECTION] === RIGHT;

    var x = isRight ? (-1 * STOP_RIGHT_POSITION * sprite[SPRITE].width())
                    : (-1 * STOP_LEFT_POSITION * sprite[SPRITE].width());

    var y = isRight ? (-1 * STOP_RIGHT_HEIGHT_OFFSET)
                        : -1 * STOP_LEFT_HEIGHT_OFFSET * sprite[SPRITE].height();
    sprite[SPRITE].css('background-position', x + 'px ' + y + 'px');
    sprite[SPRITE].stop();
}

function actionHelper(sprite, opponents, requestedAction, times = 0) {
    sprite[SPRITE].stop();
    var isRight = sprite[DIRECTION] === RIGHT;
    // TODO: barbarian doesn't move during attack but monsters do so this should probably an optional parameter
    if (requestedAction !== ATTACK) {
        (requestedAction === RUN) ? isRight ? runRight(sprite) : runLeft(sprite)
                                  : isRight ? moveRight(sprite) : moveLeft(sprite);
    }

    animateSprite(sprite,
        opponents,
        requestedAction,
        isRight ? RIGHT : LEFT,
        times);
}
