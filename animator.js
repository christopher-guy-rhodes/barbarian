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
        sprite[SPRITE].animate({left: windowWidth + 'px'}, distance / sprite[PIXELS_PER_SECOND] * 1000, 'linear');
    }

    /**
     * Move the barbarian left
     */
    function moveLeft(sprite) {
        var distance = sprite[SPRITE].offset().left;
        sprite[SPRITE].animate({left: '0px'}, distance / sprite[PIXELS_PER_SECOND] * 1000, 'linear');
    }
    /**
     * Make the barbarian run right
     */
    function runRight(sprite) {
        var distance = (windowWidth - sprite[SPRITE].offset().left);
        sprite[SPRITE].animate({left: windowWidth + 'px'}, distance / sprite[PIXELS_PER_SECOND] / RUN_SPEED_INCREASE_FACTOR * 1000, 'linear');
    }

    /**
     * Make the barbarian run left
     */
    function runLeft(sprite) {
        var distance = sprite[SPRITE].offset().left;
        sprite[SPRITE].animate({left: '0px'}, distance / sprite[PIXELS_PER_SECOND] / RUN_SPEED_INCREASE_FACTOR * 1000, 'linear');
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
        var windowWidth = $(document).width() - sprite[SPRITE].width();

        //var attack = false;
        main:
        while (sprite[ACTION] === requestedAction && sprite[DIRECTION] === requestedDirection) {

            var opponentsInProximity = getOpponentsInProximity(sprite, opponents, sprite[SPRITE].width());
            if (opponentsInProximity.length > 0) {
                for (var i = 0; i < opponentsInProximity.length; i++) {
                    opponent = opponentsInProximity[i];
                    if (sprite[NAME] === BARBARIAN_SPRITE_NAME) {
                    } else {
                        //DEATH_SPRITE[SPRITE].css('display', 'block');
                        //animateSprite(DEATH_SPRITE, [], DEATH, UP, 1);
                        //attack = true;
                        //console.log('set ' + sprite[NAME] + ' into attack mode');
                        if (sprite[ACTION] !== ATTACK) {
                            console.log(sprite[NAME] + ' launching an attack');
                            actionHelper(sprite, opponents, ATTACK);
                            break main;
                        } else {
                            //console.log(sprite[NAME] + ' is attacking ' + opponent[NAME] +  ' and proximity is ' + getProximity(sprite, opponent));
                            //console.log(sprite[NAME] + ' is attacking');
                        }
                        //sprite[ACTION] = ATTACK;
                    }
                }
            } else {
                if (sprite[NAME] !== BARBARIAN_SPRITE_NAME) {
                    var isPassedLeft = sprite[SPRITE].offset().left + sprite[SPRITE].width() < BARBARIAN_SPRITE[SPRITE].offset().left;
                    var isPassedRight = sprite[SPRITE].offset().left - sprite[SPRITE].width() > BARBARIAN_SPRITE[SPRITE].offset().left;

                    /*
                    if (sprite[DIRECTION] === LEFT && sprite[SPRITE].offset().left === 0) {
                        console.log('left:' + sprite[SPRITE].offset().left);
                        console.log('need to turn around and walk');
                        sprite[DIRECTION] = RIGHT;
                        actionHelper(sprite, opponents, WALK);
                    }

                     */
                    console.log(sprite[NAME] + ' going ' + sprite[DIRECTION] + ' left:' + sprite[SPRITE].offset().left + ' windowWidth:' + windowWidth);
                    if (sprite[DIRECTION] === LEFT && (isPassedLeft || sprite[SPRITE].offset().left === 0)) {
                        console.log(sprite[NAME] + ' turning around and walking a');
                        sprite[DIRECTION] = RIGHT;
                        actionHelper(sprite, opponents, WALK);
                        break;
                    } else if (sprite[DIRECTION] === RIGHT && (isPassedRight || sprite[SPRITE].offset().left === windowWidth)) {
                        console.log('direction right left:' + sprite[SPRITE].offset().left + ' windowWidth:' + windowWidth);
                        console.log(sprite[NAME] + ' turning around and walking b');
                        sprite[DIRECTION] = LEFT;
                        actionHelper(sprite, opponents, WALK);
                        break;
                    }

                }
            }


            var position = path[index];

            renderSpriteFrame(sprite, position, requestedAction);
            if (sprite[ACTION] === STOP) {
                break;
            }
            if (hitLeftBoundry(sprite) || hitRightBoundry(sprite)) {
                // Since we are stopping set the frame to the stop frame (1st frame when walking)
                console.log('hit boundry');
                renderSpriteFrame(sprite, 0, WALK);
                sprite[ACTION] = STOP;
                break;
            }

            await sleep(1000 / sprite[FPS]);

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

        // Action is over, reset state so the action can be repeated if desired
        if (sprite[ACTION] !== WALK && sprite[NAME] === BARBARIAN_SPRITE_NAME && sprite[ACTION] === requestedAction) {
            sprite[ACTION] = undefined;
            sprite[SPRITE].stop();
        }

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

    function getOpponentsInProximity(sprite, opponents, proximityThreshold) {
        var attackers = [];
        for (var i = 0; i < opponents.length; i++) {
            var opponent = opponents[i];
            proximity = getProximity(sprite, opponent);
            if (sprite[DIRECTION] == 'LEFT') {
                if (proximity > 0 && proximity < proximityThreshold) {
                    attackers.push(opponent);
                }
            } else {
                if (proximity < 0 && proximity > -1*proximityThreshold ) {
                    attackers.push(opponent);
                }
            }
        }
        return attackers;
    }

    function getProximity(sprite, opponent) {
        return sprite[SPRITE].offset().left - opponent[SPRITE].offset().left;
    }

   async function monsterDeath(sprite) {
       sprite[SPRITE].stop();
       DEATH_SPRITE[SPRITE].css('left', sprite[SPRITE].offset().left - sprite[SPRITE].width() / 2);
       DEATH_SPRITE[SPRITE].css('display', 'block');

       sprite[SPRITE].css('display', 'none');

       var frames = DEATH_SPRITE[FRAMES][DEATH][UP][FRAMES]
       for (var i = 0; i < frames.length; i++) {
           var position = frames[i];
           console.log('position');
           DEATH_SPRITE[SPRITE].css('background-position',-1*(position*DEATH_SPRITE[SPRITE].width()) + 'px ' + '0px');
           await sleep(1000 / DEATH_SPRITE[FPS]);
       }
       DEATH_SPRITE[SPRITE].css('display', 'none');
   }
