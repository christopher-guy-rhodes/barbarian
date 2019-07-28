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
    function moveRight() {
        var distance = (windowWidth - barbarian.offset().left);
        barbarian.animate({left: windowWidth + 'px'}, distance / SPRITE_PIXELS_PER_SECOND * 1000, 'linear');
    }

    /**
     * Move the barbarian left
     */
    function moveLeft() {
        var distance = barbarian.offset().left;
        barbarian.animate({left: '0px'}, distance / SPRITE_PIXELS_PER_SECOND * 1000, 'linear');
    }
    /**
     * Make the barbarian run right 
     */
    function runRight() {
        var distance = (windowWidth - barbarian.offset().left);
        barbarian.animate({left: windowWidth + 'px'}, distance / SPRITE_PIXELS_PER_SECOND / RUN_SPEED_INCREASE_FACTOR * 1000, 'linear');
    }

    /**
     * Make the barbarian run left 
     */
    function runLeft() {
        var distance = barbarian.offset().left;
        barbarian.animate({left: '0px'}, distance / SPRITE_PIXELS_PER_SECOND / RUN_SPEED_INCREASE_FACTOR * 1000, 'linear');
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
async function animateSprite(sprite, spriteName, path, requestedAction, requestedDirection, heightOffsetGridUnits, times = 0) {
    action[spriteName] = requestedAction;
    direction[spriteName] = requestedDirection;
    var heightOffset = heightOffsetGridUnits * barbarian.height(); 
    var index = 0;
    var iterations = times;
    while(action[spriteName] === requestedAction && direction[spriteName] === requestedDirection) {
       //console.log('action:' + action[spriteName] + ' requestedAction:' + requestedAction +  ' direction:' + direction[spriteName] + ' requestedDirection:' + requestedDirection);
       var windowWidth = $( document ).width() - barbarian.width();
       var position = path[index];

       sprite.css('background-position',(-1*position*barbarian.width()) + 'px ' + -1*heightOffset + 'px');
       if (action[spriteName] === STOP) {
           break;
       }
       if (direction[spriteName] === LEFT && sprite.offset().left === 0) {
           action[spriteName] = STOP;
           break;
       }
       if (direction[spriteName] === RIGHT && sprite.offset().left === windowWidth) {
           action[spriteName] = STOP;
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

    // jump actions might still be going on. They are the only action that moves but needs to terminate
    if (action[spriteName] === JUMP) {
        console.log('stop the barbarian!');
        barbarian.stop();
    }
}

async function animate(sprite, distance, frames, heightOffset, repeat = false, proximityStop = 0, attacking = false) {
    var index = 0;
    sprite.animate({left: (sprite.offset().left - distance) + 'px'}, distance / SPRITE_PIXELS_PER_SECOND * 1000, 'linear');
    while(true) {
        
        frame = frames[index];
        sprite.css('background-position',(-1*frame*sprite.width()) + 'px ' + -1*sprite.height()*heightOffset + 'px');
        if (proximityStop > 0 && sprite.offset().left - barbarian.offset().left < proximityStop) {
            break;
        }

        var barbarianAttackDistance = monster.offset().left - barbarian.offset().left;
        if (attacking && index == 2) { 
            if (barbarianAttackDistance < 200 && barbarianAttackTime < monsterAttackTime) {
                death.css('left', sprite.offset().left - 180); 
                sprite.css('display','none');
                death.css('display', 'block');
                await animate(death, 0, DEATH_FRAMES['FRAMES'], DEATH_FRAMES['HEIGHT_OFFSET'], false, 0, false);
                death.css('display', 'none');
                sprite.stop();
            } else {
                barbarian.css('display','none');
                barbarian.stop();
            }
        }
        if (index == frames.length - 1 && !repeat) {
            console.log('shopping');
            break;
        } else {
            console.log('not shopping');
        }
        await sleep(1000/SPRITE_FPS);
        index++;

        if (index == frames.length ) {
            index = 0;
        }
    }

    sprite.stop();

}



