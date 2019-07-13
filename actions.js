/**
 * Starts an attack to the left or right depending on the direction the barbarian is moving.
 */
function attack() {
    barbarian.stop();
    var isRight = isFacingRight(action);
    animateSprite(isRight ? ATTACK_RIGHT_FRAMES : ATTACK_LEFT_FRAMES, isRight ?  ATTACK_RIGHT : ATTACK_LEFT, isRight ?  ATTACK_RIGHT_OFFSET : ATTACK_LEFT_OFFSET);
}

/**
 * Starts an jump to the left or right depending on the direction the barbarian is moving.
 */
function jump() {
    barbarian.stop();
    var isRight = isFacingRight(action);
    isRight ? moveRight() : moveLeft();
    animateSprite(isRight ? JUMP_RIGHT_FRAMES : JUMP_LEFT_FRAMES, isRight ? JUMP_RIGHT : JUMP_LEFT, isRight ? JUMP_RIGHT_OFFSET : JUMP_LEFT_OFFSET);
}

/**
 * Starts the barbarian running to the left or right depending on the direction the barbarian is moving.
 */
function run() {
    barbarian.stop();
    var isRight = isFacingRight(action);
    isRight ? runRight() : runLeft();
    animateSprite(isRight ? RUN_RIGHT_FRAMES : RUN_LEFT_FRAMES, isRight ? RUN_RIGHT : RUN_LEFT, isRight ? RUN_RIGHT_OFFSET : RUN_LEFT_OFFSET);
              
}


/**
 * Stops the sprite and position animation. Puts the barbarian sprite in the appropriate stop position.
 *
 * @param action The current action.
 * @param previousAction The previous action. 
 * @returns The new action if the barbarian was moving, the unchanged action otherwise.
 */
function stop(action, previousAction) {
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


