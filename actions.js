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

function actionHelper(sprite, opponents, requestedAction, times) {
    sprite[SPRITE].stop();

    if (sprite[NAME] !== BARBARIAN_SPRITE_NAME) {
        move(sprite, requestedAction);
    } else if (requestedAction !== ATTACK || sprite[HAS_MOVING_ATTACK]) {
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
    (requestedAction === RUN) ? isRight ? runRight(sprite) : runLeft(sprite)
                              : isRight ? moveRight(sprite) : moveLeft(sprite);
}
