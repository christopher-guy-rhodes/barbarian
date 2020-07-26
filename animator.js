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
        var distance = (windowWidth - sprite['sprite'].offset().left);
        sprite['sprite'].animate({left: windowWidth + 'px'}, distance / SPRITE_PIXELS_PER_SECOND * 1000, 'linear');
    }

    /**
     * Move the barbarian left
     */
    function moveLeft(sprite) {
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
 * @path The path that the sprite will take.
 * @requestedAction The action requested that is assicated with the path.
 * @requestedDirection The direction the sprite is to move
 * @heightOffsetGridUnits the height offset for the sprite
 */
async function animateSprite(sprite, path, requestedAction, requestedDirection, heightOffsetGridUnits, times = 0) {
    action[sprite['name']] = requestedAction;
    direction[sprite['name']] = requestedDirection;
    var heightOffset = heightOffsetGridUnits * sprite['sprite'].height();
    var index = 0;
    var iterations = times;
    console.log('action ' + sprite['name'] + ' = ' + action[sprite['name']] + ' requested action = ' + requestedAction);
    console.log('direction ' + sprite['name'] + ' = ' + direction[sprite['name']] + ' requested direct = ' + requestedDirection);
    while(action[sprite['name']] === requestedAction && direction[sprite['name']] === requestedDirection) {
       var windowWidth = $( document ).width() - sprite['sprite'].width();
       var position = path[index];

       sprite['sprite'].css('background-position',(-1*position*sprite['sprite'].width()) + 'px ' + -1*heightOffset + 'px');
       if (action[sprite['name']] === STOP) {
           break;
       }
       if (direction[sprite['name']] === LEFT && sprite['sprite'].offset().left === 0) {
           action[sprite['name']] = STOP;
           break;
       }
       if (direction[sprite['name']] === RIGHT && sprite['sprite'].offset().left === windowWidth) {
           console.log('direction is ' + direction[sprite['name']]);
           action[sprite['name']] = STOP;
           break;
       }
       await sleep(1000/SPRITE_FPS);

       // loop the sprite animation
       index++;
       if (index == path.length) {
           if (times < 1 || --iterations > 0) {
               index = 0;
           } else {
               console.log('d');
               break;
           }
       }
    }

    // if we reach this point it means it was a terminating sprite animation, stop the movement if a new action has not
    // been started and reset the action so it can be repeated if desired. An exception is walking where a direction
    // change should not stop motion.
    if (action[sprite['name']] !== WALK && action[sprite['name']] === requestedAction) {
        action[sprite['name']] = undefined;
        sprite['sprite'].stop();
    }
}
