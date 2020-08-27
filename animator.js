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
        var path = sprite[FRAMES][requestedAction][sprite[DIRECTION]][FRAMES];

        sprite[ACTION] = requestedAction;
        sprite[DIRECTION] = requestedDirection;

        var index = 0;
        var windowWidth = $(document).width() - sprite[SPRITE].width();

        var stopSpriteAnimation = false;
        main:
        while (sprite[ACTION] === requestedAction && sprite[DIRECTION] === requestedDirection) {

            if (sprite[STATUS] === DEAD) {
                setTimeout(function () {
                    stopSpriteAnimation = true;
                }, 1800 * (1 / sprite[FPS]));
            }
            if (stopSpriteAnimation) {
                break;
            }
            var opponentsInProximity = getSpritesInProximity(sprite, opponents, sprite[SPRITE].width()*1.5);
            if (opponentsInProximity.length > 0) {
                for (var i = 0; i < opponentsInProximity.length; i++) {
                    var opponent = opponentsInProximity[i];
                    if (sprite[NAME] !== BARBARIAN_SPRITE_NAME && sprite[ACTION] !== ATTACK) {
                        // TODO: use thresholds in object
                        var proximity = Math.abs(getProximity(sprite, opponent));
                        if (proximity > 0 && proximity < 300) {
                            sprite[POSITIONS][ATTACK] = getPositionsAtAction(opponents);
                            actionHelper(sprite, opponents, ATTACK, 0);
                            break main;

                        }
                    }
                    if (Object.keys(sprite[POSITIONS][ATTACK]).length > 0) {
                        var distance = sprite[POSITIONS][ATTACK][opponent[NAME]] - sprite[POSITIONS][ATTACK][sprite[NAME]];

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

                        var isJumpEvaided = false;
                        if (opponent[POSITIONS][JUMP] && Object.keys(opponent[POSITIONS][JUMP]).length > 0) {
                            var jumpDiff = Math.abs(opponent[POSITIONS][JUMP][opponent[NAME]] - opponent[POSITIONS][JUMP][sprite[NAME]]);
                            if (opponent[ACTION] === JUMP && jumpDiff < 400 && jumpDiff > 240) {
                                isJumpEvaided = true;
                            }
                        }

                        if (opponent[STATUS] !== DEAD && !isJumpEvaided && (successfulTurnaroundAttack || successfulHeadonAttack)) {
                            death(opponent);
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
                    } else if (sprite[DIRECTION] === RIGHT && (isPassedRight || sprite[SPRITE].offset().left === $(document).width() - sprite[SPRITE].width())) {
                        sprite[DIRECTION] = LEFT;
                        actionHelper(sprite, opponents, WALK, 0);
                        break;
                    }

                }
            }


            var position = path[index];

            renderSpriteFrame(sprite, requestedAction, position);
            if (sprite[ACTION] === STOP) {
                break;
            }
            if (hitLeftBoundry(sprite) || hitRightBoundry(sprite)) {
                // Since we are stopping set the frame to the stop frame (1st frame when walking)
                renderSpriteFrame(sprite, WALK, 0);
                sprite[ACTION] = STOP;
                break;
            }

            await sleep(1000 / sprite[FPS]);

            // loop the sprite animation
            index++;
            if (index == path.length) {
                if (times < 1 || --times > 0) {
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

    function renderSpriteFrame(sprite, requestedAction, position) {
        var heightOffsetGridUnits = sprite[FRAMES][requestedAction][sprite[DIRECTION]][HEIGHT_OFFSET];
        var heightOffset = heightOffsetGridUnits * sprite[SPRITE].height();
        sprite[SPRITE].css('background-position',(-1*position*sprite[SPRITE].width()) + 'px ' + -1*heightOffset + 'px');
    }

    function renderDeathSpriteFrame(sprite, position) {
        var heightOffset = sprite[DEATH][ANIMATION][sprite[DIRECTION]][HEIGHT_OFFSET] * sprite[DEATH][SPRITE].height();
        sprite[DEATH][SPRITE].css('background-position',(-1*position*sprite[DEATH][SPRITE].width()) + 'px ' + -1*heightOffset + 'px');
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

    function death(sprite) {
        console.log('==> death an action is ' + sprite[ACTION]);
        sprite[STATUS] = DEAD;
        setTimeout(function () {
            animateDeath(sprite)
        }, 1800 * (1 / sprite[FPS]));
    }

   async function animateDeath(sprite) {

       sprite[SPRITE].stop();
       sprite[STATUS] = DEAD;

       if (sprite[NAME] !== BARBARIAN_SPRITE_NAME) {
           sprite[DEATH][SPRITE].css('left', sprite[SPRITE].offset().left - sprite[SPRITE].width() / 2);
           sprite[DEATH][SPRITE].css('display', 'block');
           sprite[SPRITE].css('display', 'none');
       }

       var direction = sprite[DIRECTION];
       var frames = sprite[DEATH][ANIMATION];
       for (var i = 0; i < frames[direction][FRAMES].length; i++) {
           var position = frames[direction][FRAMES][i];
           renderDeathSpriteFrame(sprite, position);
           await sleep(1000 / sprite[DEATH][ANIMATION][FPS]);
       }

       if (sprite[NAME] !== BARBARIAN_SPRITE_NAME) {
           sprite[DEATH][SPRITE].css('display', 'none');
       }
   }
