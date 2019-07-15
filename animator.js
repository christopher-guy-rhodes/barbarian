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
     * @path The path that the sprite will take.
     * @requestedAction The action requested that is assicated with the path.
     */
    async function animateSprite(path, requestedAction, requestedDirection, heightOffsetGridUnits) {
        oldaction = action;
        action = requestedAction;
        olddirection = direction;
        direction = requestedDirection;
        console.log('action:' + action + ' oldaction:' + oldaction);
        console.log('direction:' + direction + ' olddirection:' + olddirection);
        var heightOffset = heightOffsetGridUnits * barbarian.height(); 
        var index = 0;
        while(action === requestedAction && direction === requestedDirection) {
	   var windowWidth = $( document ).width() - barbarian.width();
           var position = path[index];

           barbarian.css('background-position',(-1*position*barbarian.width()) + 'px ' + -1*heightOffset + 'px');
           if (action === STOP) {
               break;
           }
           if (direction === LEFT && barbarian.offset().left === 0) {
               stop();
               break;
           }
           if (direction === RIGHT && barbarian.offset().left === windowWidth) {
               stop();
               break;
           }
           if(action === ATTACK && index >= path.length - 1 ) {
               action = STOP;
               break;
           }
           await sleep(1000/SPRITE_FPS);

           // loop the sprite animation
           if (index++ == path.length - 1) {
               index = 0;
           }
        }
    }


