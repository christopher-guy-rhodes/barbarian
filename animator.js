   /**
     * Sleep helper method used to achieve desired frames per second for position change.
     *
     * @param ms The number of milliseconds to sleep.
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    /**
     * Move the barbarian right
     */
    function moveRight(sprite) {
        var distance = windowWidth - sprite[SPRITE].offset().left;
        sprite[SPRITE].animate({left: windowWidth + 'px'}, distance / SPRITE_PIXELS_PER_SECOND * 1000, 'linear');
    }

    /**
     * Move the barbarian left
     */
    function moveLeft(sprite) {
        var distance = sprite[SPRITE].offset().left;
        sprite[SPRITE].animate({left: '0px'}, distance / SPRITE_PIXELS_PER_SECOND * 1000, 'linear');
    }
    /**
     * Make the barbarian run right
     */
    function runRight(sprite) {
        var distance = (windowWidth - sprite[SPRITE].offset().left);
        sprite[SPRITE].animate({left: windowWidth + 'px'}, distance / SPRITE_PIXELS_PER_SECOND / RUN_SPEED_INCREASE_FACTOR * 1000, 'linear');
    }

    /**
     * Make the barbarian run left
     */
    function runLeft(sprite) {
        var distance = sprite[SPRITE].offset().left;
        sprite[SPRITE].animate({left: '0px'}, distance / SPRITE_PIXELS_PER_SECOND / RUN_SPEED_INCREASE_FACTOR * 1000, 'linear');
    }

/**
 * This method animates the position of the spite according to the path provided.
 *
 * @sprite The sprite to animate
 * @requestedAction The action requested that is assicated with the path.
 * @requestedDirection The direction the sprite is to move
 */
async function animateSprite(sprite, opponents, requestedAction, requestedDirection, times = 0) {
    var frames = sprite[FRAMES][requestedAction];
    var path = frames[sprite[DIRECTION]][FRAMES];
    var heightOffsetGridUnits = frames[sprite[DIRECTION]][HEIGHT_OFFSET];

    sprite[ACTION] = requestedAction;
    sprite[DIRECTION] = requestedDirection;

    var heightOffset = heightOffsetGridUnits * sprite[SPRITE].height();
    var index = 0;
    var iterations = times;
    var windowWidth = $( document ).width() - sprite[SPRITE].width();

    while(sprite[ACTION] === requestedAction && sprite[DIRECTION] === requestedDirection) {


        if (isFighting(sprite, opponents)) {
        }

        var position = path[index];

        renderSpriteFrame(sprite, position, requestedAction);
        if (sprite[ACTION] === STOP) {
            break;
        }
        if (hitLeftBoundry(sprite) || hitRightBoundry(sprite)) {
            // Since we are stopping set the frame to the stop frame (1st frame when walking)
            renderSpriteFrame(sprite, 0, WALK);
            sprite[ACTION] = STOP;
            break;
        }
        await sleep(1000/SPRITE_FPS);

        // loop the sprite animation
        index++;
        if (index == path.length) {
            if (times < 1 || --iterations > 0) {
                index = 0;
            } else {
                break;
            }
        }
    }

    // if we reach this point it means it was a terminating sprite animation, stop the movement if a new action has not
    // been started and reset the action so it can be repeated if desired. An exception is walking where a direction
    // change should not stop motion.
    if (sprite[ACTION] === requestedAction) {
        sprite[ACTION] = undefined;
        sprite[SPRITE].stop();
    }

    function renderSpriteFrame(sprite, position, requestedAction) {
        var frames = sprite[FRAMES][requestedAction];
        var heightOffsetGridUnits = frames[sprite[DIRECTION]][HEIGHT_OFFSET];
        var heightOffset = heightOffsetGridUnits * sprite[SPRITE].height();
        sprite[SPRITE].css('background-position',(-1*position*sprite[SPRITE].width()) + 'px ' + -1*heightOffset + 'px');
    }

    function hitLeftBoundry(sprite) {
        return sprite[DIRECTION] === LEFT && sprite[SPRITE].offset().left === 0;
    }

    function hitRightBoundry(sprite) {
        return sprite[DIRECTION] === RIGHT && sprite[SPRITE].offset().left === windowWidth;
    }

    function isFighting(sprite, opponents) {
        for (i = 0; i < opponents.length; i++) {
            var opponent = opponents[i];
            var proximity = Math.abs(sprite[SPRITE].offset().left - opponent[SPRITE].offset().left);
            //console.log('proximity:' + proximity);
            if (proximity < sprite[SPRITE].width()) {
                console.log(sprite[NAME] + 'is fighting opponent ' + opponent[NAME] + '!!');
            } else {
                console.log(sprite[NAME] + ' is not fighting');
            }
        }
    }
}
