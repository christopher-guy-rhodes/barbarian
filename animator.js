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
        var distance = windowWidth - sprite['sprite'].offset().left;
        sprite['sprite'].animate({left: windowWidth + 'px'}, distance / SPRITE_PIXELS_PER_SECOND * 1000, 'linear');
    }

    /**
     * Move the barbarian left
     */
    function moveLeft(sprite) {
        console.log('moving ' + sprite['name'] + ' left');
        var distance = sprite['sprite'].offset().left;
        sprite['sprite'].animate({left: '0px'}, distance / SPRITE_PIXELS_PER_SECOND * 1000, 'linear');
    }
    /**
     * Make the barbarian run right
     */
    function runRight(sprite) {
        var distance = (windowWidth - sprite['sprite'].offset().left);
        sprite['sprite'].animate({left: windowWidth + 'px'}, distance / SPRITE_PIXELS_PER_SECOND / RUN_SPEED_INCREASE_FACTOR * 1000, 'linear');
    }

    /**
     * Make the barbarian run left
     */
    function runLeft(sprite) {
        var distance = sprite['sprite'].offset().left;
        sprite['sprite'].animate({left: '0px'}, distance / SPRITE_PIXELS_PER_SECOND / RUN_SPEED_INCREASE_FACTOR * 1000, 'linear');
    }

/**
 * This method animates the position of the spite according to the path provided.
 *
 * @sprite The sprite to animate
 * @requestedAction The action requested that is assicated with the path.
 * @requestedDirection The direction the sprite is to move
 */
async function animateSprite(sprite, requestedAction, requestedDirection, times = 0) {
    var frames = sprite['frames'][requestedAction];
    var path = frames[sprite['direction']]['FRAMES'];
    var heightOffsetGridUnits = frames[sprite['direction']]['HEIGHT_OFFSET'];

    sprite['action'] = requestedAction;
    sprite['direction'] = requestedDirection;

    var heightOffset = heightOffsetGridUnits * sprite['sprite'].height();
    var index = 0;
    var iterations = times;
    var windowWidth = $( document ).width() - sprite['sprite'].width();

    while(sprite['action'] === requestedAction && sprite['direction'] === requestedDirection) {
       var position = path[index];

       renderSpriteFrame(sprite, position, requestedAction);
       if (sprite['action'] === STOP) {
           break;
       }
       if (hitLeftBoundry(sprite) || hitRightBoundry(sprite)) {
           // Since we are stopping set the frame to the stop frame (1st frame when walking)
           renderSpriteFrame(sprite, 0, WALK);
           sprite['action'] = STOP;
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
    if (sprite['action'] === requestedAction) {
        sprite['action'] = undefined;
        sprite['sprite'].stop();
    }

    function renderSpriteFrame(sprite, position, requestedAction) {
        console.log('render sprite frame requested action is ' + requestedAction);
        var frames = sprite['frames'][requestedAction];
        var heightOffsetGridUnits = frames[sprite['direction']]['HEIGHT_OFFSET'];
        var heightOffset = heightOffsetGridUnits * sprite['sprite'].height();
        sprite['sprite'].css('background-position',(-1*position*sprite['sprite'].width()) + 'px ' + -1*heightOffset + 'px');
    }

    function hitLeftBoundry(sprite) {
        return sprite['direction'] === LEFT && sprite['sprite'].offset().left === 0;
    }

    function hitRightBoundry(sprite) {
        return sprite['direction'] === RIGHT && sprite['sprite'].offset().left === windowWidth;
    }
}
