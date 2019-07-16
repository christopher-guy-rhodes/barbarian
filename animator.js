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
     @ @heightOffsetGridUnits the height offset for the sprite
     */
    async function animateSprite(sprite, spriteName, path, requestedAction, requestedDirection, heightOffsetGridUnits, terminate = false) {
        action[spriteName] = requestedAction;
        direction[spriteName] = requestedDirection;
        var heightOffset = heightOffsetGridUnits * barbarian.height(); 
        var index = 0;
        console.log('action:' + action[spriteName] + ' requestedAction:' + requestedAction +  ' direction:' + direction[spriteName] + ' requestedDirection:' + requestedDirection);
        while(action[spriteName] === requestedAction && direction[spriteName] === requestedDirection) {
           console.log('action:' + action[spriteName] + ' requestedAction:' + requestedAction +  ' direction:' + direction[spriteName] + ' requestedDirection:' + requestedDirection);
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
           if (index++ == path.length) {
               if (terminate === true) {
                   break;
               } else {
                   index = 0;
               }
           } 
        }
        console.log('broke out sprite:' + spriteName + ' action:' + action[spriteName] + ' ' + direction[spriteName]);
    }


