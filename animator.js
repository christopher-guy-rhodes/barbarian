   dyingCache = {};

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

    async function animateSprite(sprite, opponents, requestedAction, requestedDirection, times) {
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

            var opponentsInProximity = getSpritesInProximity(sprite, opponents, sprite[SPRITE].width()*1.5);
            if (opponentsInProximity.length > 0) {
                for (var i = 0; i < opponentsInProximity.length; i++) {
                    var opponent = opponentsInProximity[i];
                    if (sprite[NAME] !== BARBARIAN_SPRITE_NAME && sprite[ACTION] !== ATTACK) {
                        // TODO: use thresholds in object
                        var proximity = getProximity(sprite, opponent);
                        console.log('proximity is:' + proximity + ' and direction is' + sprite[DIRECTION]);
                        var attack = false;
                        if (proximity > 0 && proximity < 225 && sprite[DIRECTION] === LEFT) {
                            attack = true;
                        }
                        if (attack) {
                            sprite[POSITIONS][ATTACK] = getPositionsAtAction(opponents);
                            actionHelper(sprite, opponents, ATTACK, 0);
                            break main;
                        }
                    }
                    if (true || sprite[NAME] === BARBARIAN_SPRITE_NAME) {
                        if (Object.keys(sprite[POSITIONS][ATTACK]).length > 0) {
                            var distance = sprite[POSITIONS][ATTACK][opponent[NAME]] - sprite[POSITIONS][ATTACK][sprite[NAME]];
                            console.log('sprite is:' + sprite[NAME] + ' distance is ' + distance);
                            //var keys = Object.keys(sprite[POSITIONS][ATTACK]);
                            //for (var i = 0; i < keys.length; i++) {
                            //    var key = keys[i];
                            //    console.log('sprite:' + key + ' position:' + sprite[POSITIONS][ATTACK][key]);
                            //}

                            var successfulTurnaroundAttackLeft = distance > -1*sprite[ATTACK_THRESHOLDS][TURNAROUND][MAX] &&
                                                                 distance < -1*sprite[ATTACK_THRESHOLDS][TURNAROUND][MIN] &&
                                                                 sprite[DIRECTION] === LEFT;
                            var successfulTurnaroundAttackRight = distance > sprite[ATTACK_THRESHOLDS][TURNAROUND][MIN] &&
                                                                  distance < sprite[ATTACK_THRESHOLDS][TURNAROUND][MAX] &&
                                                                  sprite[DIRECTION] === RIGHT;
                            var successfulTurnaroundAttack = successfulTurnaroundAttackLeft || successfulTurnaroundAttackRight;

                            var successfulHeadonAttackLeft = distance > -1*sprite[ATTACK_THRESHOLDS][HEADON][MAX] &&
                                                             distance < -1*sprite[ATTACK_THRESHOLDS][HEADON][MIN] &&
                                                             sprite[DIRECTION] === LEFT;
                            var successfulHeadonAttackRight = distance > sprite[ATTACK_THRESHOLDS][HEADON][MIN] &&
                                                              distance < sprite[ATTACK_THRESHOLDS][HEADON][MAX] &&
                                                              sprite[DIRECTION] === RIGHT;
                            var successfulHeadonAttack = successfulHeadonAttackLeft || successfulHeadonAttackRight;

                            if (successfulTurnaroundAttack || successfulHeadonAttack) {
                                monsterDeath(opponent);
                            }
                        }
                    } else {
                        var diff = Math.abs(sprite[SPRITE].offset().left - opponent[SPRITE].offset().left);
                        if (sprite[STATUS] === ALIVE && opponent[STATUS] === ALIVE && diff < 200) {
                            if (!dyingCache[opponent[NAME]]) {

                                var isJumpEvaided = false;
                                if (Object.keys(opponent[POSITIONS][JUMP]).length > 0) {
                                    var jumpDiff = Math.abs(opponent[POSITIONS][JUMP][opponent[NAME]] - opponent[POSITIONS][JUMP][sprite[NAME]]);
                                    if (opponent[ACTION] === JUMP && jumpDiff < 400 && jumpDiff > 240) {
                                        isJumpEvaided = true;
                                    }
                                }
                                if (!isJumpEvaided) {
                                    dyingCache[opponent[NAME]] = true;
                                    barbarianDeath(opponent);
                                }
                            }
                        }
                    }
                }
            } else {
                if (sprite[NAME] !== BARBARIAN_SPRITE_NAME) {
                    var isPassedLeft = sprite[SPRITE].offset().left + sprite[SPRITE].width()*1.5 < BARBARIAN_SPRITE[SPRITE].offset().left;
                    var isPassedRight = sprite[SPRITE].offset().left - sprite[SPRITE].width()*1.5 > BARBARIAN_SPRITE[SPRITE].offset().left;

                    if (sprite[DIRECTION] === LEFT && (isPassedLeft || sprite[SPRITE].offset().left === 0)) {
                        sprite[DIRECTION] = RIGHT;
                        actionHelper(sprite, opponents, WALK, 0);
                        break;
                    } else if (sprite[DIRECTION] === RIGHT && (isPassedRight || sprite[SPRITE].offset().left === windowWidth)) {
                        sprite[DIRECTION] = LEFT;
                        actionHelper(sprite, opponents, WALK, 0);
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

    function getProximity(sprite, opponent) {
        return sprite[SPRITE].offset().left - opponent[SPRITE].offset().left;
    }

    function monsterDeath(sprite) {
        if (!dyingCache[sprite[NAME]]) {
            sprite[STATUS] = DEAD;
            dyingCache[sprite[NAME]] = true;
            if (sprite[NAME] === BARBARIAN_SPRITE_NAME) {
                barbarianDeath(sprite);
            } else {
                setTimeout(function () {
                    animateDeath(sprite)
                }, 1800 * (1 / sprite[FPS]));
            }
        }
    }

   async function animateDeath(sprite) {


       sprite[SPRITE].stop();
       DEATH_SPRITE[SPRITE].css('left', sprite[SPRITE].offset().left - sprite[SPRITE].width()/2);
       DEATH_SPRITE[SPRITE].css('display', 'block');

       sprite[SPRITE].css('display', 'none');

       var frames = DEATH_SPRITE[FRAMES][DEATH][UP][FRAMES]
       for (var i = 0; i < frames.length; i++) {
           var position = frames[i];
           DEATH_SPRITE[SPRITE].css('background-position',-1*(position*DEATH_SPRITE[SPRITE].width()) + 'px ' + '0px');
           await sleep(1000 / DEATH_SPRITE[FPS]);
       }
       DEATH_SPRITE[SPRITE].css('display', 'none');
       dyingCache[sprite[NAME]] = false;
   }

   function barbarianDeath(sprite) {
       sprite[SPRITE].stop();
       sprite[STATUS] = DEAD;
       sprite[SPRITE].fadeOut("slow");
   }
