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

    function isSuccessfulAttack(sprite, opponent) {
        var distance = sprite[POSITIONS][ATTACK][opponent[NAME]] - sprite[POSITIONS][ATTACK][sprite[NAME]];

        var thresholds = sprite[ATTACK_THRESHOLDS];
        var successful = false;
        for (var i = 0; i < thresholds.length; i++) {
            var successfulTurnaround = sprite[DIRECTION] === LEFT &&
                -1*thresholds[i][MIN] > distance &&
                -1*thresholds[i][MAX] < distance;
            var successfulHeadon = sprite[DIRECTION] === RIGHT &&
                thresholds[i][MIN] < distance &&
                thresholds[i][MAX] > distance ;
            if (successfulTurnaround || successfulHeadon) {
                successful = true;
                break;
            }
        }
        return successful;
    }

    function launchMonsterAttack(sprite, opponent, opponents) {
        if (sprite[NAME] !== BARBARIAN_SPRITE_NAME && sprite[ACTION] !== ATTACK) {
            var proximity = Math.abs(getProximity(sprite, opponent));
            if (proximity > 0 && proximity < ATTACK_PROXIMITY) {
                sprite[POSITIONS][ATTACK] = getPositionsAtAction(opponents);
                actionHelper(sprite, opponents, ATTACK, 0);
                return true;
            }
        }
        return false;
    }

    function hasAttacked(sprite) {
        return Object.keys(sprite[POSITIONS][ATTACK]).length > 0;
    }

    function hasJumpEvaded(sprite, opponent) {
        var isJumpEvaided = false;
        if (opponent[POSITIONS][JUMP] && Object.keys(opponent[POSITIONS][JUMP]).length > 0) {
            var jumpDiff = Math.abs(opponent[POSITIONS][JUMP][opponent[NAME]] - opponent[POSITIONS][JUMP][sprite[NAME]]);
            if (opponent[ACTION] === JUMP && jumpDiff < 400 && jumpDiff > 240) {
                isJumpEvaided = true;
            }
        }
        return isJumpEvaided;
    }

    function areBothAlive(sprite, opponent) {
        return opponent[STATUS] !== DEAD && sprite[STATUS] !== DEAD;
    }

    function getDeathDelay(sprite, opponent) {
        var delay;
        var spritePixelsPerSecond = sprite[PIXELS_PER_SECOND];
        if (sprite[ACTION] === STOP || (sprite[ACTION] === ATTACK && !sprite[HAS_MOVING_ATTACK])) {
            spritePixelsPerSecond = 0;

        } else if (sprite[ACTION] === RUN) {
            spritePixelsPerSecond = spritePixelsPerSecond * RUN_SPEED_INCREASE_FACTOR;
        }
        var opponentPixelsPerSecond = opponent[PIXELS_PER_SECOND];
        if (opponent[ACTION] === STOP || (opponent[ACTION] === ATTACK && !opponent[HAS_MOVING_ATTACK])) {
            opponentPixelsPerSecond = 0;
        } else if (opponent[ACTION] === RUN) {
            opponentPixelsPerSecond = opponentPixelsPerSecond * RUN_SPEED_INCREASE_FACTOR;
        }
        var separation = Math.abs(sprite[SPRITE].offset().left - opponent[SPRITE].offset().left);
        if (sprite[DIRECTION] === opponent[DIRECTION]) {
            console.log('instant death because they are going in the same direction');
            delay = 2000;
        } else {
            console.log(sprite[NAME] + ' pps:' + spritePixelsPerSecond + ' ' + opponent[NAME] + ' pps:' + opponentPixelsPerSecond);
            var relativePps = opponentPixelsPerSecond + spritePixelsPerSecond;
            var delay = (separation / relativePps) * 1000;
            delay = 2000 + delay;
            console.log('==> relative pps: ' + relativePps  + ' separation:' + separation + ' delay:' + delay);
        }
        return delay;
    }

    function monsterTurnaround(sprite, opponents) {
        var turned = false;
        if (sprite[NAME] !== BARBARIAN_SPRITE_NAME) {
            var isPassedLeft = sprite[SPRITE].offset().left + sprite[SPRITE].width()*1.5 < BARBARIAN_SPRITE[SPRITE].offset().left;
            var isPassedRight = sprite[SPRITE].offset().left - sprite[SPRITE].width()*1.5 > BARBARIAN_SPRITE[SPRITE].offset().left;

            if (sprite[DIRECTION] === LEFT && (isPassedLeft || sprite[SPRITE].offset().left === 0)) {
                sprite[DIRECTION] = RIGHT;
                actionHelper(sprite, opponents, WALK, 0);
                turned = true;
            } else if (sprite[DIRECTION] === RIGHT && (isPassedRight
                || sprite[SPRITE].offset().left === $(document).width() - sprite[SPRITE].width())) {
                sprite[DIRECTION] = LEFT;
                actionHelper(sprite, opponents, WALK, 0);
                turned = true;
            }

        }

    }

    function opponentDefeated(sprite, opponent) {
        return hasAttacked(sprite) &&
        !hasJumpEvaded(sprite, opponent) &&
        areBothAlive(sprite, opponent) &&
        isSuccessfulAttack(sprite, opponent);
    }

    function fightSequence(sprite, opponents) {
        var opponentsInProximity = getSpritesInProximity(sprite, opponents, sprite[SPRITE].width()*1.5);

        for (var i = 0; i < opponentsInProximity.length; i++) {
            var opponent = opponentsInProximity[i];
            if (launchMonsterAttack(sprite, opponent, opponents)) {
                return true;
            }
            if (opponentDefeated(sprite, opponent)) {
                opponent[DEATH][DELAY] = getDeathDelay(sprite, opponent);
                death(opponent);
            }
        }
        return false;
    }

    function hitBoundry(sprite) {
        if (hitLeftBoundry(sprite) || hitRightBoundry(sprite)) {
            // Since we are stopping set the frame to the stop frame (1st frame when walking)
            renderSpriteFrame(sprite, WALK, 0);
            sprite[ACTION] = STOP;
            return true;
        }
        return false;
    }

    async function animateSprite(sprite, opponents, requestedAction, requestedDirection, times) {
        var path = sprite[FRAMES][requestedAction][sprite[DIRECTION]][FRAMES];

        sprite[ACTION] = requestedAction;
        sprite[DIRECTION] = requestedDirection;

        var index = 0;
        var fightOver = false;

        while (sprite[ACTION] === requestedAction && sprite[DIRECTION] === requestedDirection) {

            // If the sprite has been killed delay stopping the animation to let the action sequence complete
            if (sprite[STATUS] === DEAD) {
                setTimeout(function () {
                    fightOver = true;
                }, sprite[DEATH][DELAY] * (1 / sprite[FPS]));
            }
            if(fightOver || fightSequence(sprite, opponents) || monsterTurnaround(sprite, opponents)) {
                break;
            }

            var position = path[index];
            renderSpriteFrame(sprite, requestedAction, position);
            if (sprite[ACTION] === STOP || hitBoundry(sprite)) {
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
        }, sprite[DEATH][DELAY] * (1 / sprite[FPS]));
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
