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
        this.properties = properties;
        this.action = action;
        this.direction = direction;
        this.status = status;
        this.obstacles = obstacles;
        this.screenNumber = screenNumber;
        this.currentFrame = currentFrame;

        this.animator = new Animator(this.properties.getSprite());
        this.sounds = new Sounds();
    }

    /**
     * Animate a character across the game board while also animating the sprite.
     *
     * @param gameBoard the game board to perform the animation on
     * @param action the requested action (run, walk, attack etc.)
     * @param direction the requested direction to move the character (left or right)
     * @param vertDirection the requested virtical direction to move the character (up or down)
     * @param numberOfTimes the number of times to perform the animation loop (zero for infinite)
     * @param idx the frame index offset
     * @returns {Promise<number>} the frame for the action and direction that the animation stopped on
     */
    async animate(gameBoard, action, direction, vertDirection, numberOfTimes, idx) {
        validateRequiredParams(this.animate, arguments, 'gameBoard', 'action', 'direction', 'numberOfTimes', 'idx');

        this.moveCharacter(action, gameBoard);

        let frames = this.getFrames(action, direction);
        let frameIdx = idx;
        let counter = numberOfTimes;

        this.setCurrentFrame(action, frameIdx);

        while (!this.isAnimationInterrupted(action, direction, vertDirection, gameBoard) && frameIdx < frames.length) {
            let sprite = this.prepareSprite();
            let heightOffset = -1 * this.getHeightOffset(action, this.getDirection()) * sprite.height();
            let offset = -1*frames[frameIdx++]*sprite.width();
            sprite.css(CSS_BACKGROUND_POSITION, offset + CSS_PX_LABEL + ' ' + heightOffset + CSS_PX_LABEL);

            this.setCurrentFrame(action, frameIdx);

            await sleep(MILLISECONDS_PER_SECOND / this.getFramesPerSecond(action));

            if (frameIdx === frames.length) {
                // If times is 0 we loop infinitely, if times is set decrement it and keep looping
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
     * Move the character to position x, y at the specified pixels per second.
     * @param x the x coordinate to move to
     * @param y the y coordinate to move to
     * @param pixelsPerSecond the pixels per second rate to move at
     */
    moveToPosition(x, y, pixelsPerSecond) {
        validateRequiredParams(this.moveToPosition, arguments, 'pixelsPerSecond');
        this.animator.moveElementToPosition(x, y, pixelsPerSecond)
    }

    /**
     * Returns true if the character is at a horizontal boundary, false otherwise.
     * @param gameBoard the game board
     * @returns {boolean}
     */
    isAtBoundary(gameBoard) {
        validateRequiredParams(this.isAtBoundary, arguments, 'gameBoard');
        return !gameBoard.isWater(this.getScreenNumber()) && this.isAtLeftBoundary() || this.isAtRightBoundary();
    }

    /**
     * Returns true if the character is at the left boundary and trying to move left, false otherwise.
     * @returns {boolean|boolean}
     */
    isAtLeftBoundary() {
        return !this.isDirectionRight() && this.getX() === 0;
    }

    /**
     * Returns true if the character is at the right boundary and trying to move right, false otherwise.
     * @returns {boolean|boolean}
     */
    isAtRightBoundary() {
        return !this.isDirectionLeft() && this.getX() === SCREEN_WIDTH - this.getProperties().getSprite().width();
    }

    /**
     * True if this character is not the barbarian and has passed while moving left.
     * @returns {boolean}
     */
    isPastBarbarianLeft() {
        return !this.isBarbarian() && this.isDirectionLeft() &&
            this.getX() + this.getWidth() * PASSING_MULTIPLIER < this.barbarian.getX() || this.isAtLeftBoundary();
    }

    /**
     * True if this character is not the Barbarian and has passed while moving right.
     * @returns {boolean}
     */
    isPastBarbarianRight() {
        return !this.isBarbarian() && this.isDirectionRight() &&
            this.getX() - this.getWidth() * PASSING_MULTIPLIER > this.barbarian.getX() || this.isAtRightBoundary();
    }

    /**
     * Returns true if the character is moving up or down, false otherwise.
     * @returns {boolean}
     */
    isMovingVertically() {
        return this.getVerticalDirection() !== undefined;
    }

    /**
     * Returns true if the monster should turn around to chase the Barbarian, false otherwise
     * @returns {boolean|*}
     */
    shouldCpuTurnaround() {
        return (!this.isBarbarian() && this.isPassedBarbarian() && this.getTurnaround());
    }

    /**
     * Returns true if the character is not the barbarian and should start fighting, false otherwise. Characters will
     * not fight chracters of the same type.
     * @param gameBoard the game board
     * @returns {boolean}
     */
    shouldCpuFight(gameBoard) {
        validateRequiredParams(this.shouldCpuFight, arguments, 'gameBoard');
        if (this.barbarian.didJumpEvade() || this.getAction() === DEATH_LABEL) {
            return false;
        }

        return !this.isBarbarian() && !this.barbarian.isDead() &&
            this.getOpponentsWithinX(gameBoard, FIGHTING_RANGE_PIXELS)
                .filter(opponent => opponent.getCharacterType() != this.getCharacterType()).length > 0;
    }

    /**
     * Returns true if the character is not the Barbarian and is within range to launch an attack, false otherwise.
     * @param gameBoard the game board
     * @returns {boolean}
     */
    shouldCpuLaunchAttack(gameBoard) {
        validateRequiredParams(this.shouldCpuLaunchAttack, arguments, 'gameBoard');
        return !this.isBarbarian() && !this.barbarian.isDead() && this.getAction() !== ATTACK_LABEL &&
            this.getAction() !== DEATH_LABEL && this.getOpponentsWithinX(gameBoard, CPU_ATTACK_RANGE_PIXELS).length > 0
    }

    /**
     * Gets the opponents with x horizontal pixels of the character.
     * @param gameBoard the game board
     * @param x the proximity to check
     * @returns {[]}
     */
    getOpponentsWithinX(gameBoard, x) {
        validateRequiredParams(this.getOpponentsWithinX, arguments, 'gameBoard', 'x');
        let attackers = [];
        let opponents = gameBoard.getOpponents(this.barbarian.getScreenNumber());
        for (let opponent of opponents) {
            let proximity = this.getProximity(opponent);
            if (proximity > 0 && proximity < x) {
                attackers.push(opponent);
            }
        }
        return attackers;
    }

    /**
     * Get the x coordinate for the character.
     * @returns {number}
     */
    getX() {
        return parseInt(stripPxSuffix(this.getProperties().getSprite().css(CSS_LEFT_LABEL)));
    }

    /**
     * Get the y coordinate for the character.
     * @returns {number}
     */
    getY() {
        return parseInt(stripPxSuffix(this.getProperties().getSprite().css('bottom')));
    }

    /**
     * Get the character properties
     * @returns {*}
     */
    getProperties() {
        return this.properties;
    }

    /**
     * Get the height of the character.
     * @returns {number}
     */
    getHeight() {
        return parseInt(stripPxSuffix(this.getProperties().getSprite().css('height')));
    }

    /**
     * Get the width of the character.
     * @returns {number}
     */
    getWidth() {
        return parseInt(stripPxSuffix(this.getProperties().getSprite().css('height')));
    }

    /**
     * Returns true if this character object is the Barbarian, false otherwise.
     * @returns {boolean}
     */
    isBarbarian() {
        return this === this.barbarian;
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
     * Returns true if the character is dead, false otherwise.
     * @returns {boolean}
     */
    isDead() {
        return this.getStatus() === DEAD_LABEL;
    }

    /**
     * Returns true if the character is alive, false otherwise.
     * @returns {boolean}
     */
    isAlive() {
        return this.getStatus() === ALIVE_LABEL;
    }

    /**
     * Returns true if the character is facing right, false otherwise.
     * @returns {boolean}
     */
    isDirectionRight() {
        return this.getDirection() === RIGHT_LABEL;
    }

    /**
     * Returns true if the character is facing left, false otherwise.
     * @returns {boolean}
     */
    isDirectionLeft() {
        return this.getDirection() === LEFT_LABEL;
    }

    /**
     * Returns true if the character is facing up, false otherwise.
     * @returns {boolean}
     */
    isDirectionUp() {
        return this.getVerticalDirection() === UP_LABEL;
    }

    /**
     * Returns true if the character is facing down, false otherwise.
     * @returns {boolean}
     */
    isDirectionDown() {
        return this.getVerticalDirection() === DOWN_LABEL;
    }

    /**
     * Returns true if the character is walking, false otherwise.
     * @returns {boolean}
     */
    isWalking() {
        return this.getAction() === WALK_LABEL;
    }

    /**
     * Returns true if the character is sitting, false othewise.
     * @returns {boolean}
     */
    isSitting() {
        return this.getAction() === SIT_LABEL;
    }

    /**
     * Returns true if the character is running, false otherwise.
     * @returns {boolean}
     */
    isRunning() {
        return this.getAction() === RUN_LABEL;
    }

    /**
     * Returns true if the character is falling, false otherwise.
     * @returns {boolean}
     */
    isFalling() {
        return this.getAction() === FALL_LABEL;
    }

    /**
     * Returns true if the character is dying, false otherwise.
     * @returns {boolean}
     */
    isDying() {
        return this.getAction() === DEATH_LABEL;
    }

    /**
     * Returns true if the character is sinking, false otherwise.
     * @returns {boolean}
     */
    isSinking() {
        return this.getAction() === SINK_LABEL;
    }

    /**
     * Returns true if the character is swimming, false otherwise.
     * @returns {boolean}
     */
    isSwimming() {
        return this.getAction() === SWIM_LABEL;
    }

    /**
     * Returns true if the character is jumping, false otherwise.
     * @returns {boolean}
     */
    isJumping() {
        return this.getAction() === JUMP_LABEL;
    }

    /**
     * Returns true if the character is attacking, false otherwise.
     * @returns {boolean}
     */
    isAttacking() {
        return this.getAction() === ATTACK_LABEL;
    }

    /**
     * Returns the obstacle that the character has encountered, undefined if no obstacle was encountered.
     * @returns {undefined|*}
     */
    getObstacle() {
        // Get the most recently passed obstacle
        let obstacle = this.getObstacleEncountered();

        if (obstacle !== undefined &&
            this.isPastObstacle(obstacle) &&
            (this.getY() != obstacle.getHeight() || obstacle.getType() === PIT_LABEL) &&
            (!this.isBarbarian() || this.getAction() !== ATTACK_LABEL)) {
            return obstacle;
        }
        return undefined;
    }

    /**
     * Returns true if the action is repeated indefinitely, false otherwise.
     * @param action the action to check
     * @returns {boolean}
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
        if (this.getAction() === FALL_LABEL) {
            return false;
        }
        let obstacle =  this.getObstacle();

        if (obstacle === undefined) {
            return false;
        } else if (obstacle.getType() === PIT_LABEL) {
            if (this.didJumpEvade() || !this.isBarbarian()) {
                return false;
            }
            return true;
        } else {
            return true;
        }
    }

    /**
     * Returns the current action of the character.
     * @returns {*}
     */
    getAction() {
        return this.action;
    }

    /**
     * Get the current vertical direction of the character. Returns undefined if there is no vertical direction.
     * @returns {*}
     */
    getVerticalDirection() {
        return this.direction[VERTICAL_LABEL];
    }

    /**
     * Gets the default action for the character.
     * @returns {*}
     */
    getDefaultAction() {
        return this.properties.getDefaultAction();
    }

    /**
     * Gets the default direction for the character.
     * @returns {*}
     */
    getDefaultDirection() {
        return this.properties.getDefaultDirection();
    }

    /**
     * Gets the default status for the character.
     * @returns {*}
     */
    getDefaultStatus() {
        return this.properties.getDefaultStatus();
    }

    /**
     * Returns true if the character will turn around and chase the Barbarian, false otherwise.
     * @returns {*}
     */
    getTurnaround() {
        return this.properties.getCanTurnAround();
    }

    /**
     * Gets the default direction for the customer.
     * @returns {*}
     */
    getDefaultLeft() {
        return this.properties.getDefaultX();
    }

    /**
     * Gets the default y coordinate for the character.
     * @param screenNumber
     * @returns {*}
     */
    getDefaultBottom(screenNumber) {
        validateRequiredParams(this.getDefaultBottom, arguments, 'screenNumber');
        return this.properties.getDefaultBottom(screenNumber);
    }

    /**
     * Get the current direction of the character.
     * @returns {*}
     */
    getDirection() {
        return this.direction[HORIZONTAL_LABEL];
    }

    /**
     * Gets the sprite height offset for a particular action and direction.
     * @param action the action
     * @param directiont the direction
     * @returns {*}
     */
    getHeightOffset(action, direction) {
        return this.properties.getFrameHeightOffset(action, direction);
    }

    /**
     * Get the frames for a particular action and direction.
     * @param action the action
     * @param direction the direction
     * @returns {*}
     */
    getFrames(action, direction) {
        return this.properties.getFrames(action, direction);
    }

    /**
     * Gets the death sprite element for the character.
     * @returns {*}
     */
    getDeathSprite() {
        return this.properties.getDeathSprite();
    }

    /**
     * Gets the type of the character.
     * @returns {*}
     */
    getCharacterType() {
        return this.properties.getType();
    }

    /**
     * Returns true if the character can elevate, false otherwise.
     * @returns {*}
     */
    getCanElevate() {
        return this.properties.getCanElevate();
    }

    /**
     * Returns true if the character highlights during an attack.
     * @returns {*}
     */
    getCanHighlight() {
        return this.properties.getCanHighlight();
    }

    /**
     * Get the sound that the character makes.
     * @returns {*}
     */
    getSound() {
        return this.properties.getSound();
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
        validateRequiredParams(this.getCurrentFrame, arguments, 'action');
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

    setX(x) {
        validateRequiredParams(this.setX, arguments, 'x');
        this.getProperties().getSprite().css(CSS_LEFT_LABEL, x);
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
                this.moveToPosition(undefined, 0, this.getProperties().getPixelsPerSecond(FALL_LABEL));
            } else {
                this.moveFromPositionToBoundary(gameBoard);
            }
        }
    }

    /* private */
    prepareSprite() {
        if (this.isDead()) {
            let deathSprite = this.getDeathSprite();
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
        let x = this.isDirectionLeft() ? 0 : SCREEN_WIDTH - this.getWidth();

        this.moveToPosition(x, y, pixelsPerSecond);
    }

    /* private */
    isStopped() {
        return this.action === STOP_LABEL;
    }

    /* private */
    isPassedBarbarian() {
        return this.isPastBarbarianLeft() || this.isPastBarbarianRight();
    }

    /* private */
    getObstacleEncountered() {
        return this.obstacles.getNextObstacle(this.getX(), this.getDirection(), this.getScreenNumber());
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
    getFramesPerSecond(action) {
        return this.properties.getFramesPerSecond(action);
    }

    /* private */
    debugAnimationTermination(action, direction, vertDirection, gameBoard, frameIdx, frames) {
        console.log(this.getCharacterType() + ' is done ' + action + 'ing');

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
            console.log('frame ' + frameIdx + ' of ' + this.getCharacterType() + ' ' + this.getAction() +  ' is not less than ' + frames.length);
        }
    }
}

