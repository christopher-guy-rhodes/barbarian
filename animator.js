   /**
     * Sleep helper method used to achieve desired frames per second for position change.
     *
     * @param ms The number of milliseconds to sleep.
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * This method animates the position of the spite according to the path provided.
     *
     * @path The path that the sprite will take.
     * @requestedAction The action requested that is assicated with the path.
     */
    async function moveSpritePosition(path, requestedAction, heightOffsetGridUnits) {
        action = requestedAction;
        var heightOffset = heightOffsetGridUnits * barbarian.height(); 
        var index = 0;
        while(action === requestedAction) {
	   var windowWidth = $( document ).width() - barbarian.width();
           var position = path[index];

           barbarian.css('background-position',(-1*position*barbarian.width()) + 'px ' + -1*heightOffset + 'px');
           if (action === STOP_RIGHT || action === STOP_LEFT) {
               break;
           }
           if ((action === LEFT || action === RUN_LEFT) && barbarian.offset().left === 0) {
               break;
           }
           if ((action === RIGHT || action === RUN_RIGHT) && barbarian.offset().left === windowWidth) {
               break;
           }
           if((action === ATTACK_RIGHT || action === ATTACK_LEFT) && index >= path.length - 1 ) {
               if (action === ATTACK_RIGHT) {
                   action = STOP_RIGHT;
               } else if (action === ATTACK_LEFT) {
                   action = STOP_LEFT;
               }
               break;
           }
           if((action === JUMP_RIGHT || action === JUMP_LEFT) && index >= path.length - 1 ) {
               console.log('a');
               if (action === JUMP_RIGHT) {
                   action = STOP_RIGHT;
               } else if (action === JUMP_LEFT) {
                   action = STOP_LEFT;
               }
               barbarian.stop();
               break;
           }
           await sleep(1000/SPRITE_FPS);

           // loop the sprite animation
           if (index++ == path.length - 1) {
               index = 0;
           }
        }
    }


