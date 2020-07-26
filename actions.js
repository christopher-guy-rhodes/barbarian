/**
 * Stops the sprite and position animation. Puts the sprite in the appropriate stop position.
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

function actionHelper(sprite, requestedAction, times = 0) {
    sprite['sprite'].stop();
    var isRight = sprite['direction'] === RIGHT;
    if (requestedAction !== ATTACK) {
        (requestedAction === RUN) ? isRight ? runRight(sprite) : runLeft(sprite)
                                  : isRight ? moveRight(sprite) : moveLeft(sprite);
    }

    var frames = sprite['frames'][requestedAction];
    animateSprite(sprite,
        frames[sprite['direction']]['FRAMES'],
        requestedAction,
        isRight ? RIGHT : LEFT,
        frames[sprite['direction']]['HEIGHT_OFFSET'],
        times);
}
