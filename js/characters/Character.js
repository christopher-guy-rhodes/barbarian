const PASSING_MULTIPLIER = 1.5;

/**
 * Class that supports character actions
 */
class Character {
    /**
     * Construct a character
     * @param barbarian the Barbarian character, leave undefined if this is the Barbarian character
     * @param obstacles the obstacles the character will face
     * @param properties CharacterProperty object that represents the static properties of the character
     * @param action the action the character is taking
     * @param direction the direction vector the character is moving
     * @param status the status of the character
     * @param screenNumber the current screen number for the character
     * @param currentFrame the current frame that is rendering for the character's current action
     */
    constructor(barbarian,
                obstacles,
                properties,
                action,
                direction,
                status,
                screenNumber,
                currentFrame) {
        this.barbarian = barbarian === undefined ? this : barbarian;
        this.obstacles = obstacles;
        this.properties = properties;
        this.action = action;
        this.direction = direction;
        this.status = status;
        this.screenNumber = screenNumber;
        this.currentFrame = currentFrame;

        this.animator = new Animator(this.getProperties().getSprite());
        this.sounds = new Sounds();
    }

    /**
     * Animate a character across the game board while also animating the sprite.
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

        this.moveCharacter(action, gameBoard);

        let frames = this.getProperties().getFrames(action, direction);
        let frameIdx = idx;
        let counter = numberOfTimes;

        this.setCurrentFrame(action, frameIdx);

        while (!this.isAnimationInterrupted(action, direction, vertDirection, gameBoard) && frameIdx < frames.length) {
            let sprite = this.prepareSprite();
            let heightOffset = -1 *
                this.getProperties().getFrameHeightOffset(action, this.getDirection()) * sprite.height();
            let offset = -1*frames[frameIdx++]*sprite.width();
            sprite.css(CSS_BACKGROUND_POSITION, offset + CSS_PX_LABEL + ' ' + heightOffset + CSS_PX_LABEL);

            this.setCurrentFrame(action, frameIdx);

            await sleep(MILLISECONDS_PER_SECOND / this.getProperties().getFramesPerSecond(action));

            if (frameIdx === frames.length) {
                // If counter is 0 loop infinitely otherwise loop again if counter has not expired
                if (counter === 0 || --counter > 0) {
                    frameIdx = 0;
                    this.setCurrentFrame(action, frameIdx);
                }
            }
        }

        // uncomment to see why animation stopped for debugging
        //if (!this.isBarbarian()) {
        //    this.debugAnimationTermination(action, direction, vertDirection, gameBoard, frameIdx, frames);
        //}

        return frameIdx;
    }

    /**
     * Determines if the character is at a screen boundary.
     * @param gameBoard the game board
     * @returns {boolean} true if the character is at a horizontal boundary, false otherwise.
     */
    isAtBoundary(gameBoard) {
        validateRequiredParams(this.isAtBoundary, arguments, 'gameBoard');
        return !gameBoard.isWater(this.getScreenNumber()) &&
            this.isAtLeftBoundary() ||
            this.isAtRightBoundary();
    }

    /**
     * Determines if the character is moving vertically.
     * @returns {boolean} returns true if the character is moving up or down, false otherwise.
     */
    isMovingVertically() {
        return this.getVerticalDirection() !== undefined;
    }

    /**
     * Determines if the character is facing left.
     * @returns {boolean} true if the character is facing left, false otherwise
     */
    isFacingLeft() {
        return this.getDirection() === LEFT_LABEL;
    }

    /**
     * Determines if the character is facing right.
     * @returns {boolean} true if the character is facing left, false otherwise
     */
    isFacingRight() {
        return this.getDirection() === RIGHT_LABEL;
    }

    /**
     * Determines if the character should turn around.
     * @returns {boolean} true if the character is the CPU and should turn around, false otherwise
     */
    shouldCpuTurnaround() {
        return !this.isBarbarian() && this.isPastCharacter(this.getBarbarian()) &&
            this.getProperties().getCanTurnAround();
    }

    /**
     * Determines if the character should start a fight. Characters will not fight characters of the same type.
     * @param gameBoard the game board
     * @returns {boolean} true if the character is the CPU and should attack, false otherwise.
     */
    shouldCpuFight(gameBoard) {
        validateRequiredParams(this.shouldCpuFight, arguments, 'gameBoard');

        if (this.isBarbarian() || this.getBarbarian().didJumpEvade() || this.isDead()) {
            return false;
        }

        return !this.getBarbarian().isDead() && this.getOpponentsWithinX(gameBoard, FIGHTING_RANGE_PIXELS)
            .filter(opponent => opponent.getProperties().getType() != this.getProperties().getType()).length > 0;
    }

    /**
     * Determines if the CPU character should launch an attack.
     * @param gameBoard the game board
     * @returns {boolean} true if the CPU character is within range to launch an attack, false otherwise.
     */
    shouldCpuLaunchAttack(gameBoard) {
        validateRequiredParams(this.shouldCpuLaunchAttack, arguments, 'gameBoard');
        return !this.isBarbarian() && !this.getBarbarian().isDead() && !this.isAttacking() && !this.isDead() &&
            this.getOpponentsWithinX(gameBoard, CPU_ATTACK_RANGE_PIXELS).length > 0
    }

    /**
     * Gets the opponents with x horizontal pixels of the character.
     * @param gameBoard the game board
     * @param x the proximity to check
     * @returns {[Character]} other characters within x pixels
     */
    getOpponentsWithinX(gameBoard, x) {
        validateRequiredParams(this.getOpponentsWithinX, arguments, 'gameBoard', 'x');
        let self = this;
        return gameBoard.getOpponents(this.getBarbarian().getScreenNumber())
            .filter(function (opponent) {
                let proximity = self.getProximity(opponent);
                return proximity > 0 && proximity < x;
            });
    }

    /**
     * Get the x coordinate for this character.
     * @returns {number} the x coordinate
     */
    getX() {
        return parseInt(stripPxSuffix(this.getProperties().getSprite().css(CSS_LEFT_LABEL)));
    }

    /**
     * Get the y coordinate for this character.
     * @returns {number} the y coordinate
     */
    getY() {
        return parseInt(stripPxSuffix(this.getProperties().getSprite().css('bottom')));
    }

    /**
     * Get the static character properties.
     * @returns {CharacterProperties} the character properties object for this character
     */
    getProperties() {
        return this.properties;
    }

    /**
     * Get the character animator.
     * @returns {Animator} the animator object for the sprite for the character
     */
    getAnimator() {
        return this.animator;
    }

    /**
     * Get the height of the character.
     * @returns {number} the character height
     */
    getHeight() {
        return parseInt(stripPxSuffix(this.getProperties().getSprite().css('height')));
    }

    /**
     * Get the width of the character.
     * @returns {number} the character width
     */
    getWidth() {
        return parseInt(stripPxSuffix(this.getProperties().getSprite().css('height')));
    }

    /**
     * Determine if this character is the Barbarian.
     * @returns {boolean} true if this character object is the Barbarian, false otherwise
     */
    isBarbarian() {
        return this === this.getBarbarian();
    }

    /**
     * Hide this character.
     */
    hide() {
        this.getProperties().getSprite().css(CSS_DISPLAY_LABEL, CSS_NONE_LABEL);
    }

    /**
     * Show this character.
     */
    show() {
        this.getProperties().getSprite().css(CSS_DISPLAY_LABEL, CSS_BLOCK_LABEL);
    }

    /**
     * Determine if the character is dead.
     * @returns {boolean} true if the character is dead, false otherwise
     */
    isDead() {
        return this.getStatus() === DEAD_LABEL;
    }

    /**
     * Determine if the character is going up.
     * @returns {boolean} true if the character is facing up, false otherwise
     */
    isDirectionUp() {
        return this.getVerticalDirection() === UP_LABEL;
    }

    /**
     * Determine if the character is going down.
     * @returns {boolean} true if the character is facing down, false otherwise
     */
    isDirectionDown() {
        return this.getVerticalDirection() === DOWN_LABEL;
    }

    /**
     * Determine if the character is walking.
     * @returns {boolean} true if the character is walking, false otherwise
     */
    isWalking() {
        return this.getAction() === WALK_LABEL;
    }

    /**
     * Determine if the character is sitting.
     * @returns {boolean} true if the character is sitting, false otherwise
     */
    isSitting() {
        return this.getAction() === SIT_LABEL;
    }

    /**
     * Determine if the character is running.
     * @returns {boolean} true if the character is running, false otherwise
     */
    isRunning() {
        return this.getAction() === RUN_LABEL;
    }

    /**
     * Determine if the character is falling.
     * @returns {boolean} true if the character is falling, false otherwise
     */
    isFalling() {
        return this.getAction() === FALL_LABEL;
    }

    /**
     * Determine if the character is dying.
     * @returns {boolean} true if the character is dying, false otherwise
     */
    isDying() {
        return this.getAction() === DEATH_LABEL;
    }

    /**
     * Determine if the character is sinking.
     * @returns {boolean} true if the character is sinking, false otherwise
     */
    isSinking() {
        return this.getAction() === SINK_LABEL;
    }

    /**
     * Determine if the character is swimming.
     * @returns {boolean} true if the character is swimming, false otherwise
     */
    isSwimming() {
        return this.getAction() === SWIM_LABEL;
    }

    /**
     * Determine if the character is jumping.
     * @returns {boolean} true if the character is jumping, false otherwise
     */
    isJumping() {
        return this.getAction() === JUMP_LABEL;
    }

    /**
     * Determine if the character is attacking.
     * @returns {boolean} true if the character is attacking, false otherwise
     */
    isAttacking() {
        return this.getAction() === ATTACK_LABEL;
    }

    /**
     * Returns the obstacle that the character has encountered, undefined if no obstacle was encountered.
     * @returns {undefined|Obstacle} the obstacle that the character has hit, undefined if no obstacle was hit
     */
    getObstacle() {
        return this.getObstacleEncountered().filterIfCharacterAvoided(this);
    }

    /**
     * Determines if the action is infinite for the character.
     * @param action the action to check
     * @returns {boolean} true if the action is repeated indefinitely, false otherwise
     */
    isActionInfinite(action) {
        validateRequiredParams(this.isActionInfinite, arguments, 'action');
        return this.getProperties().getActionNumberOfTimes(action) === 0;
    }

    /**
     * Returns true if the character hit an obstacle, false otherwise.
     * @returns {boolean}
     */
    hitObstacle() {
        return this.getObstacle() !== undefined;
    }

    /**
     * Get the current character action.
     * @returns {String|undefined} the current action of the character
     */
    getAction() {
        return this.action;
    }

    /**
     * Get the current vertical direction of the character. Returns undefined if there is no vertical direction.
     * @returns {String|undefined} the current vertical direction of the character
     */
    getVerticalDirection() {
        return this.direction[VERTICAL_LABEL];
    }

    /**
     * Get the current direction of the character.
     * @returns {String} the direction of the character
     */
    getDirection() {
        return this.direction[HORIZONTAL_LABEL];
    }

    /**
     * Gets the screen number that the character is on.
     * @returns {*}
     */
    getScreenNumber() {
        return this.screenNumber;
    }

    /**
     * Get the current frame for a particular action for the character.
     * @param action
     * @returns {*}
     */
    getCurrentFrame(action) {
        if (action === undefined) {
            return 0;
        }
        return this.currentFrame[action];
    }

    /**
     * Set the action for the character.
     * @param action the action to set.
     */
    setAction(action) {
        this.action = action;
    }

    /**
     * Set the direction of the character.
     * @param direction
     */
    setDirection(direction) {
        validateRequiredParams(this.setDirection, arguments, 'direction');
        this.direction[HORIZONTAL_LABEL] = direction;
    }

    /**
     * Set the vertical direction of the character.
     * @param direction
     */
    setVerticalDirection(direction) {
        this.direction[VERTICAL_LABEL] = direction;
    }

    /**
     * Set the status for the character.
     * @param status
     */
    setStatus(status) {
        validateRequiredParams(this.setStatus, arguments, 'status');
        this.status = status;
    }

    /**
     * Set the screen number for the character.
     * @param screenNumber the screen number
     */
    setScreenNumber(screenNumber) {
        validateRequiredParams(this.setScreenNumber, arguments, 'screenNumber');
        this.screenNumber = screenNumber;
    }

    /**
     * Set the current frame for the given action and frame.
     * @param action the action
     * @param frame the frame
     */
    setCurrentFrame(action, frame) {
        validateRequiredParams(this.setCurrentFrame, arguments, 'action', 'frame');
        this.currentFrame[action] = frame;
    }

    /**
     * Set the y coordinate for the character.
     * @param y the y coordinate
     */
    setY(y) {
        validateRequiredParams(this.setY, arguments, 'y');
        this.getProperties().getSprite().css(CSS_BOTTOM_LABEL, y + CSS_PX_LABEL)
    }

    /**
     * Set the x coordinate for the character.
     * @param x the x coordinate
     */
    setX(x) {
        validateRequiredParams(this.setX, arguments, 'x');
        this.getProperties().getSprite().css(CSS_LEFT_LABEL, x);
    }

    /* private */
    getBarbarian() {
        return this.barbarian;
    }

    /* private */
    isAtLeftBoundary() {
        return !this.isFacingRight() && this.getX() === 0;
    }

    /* private */
    isAtRightBoundary() {
        return !this.isFacingLeft() && this.getX() === SCREEN_WIDTH - this.getProperties().getSprite().width();
    }

    /* private */
    isPastCharacterLeft(otherCharacter) {
        return this.isFacingLeft() && this.getX() + this.getWidth() * PASSING_MULTIPLIER < otherCharacter.getX() ||
            this.isAtLeftBoundary();
    }

    /* private */
    isPastCharacterRight(otherCharacter) {
        return this.isFacingRight() && this.getX() - this.getWidth() * PASSING_MULTIPLIER > otherCharacter.getX() ||
            this.isAtRightBoundary();
    }

    /* private */
    isPastCharacter(otherCharacter) {
        return this.isPastCharacterLeft(otherCharacter) || this.isPastCharacterRight(otherCharacter);
    }

    /* private */
    didJumpEvade() {
        return this.getAction() === JUMP_LABEL && this.getCurrentFrame(JUMP_LABEL) >= 3;
    }

    /* private */
    isBarbarian() {
        return this.barbarian === this;
    }

    /* private */
    isAnimationInterrupted(requestedAction, requestedDirection, requestedVerticalDirection, gameBoard, frame) {
        return (this.getAction() !== requestedAction ||
            this.getDirection() !== requestedDirection ||
            this.getVerticalDirection() !== requestedVerticalDirection ||
            this.isStopped() ||
            this.shouldCpuTurnaround() ||
            this.isAtBoundary(gameBoard) ||
            this.hitObstacle() ||
            this.isDeadButNotDying() ||
            !this.isOnScreen(gameBoard) ||
            this.shouldCpuLaunchAttack(gameBoard) ||
            this.shouldCpuFight(gameBoard) ||
            gameBoard.getIsPaused());
    }

    /* private */
    moveCharacter(action, gameBoard) {
        if (action !== DEATH_LABEL) {
            if (action === FALL_LABEL || action === SINK_LABEL) {
                this.getAnimator().moveElementToPosition(undefined,
                    0,
                    this.getProperties().getPixelsPerSecond(FALL_LABEL));
            } else {
                this.moveFromPositionToBoundary(gameBoard);
            }
        }
    }

    /* private */
    prepareSprite() {
        if (this.isDead()) {
            let deathSprite = this.getProperties().getDeathSprite();
            deathSprite.show();
            deathSprite.css(CSS_LEFT_LABEL, this.getX() + CSS_PX_LABEL);
            if (!this.isBarbarian()) {
                this.getProperties().getSprite().hide();
            }
            return deathSprite;
        } else {
            return this.getProperties().getSprite();
        }
    }

    /* private */
    isVisible() {
        return this.getProperties().getSprite().css(CSS_DISPLAY_LABEL) === CSS_BLOCK_LABEL;
    }

    /* private */
    isDeadButNotDying() {
        return this.isDead() && !this.isFalling() && !this.isDying() && !this.isSinking();
    }

    /* private */
    stopMovement() {
        this.getProperties().getSprite().stop();
    }

    /* private */
    moveFromPositionToBoundary(gameBoard) {
        let pixelsPerSecond = this.getProperties().getPixelsPerSecond(this.getAction());
        if (pixelsPerSecond <= 0) {
            // If the sprite isn't moving (stop, non-moving attack etc.) to not move it to the boundary
            return;
        }

        let y = undefined;
        if (this.getVerticalDirection() !== undefined) {
            y = !gameBoard.isWater(this.getScreenNumber()) ? undefined :
                this.isDirectionDown() ? SCREEN_BOTTOM : SCREEN_HEIGHT - this.getHeight() / 2;
        }
        let x = this.isFacingLeft() ? 0 : SCREEN_WIDTH - this.getWidth();

        this.getAnimator().moveElementToPosition(x, y, pixelsPerSecond);
    }

    /* private */
    isStopped() {
        return this.action === STOP_LABEL;
    }

    /* private */
    getObstacleEncountered() {
        let obstacle = this.obstacles.getNextObstacle(this.getX(), this.getDirection(), this.getScreenNumber());
        let emptyObstacle = new Obstacle(0, 0, "NONE", STOP_LABEL, 0, 0);
        return obstacle === undefined ? emptyObstacle : obstacle;
    }

    /* private */
    isPastObstacle(obstacle) {
        return obstacle.isPast(this.getX(), this.getDirection());
    }

    /* private */
    getProximity(opponent) {
        let distanceX = Math.abs(this.getX() - opponent.getX());
        let distanceY = Math.abs(stripPxSuffix(this.getProperties().getSprite().css('bottom'))
            - stripPxSuffix(opponent.getProperties().getSprite().css('bottom')));
        return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
    }

    /* private */
    isOnScreen(gameBoard) {
        return gameBoard.getOpponents(this.barbarian.getScreenNumber()).includes(this);
    }

    /* private */
    getStatus() {
        return this.status;
    }

    /* private */
    debugAnimationTermination(action, direction, vertDirection, gameBoard, frameIdx, frames) {
        console.log(this.getProperties().getType() + ' is done ' + action + 'ing');

        if (!(this.getAction() === action)) {
            console.log(this.getAction() + ' is not equal to requested action ' + action);
        }
        if (!(this.getDirection() === direction)) {
            console.log('b');
        }
        if (!(this.getVerticalDirection() === vertDirection)) {
            console.log('c');
        }
        if (!(!this.isStopped())) {
            console.log('d');
        }
        if (!(!this.shouldCpuTurnaround())) {
            console.log('e');
        }
        if (!(!this.isAtBoundary(gameBoard))) {
            console.log('f');
        }
        if (!(!this.hitObstacle())) {
            console.log('g');
        }
        if (!(!(this.isDeadButNotDying()))) {
            console.log('h');
        }
        if (!(this.isOnScreen(gameBoard))) {
            console.log('i');
        }
        if (!(!this.shouldCpuLaunchAttack(gameBoard))) {
            console.log('j');
        }
        if (!(!this.shouldCpuFight(gameBoard))) {
            console.log('k');
        }
        if (!(!gameBoard.isPaused)) {
            console.log('l');
        }
        if (!(frameIdx < frames.length)) {
            console.log('frame ' + frameIdx + ' of ' + this.getProperties().getType() + ' ' +
                this.getAction() +  ' is not less than ' + frames.length);
        }
    }
}

