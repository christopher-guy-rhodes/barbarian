class Animator {
    /**
     * Construct a character animator.
     * @param character the character to animate
     */
    constructor(character) {
        validateRequiredParams(this.constructor, arguments, 'character');
        this.character = character;
        this.movementComplete = false;
    }

    /**
     * Move the character across the game board while also animating the character's sprite.
     *
     * @param gameBoard the game board to perform the animation on
     * @param sounds the sounds object
     * @param action the requested action (run, walk, attack etc.)
     * @param direction the requested direction to move the character (left or right)
     * @param vertDirection the requested vertical direction to move the character (up or down)
     * @param numberOfTimes the number of times to perform the animation loop (zero for infinite)
     * @param frameIdx the frame index offset
     * @param uninterruptable set to run thru the animation without interrupting it
     * @returns {Promise<number>} the frame for the action and direction that the animation stopped on
     */
    async animate(gameBoard, sounds, action, direction, vertDirection, numberOfTimes, frameIdx, uninterruptable) {
        validateRequiredParams(this.animate, arguments, 'gameBoard', 'action', 'direction', 'numberOfTimes',
            'frameIdx');

        this.moveCharacter(action, gameBoard);

        let frames = this.character.getProperties().getFrames(action, direction);
        let counter = numberOfTimes;

        this.character.setCurrentFrameIndex(action, frameIdx);
        this.character.setCurrentFrame(action, frames[frameIdx]);

        while (uninterruptable || !this.isAnimationInterrupted(action,
            direction,
            vertDirection,
            gameBoard,
            frames[frameIdx]) && frameIdx < frames.length) {
            let sprite = this.prepareSprite();
            let direction = this.character.getHorizontalDirection();
            let heightOffset = -1 * this.character.getProperties().getFrameHeightOffset(
                action, direction) * sprite.height();
            let offset = -1 * frames[frameIdx] * sprite.width();

            // Useful for debugging, will visually render targets
            //this.renderFrameTarget(action, direction, sprite, frames[frameIdx]);

            this.handleSound(frameIdx, sounds);

            frameIdx++;

            sprite.css(CSS_BACKGROUND_POSITION, offset + CSS_PX_LABEL + ' ' + heightOffset + CSS_PX_LABEL);

            if (frames[frameIdx] !== undefined) {
                this.character.setCurrentFrameIndex(action, frameIdx);
                this.character.setCurrentFrame(action, frames[frameIdx]);
            }

            await sleep(MILLISECONDS_PER_SECOND / this.character.getProperties().getFramesPerSecond(action));

            if (frameIdx === frames.length) {
                // If counter is 0 loop infinitely otherwise loop again if counter has not expired
                if (counter === 0 || --counter > 0) {
                    frameIdx = 0;
                    this.character.setCurrentFrameIndex(action, frameIdx);
                    this.character.setCurrentFrame(action, frames[frameIdx]);
                }
            }
        }

        // uncomment to see why animation stopped for debugging
        //this.debugAnimationTermination(this.character.getProperties().getType(), action, direction, vertDirection,
        //    gameBoard, frameIdx, frames);

        return frames[frameIdx];
    }

    /**
     * Stop the movement of the sprite.
     */
    stopMovement() {
        this.character.getProperties().getSprite().stop();
    }

    /**
     * Moves a character from it's current position to the new x, y coordinate on the plane.
     * @param character the character to move to move
     * @param x the x coordinate to move to
     * @param y the y coordinate to move to
     * @param pixelsPerSecond the rate at which to move
     */
    moveElementToPosition(x, y, pixelsPerSecond) {
        if (pixelsPerSecond <= 0) {
            return;
        }
        let element = this.character.getProperties().getSprite();
        let distanceX = x === undefined ? 0 : Math.abs(x - element.offset().left);
        let distanceY = y === undefined ? 0 : Math.abs(y - stripPxSuffix(element.css(CSS_BOTTOM_LABEL)));
        let distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
        let duration = distance / pixelsPerSecond * MILLISECONDS_PER_SECOND;

        this.moveToPosition(duration, x, y);
    }

    /**
     * Typically sprite movements do not complete since they get interrupted by another movement. An exception to this
     * is when a character hits a boundary and in that scenario the movementComplete flag is set. This method allows
     * that flag to be set manually.
     */
    setIsMovementComplete(flag) {
        this.movementComplete = flag;
    }

    /**
     * Typically sprite movements do not complete since they get interrupted by another movement. An exception to this
     * is when a character hits a boundary and in that scenario the movementComplete flag is set. This flag can be
     * important when wanting to know if the animation has been terminated before taking action on it.
     */
    getIsMovementComplete() {
        return this.movementComplete;
    }

    /* private */
    handleSound(frameIdx, sounds) {
        let sound = this.character.getProperties().getFrameIndexSound(frameIdx);
        if (sounds.getIsSoundOn() && sound !== undefined) {
            // We want a new audio for each frame sound since we want them to be able to stack on top of each
            // other.
            Sounds.playStackedSound(SWING_SOUND);
        }
    }

    /* private */
    renderFrameTarget(action, direction, sprite, frame) {
        let targetSelector = $('.' + sprite.attr('class') + 'Target');
        let frameTarget = this.character.getProperties().getFrameTarget(action, direction,
            this.character.getScreenNumber(),
            frame);
        console.log('frame target for %s going %s at frame %d is %o', sprite.attr('class'), direction, frame, frameTarget);
        if (frameTarget) {
            targetSelector.css('position', 'fixed');
            targetSelector.css('border', '1px solid red');
            targetSelector.css(CSS_HEIGHT_LABEL, frameTarget[CSS_HEIGHT_LABEL]);
            targetSelector.css(CSS_WIDTH_LABEL, frameTarget[CSS_WIDTH_LABEL]);
            targetSelector.css(CSS_BOTTOM_LABEL, this.character.getY() + frameTarget['bottomOffset']);
            targetSelector.css(CSS_LEFT_LABEL, this.character.getX() + frameTarget['leftOffset']);
        } else {
            targetSelector.css('border', '0px');
        }

    }

    /* private */
    isAnimationInterrupted(requestedAction, requestedDirection, requestedVerticalDirection, gameBoard, frame) {
        return (this.character.getAction() !== requestedAction ||
            this.character.getHorizontalDirection() !== requestedDirection ||
            this.character.getVerticalDirection() !== requestedVerticalDirection ||
            Fighting.wasBarbarianTargetedByCharacter(this.character, this.character.getBarbarian(), requestedAction, requestedDirection, frame) ||
            Fighting.shouldCpuChase(this.character, gameBoard) ||
            Obstacle.isStoppedByBoundary(this.character, gameBoard) ||
            this.character.getObstacles().didCharacterHitObstacle(this.character) ||
            this.character.isDeadButNotDying() ||
            !this.character.isOnScreen(gameBoard) ||
            Fighting.shouldCpuLaunchAttack(this.character, gameBoard) ||
            Fighting.shouldCpuFight(this.character, gameBoard) ||
            gameBoard.getIsPaused() ||
            Fighting.shouldDragonBreatheFire(this.character, frame));
    }

    /* private */
    moveCharacter(action, gameBoard) {
        let isFalling = action === FALL_LABEL || action === SINK_LABEL;
        let x = isFalling ? undefined : this.getHorizontalBoundary();
        let y = isFalling ? 0 : this.getMoveToY(gameBoard);
        this.moveElementToPosition(x, y, this.character.getProperties().getPixelsPerSecond(action));
    }

    /* private */
    getMoveToY(gameBoard) {
        return gameBoard.isWater(this.character.getScreenNumber()) ? this.getVerticalCoordinate() : undefined;
    }

    /* private */
    getVerticalCoordinate() {
        // If the Barbarian is not moving vertically keep him and send monsters to his Y. Otherwise send to boundary
        return this.character.getBarbarian().isMovingVertically() ? this.getVerticalBoundary()
                                                                  : this.character.getBarbarian().getY();
    }

    /* private */
    getVerticalBoundary() {
        return this.character.isDirectionDown() ? SCREEN_BOTTOM : SCREEN_HEIGHT - this.character.getHeight() / 2;
    }

    /* private */
    getHorizontalBoundary() {
        return this.character.isFacingLeft() ? 0 : SCREEN_WIDTH - this.character.getWidth();
    }

    /* private */
    moveToPosition(duration, x, y) {
        let self = this;
        this.character.getProperties().getSprite().animate({left: x + 'px', bottom: y + 'px'},
            {
                'duration' : duration,
                'easing' : 'linear',
                'complete' : function() {self.movementComplete = true; },
            });
    }

    /* private */
    prepareSprite() {
        return this.character.isDead() ? Fighting.prepareDeathSprite(this.character)
            : this.character.getProperties().getSprite();
    }

    /* private */
    debugAnimationTermination(characterType, action, direction, vertDirection, gameBoard, frameIdx, frames) {
        console.log(this.character.getProperties().getType() + ' is done ' + action + 'ing');

        if (!(this.character.getAction() === action)) {
            console.log('character: ' + characterType + ' action: "' + this.character.getAction()
                + '" is not equal to requested action "' + action + '"');
        }

        if (!(this.character.getHorizontalDirection() === direction)) {
            console.log('character: ' + characterType + ' action: "' + this.character.getHorizontalDirection()
                + '" is not equal to requested direction "' + direction + '"');
        }
        if (!(this.character.getVerticalDirection() === vertDirection)) {
            console.log('character: ' + characterType + ' vertical direction: "' + this.character.getVerticalDirection()
                + '" is not equal to requested vertical direction "' + vertDirection + '"');
        }
        if (!(!Fighting.shouldCpuChaseHorizontally(this.character, gameBoard))) {
            console.log('character: ' + characterType + ' should chase the Barbarian');
        }
        if (!(!Obstacle.isStoppedByBoundary(this.character, gameBoard))) {
            console.log('character: ' + characterType + ' is stopped by boundary');
        }
        if (!(!this.character.getObstacles().didCharacterHitObstacle(this.character))) {
            console.log('character: ' + characterType + ' hit obstacle');
        }
        if (!(!(this.character.isDeadButNotDying()))) {
            console.log('character: ' + characterType + ' is dead but not dying');
        }
        if (!(this.character.isOnScreen(gameBoard))) {
            console.log('character: ' + characterType + ' is not on screen');
        }
        if (!(!Fighting.shouldCpuLaunchAttack(this.character, gameBoard))) {
            console.log('character: ' + characterType + ' should launch a CPU attack');
        }
        if (!(!Fighting.shouldCpuFight(this.character, gameBoard))) {
            console.log('character: ' + characterType + ' is CPU and should fight');
        }
        if (!(!Fighting.shouldDragonBreatheFire(this.character, frames[frameIdx]))) {
            console.log('character: '  + characterType + ' should breathe fire');
        }
        if (!(!Fighting.wasBarbarianTargetedByCharacter(this.character, this.character.getBarbarian(), action, this.character.getHorizontalDirection(), frames[frameIdx]))) {
            console.log('character: ' + characterType + ' targeted the barbarian');
        }
        if (!(!gameBoard.isPaused)) {
            console.log('game is paused');
        }
        if (!(frameIdx < frames.length)) {
            console.log('frame ' + frameIdx + ' of ' + this.character.getProperties().getType() + ' ' +
                this.character.getAction() +  ' is not less than ' + frames.length);
        }
    }
}
