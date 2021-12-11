class Animator {
    constructor(character) {
        this.character = character;
    }

    /**
     * Move the character across the game board while also animating the character's sprite.
     *
     * @param gameBoard the game board to perform the animation on
     * @param action the requested action (run, walk, attack etc.)
     * @param direction the requested direction to move the character (left or right)
     * @param vertDirection the requested vertical direction to move the character (up or down)
     * @param numberOfTimes the number of times to perform the animation loop (zero for infinite)
     * @param idx the frame index offset
     * @returns {Promise<number>} the frame for the action and direction that the animation stopped on
     */
    async animate(gameBoard, action, direction, vertDirection, numberOfTimes, idx) {
        validateRequiredParams(this.animate, arguments, 'gameBoard', 'action', 'direction', 'numberOfTimes', 'idx');

        if (action !== DEATH_LABEL) {
            this.moveCharacter(action, gameBoard);
        }

        let frames = this.character.getProperties().getFrames(action, direction);
        let frameIdx = idx;
        let counter = numberOfTimes;

        this.character.setCurrentFrame(action, frameIdx);

        while (!this.isAnimationInterrupted(action, direction, vertDirection, gameBoard) && frameIdx < frames.length) {
            let sprite = this.prepareSprite();
            let heightOffset = -1 * this.character.getProperties().getFrameHeightOffset(
                action, this.character.getHorizontalDirection()) * sprite.height();
            let offset = -1 * frames[frameIdx++]*sprite.width();
            sprite.css(CSS_BACKGROUND_POSITION, offset + CSS_PX_LABEL + ' ' + heightOffset + CSS_PX_LABEL);

            this.character.setCurrentFrame(action, frameIdx);

            await sleep(MILLISECONDS_PER_SECOND / this.character.getProperties().getFramesPerSecond(action));

            if (frameIdx === frames.length) {
                // If counter is 0 loop infinitely otherwise loop again if counter has not expired
                if (counter === 0 || --counter > 0) {
                    frameIdx = 0;
                    this.character.setCurrentFrame(action, frameIdx);
                }
            }
        }

        // uncomment to see why animation stopped for debugging
        //this.debugAnimationTermination(this.character.getProperties().getType(), action, direction, vertDirection, gameBoard, frameIdx, frames);
        //this.debugAnimationTermination(this.character.getProperties().getType(), action, direction, vertDirection, gameBoard, frameIdx, frames);

        return frameIdx;
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
        let distanceY = y === undefined ? 0 : Math.abs(y - stripPxSuffix(element.css('bottom')));
        let distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
        let duration = distance / pixelsPerSecond * MILLISECONDS_PER_SECOND;

        this.moveToPosition(duration, x, y);
    }

    /* private */
    isAnimationInterrupted(requestedAction, requestedDirection, requestedVerticalDirection, gameBoard, frame) {
        return (this.character.getAction() !== requestedAction ||
            this.character.getHorizontalDirection() !== requestedDirection ||
            this.character.getVerticalDirection() !== requestedVerticalDirection ||
            this.character.isAction(STOP_LABEL) ||
            Fighting.shouldCpuChase(this.character, gameBoard) ||
            Obstacle.isStoppedByBoundary(this.character, gameBoard) ||
            this.character.getObstacles().didCharacterHitObstacle(this.character) ||
            this.character.isDeadButNotDying() ||
            !this.character.isOnScreen(gameBoard) ||
            Fighting.shouldCpuLaunchAttack(this.character, gameBoard) ||
            Fighting.shouldCpuFight(this.character, gameBoard) ||
            gameBoard.getIsPaused());
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
        let shouldCpuGoToBarbarianY = !this.character.isBarbarian() &&
            !this.character.getBarbarian().isMovingVertically();
        return shouldCpuGoToBarbarianY ? this.character.getBarbarian().getY() : this.getVerticalBoundary();
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
        this.character.getProperties().getSprite().animate({left: x + 'px', bottom: y + 'px'}, duration, 'linear')
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
        if (!(!this.character.isAction(STOP_LABEL))) {
            console.log('character: ' + characterType + ' is stopped');
        }
        if (!(!Fighting.shouldCpuChase(this.character, gameBoard))) {
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
        if (!(!gameBoard.isPaused)) {
            console.log('game is paused');
        }
        if (!(frameIdx < frames.length)) {
            console.log('frame ' + frameIdx + ' of ' + this.character.getProperties().getType() + ' ' +
                this.character.getAction() +  ' is not less than ' + frames.length);
        }
    }
}
