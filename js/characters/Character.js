const PASSING_MULTIPLIER = 1.5;
const PIT_JUMP_EVADE_FRAME = 4;
const CHASE_PROXIMITY = 200;
const MIN_AVOID_JUMP_FRAME = 3;
const MAX_AVOID_JUMP_FRAME = 7;

/**
 * Class that supports character actions
 */
class Character {
    /**
     * Construct a character
     * @param barbarian the Barbarian character, undefined if this is the Barbarian character
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
     * Move this character across the game board while also animating the sprite.
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
        //this.debugAnimationTermination(this.getProperties().getType(), action, direction, vertDirection, gameBoard, frameIdx, frames);

        return frameIdx;
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
     * Determines if the CPU character should change direction in order to chase the Barbarian.
     * @param gameBoard the game board
     * @returns {boolean} true if the character is the CPU and should change direction, false otherwise
     */
    shouldCpuChase(gameBoard) {
        return this.shouldCpuChaseVertically(gameBoard) || this.shouldCpuChaseHorizontally();
    }

    /**
     * Get the CPU direction needed to chase the Barbarian.
     */
    getCpuVerticalChaseDirection() {
        return (this.getBarbarian().getY() > this.getY()) ? UP_LABEL : DOWN_LABEL;
    }

    /**
     * Determines if the CPU character should start a fight. Characters will not fight characters of the same type.
     * @param gameBoard the game board
     * @returns {boolean} true if the character is the CPU and should attack, false otherwise.
     */
    shouldCpuFight(gameBoard) {
        validateRequiredParams(this.shouldCpuFight, arguments, 'gameBoard');

        return !this.isBarbarian() && !this.isDead() &&
            !this.getBarbarian().isDead() && this.getOpponentsWithinX(gameBoard, FIGHTING_RANGE_PIXELS)
                .filter(opponent => opponent.getProperties().getType() != this.getProperties().getType()
                    && !this.getBarbarian().didBarbarianEvadeAttack(this)).length > 0;
    }

    /**
     * Determines if the CPU character should launch an attack.
     * @param gameBoard the game board
     * @returns {boolean} true if the CPU character is within range to launch an attack, false otherwise.
     */
    shouldCpuLaunchAttack(gameBoard) {
        validateRequiredParams(this.shouldCpuLaunchAttack, arguments, 'gameBoard');
        return !this.isBarbarian() && !this.getBarbarian().isDead() && !this.isAction(ATTACK_LABEL) && !this.isDead() &&
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
        return parseInt(stripPxSuffix(this.getProperties().getSprite().css(CSS_BOTTOM_LABEL)));
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
        return parseInt(stripPxSuffix(this.getProperties().getSprite().css(CSS_HEIGHT_LABEL)));
    }

    /**
     * Get the width of the character.
     * @returns {number} the character width
     */
    getWidth() {
        return parseInt(stripPxSuffix(this.getProperties().getSprite().css(CSS_WIDTH_LABEL)));
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
     * Determine if the character is performing the aciton
     * @param action
     */
    isAction(action) {
        validateRequiredParams(this.isAction, arguments, 'action');
        return this.getAction() === action;
    }

    /**
     * Get the character's obstacles object.
     * @returns {Obstacles}
     */
    getObstacles() {
        return this.obstacles;
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
     * Get the current character action.
     * @returns {String|undefined} the current action of the character
     */
    getAction() {
        return this.action;
    }

    /**
     * Get the current vertical direction of the character.
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
     * @returns {Number} the screen number
     */
    getScreenNumber() {
        return this.screenNumber;
    }

    /**
     * Get the current frame for a particular action for the character.
     * @param action
     * @returns {Number}
     */
    getCurrentFrame(action) {
        return action === undefined ? 0 : this.currentFrame[action];
    }

    /**
     * Set the action for the character.
     * @param action the action to set. Can be undefined.
     */
    setAction(action) {
        this.action = action;
    }

    /**
     * Set the direction of the character.
     * @param direction the direction of the character. Can be undefined.
     */
    setDirection(direction) {
        validateRequiredParams(this.setDirection, arguments, 'direction');
        this.direction[HORIZONTAL_LABEL] = direction;
    }

    /**
     * Set the vertical direction of the character.
     * @param direction the vertical direction. Can be undefined.
     */
    setVerticalDirection(direction) {
        this.direction[VERTICAL_LABEL] = direction;
    }

    /**
     * Set the status for the character.
     * @param status the status
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

    /**
     * Determines if this character jump evaded an obstacle.
     * @returns {boolean} true of the character evaded the obstacle, false otherwise
     */
    didJumpEvadePit() {
        let frame = this.getCurrentFrame(JUMP_LABEL);
        // The Barbarian must jump from the edge of the pit which puts him at jump frame PIT_JUMP_EVADE_FRAME
        return this.getAction() === JUMP_LABEL && frame === PIT_JUMP_EVADE_FRAME;
    }

    didBarbarianEvadeAttack(monster) {
        let frame = this.getCurrentFrame(JUMP_LABEL);
        // While in the attack proximity the Barbarian has not evaded if he
        // 1. Reaches the MAX_AVOID_JUMP_FRAME jump frame (jumped too early)
        // 1. Experiences a jump frame < MIN_AVOID_JUMP_FRAME (jumped too late)
        return monster.isAction(ATTACK_LABEL) && this.isAction(JUMP_LABEL)
            && frame >= MIN_AVOID_JUMP_FRAME && frame < MAX_AVOID_JUMP_FRAME;
    }

    /**
     * Gets the Barbarian character.
     * @returns {Character} the Barbarian character
     */
    getBarbarian() {
        return this.barbarian;
    }

    /* private */
    shouldCpuChaseVertically(gameBoard) {
        return gameBoard.isWater(this.getScreenNumber()) &&
            this.getCpuVerticalChaseDirection() !== this.getVerticalDirection() &&
            !this.isBarbarian() && Math.abs(this.getY() - this.getBarbarian().getY()) > CHASE_PROXIMITY;
    }

    /* private */
    shouldCpuChaseHorizontally() {
        return Obstacle.isPastCharacter(this, this.getBarbarian()) && this.getProperties().getCanTurnAround();
    }

    /* private */
    moveCharacter(action, gameBoard) {
        if (action === DEATH_LABEL) {
            return;
        }
        if (action === FALL_LABEL || action === SINK_LABEL) {
            let pps = this.getProperties().getPixelsPerSecond(action);
            this.getAnimator().moveElementToPosition(undefined, 0, pps);
        } else {
            this.moveFromPositionToBoundary(gameBoard);
        }
    }

    /* private */
    prepareSprite() {
        return this.isDead() ? this.prepareDeathSprite() : this.getProperties().getSprite();
    }

    /* private */
    prepareDeathSprite() {
        let deathSprite = this.getProperties().getDeathSprite();
        deathSprite.show();
        deathSprite.css(CSS_LEFT_LABEL, this.getX() + CSS_PX_LABEL);
        if (!this.isBarbarian()) {
            this.getProperties().getSprite().hide();
        }
        return deathSprite;
    }

    /* private */
    isDeadButNotDying() {
        return this.isDead() && !this.isAction(FALL_LABEL) && !this.isAction(DEATH_LABEL) && !this.isAction(SINK_LABEL);
    }

    /* private */
    stopMovement() {
        this.getProperties().getSprite().stop();
    }

    /* private */
    moveFromPositionToBoundary(gameBoard) {
        this.getAnimator().moveElementToPosition(this.getMoveToX(),
            this.getMoveToY(gameBoard),
            this.getProperties().getPixelsPerSecond(this.getAction()));
    }

    /* private */
    getMoveToX() {
        return this.isFacingLeft() ? 0 : SCREEN_WIDTH - this.getWidth();
    }

    /* private */
    getMoveToY(gameBoard) {
        return gameBoard.isWater(this.getScreenNumber())
            ? this.shouldCPUGoToBarbarianY() ? this.getBarbarian().getY() : this.getVerticalBoundary()
            : undefined;
    }

    /* private */
    shouldCPUGoToBarbarianY() {
        return !this.isBarbarian() && !this.getBarbarian().isMovingVertically();
    }

    /* private */
    getVerticalBoundary() {
        return this.isDirectionDown() ? SCREEN_BOTTOM : SCREEN_HEIGHT - this.getHeight() / 2;
    }

    /* private */
    getProximity(opponent) {
        return Math.sqrt(Math.pow(Math.abs(this.getX() - opponent.getX()), 2)
            + Math.pow(Math.abs(this.getY() - opponent.getY()), 2));
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
    isAnimationInterrupted(requestedAction, requestedDirection, requestedVerticalDirection, gameBoard, frame) {
        return (this.getAction() !== requestedAction ||
            this.getDirection() !== requestedDirection ||
            this.getVerticalDirection() !== requestedVerticalDirection ||
            this.isAction(STOP_LABEL) ||
            this.shouldCpuChase(gameBoard) ||
            Obstacle.isStoppedByBoundary(this, gameBoard) ||
            this.getObstacles().didCharacterHitObstacle(this) ||
            this.isDeadButNotDying() ||
            !this.isOnScreen(gameBoard) ||
            this.shouldCpuLaunchAttack(gameBoard) ||
            this.shouldCpuFight(gameBoard) ||
            gameBoard.getIsPaused());
    }

    /* private */
    debugAnimationTermination(characterType, action, direction, vertDirection, gameBoard, frameIdx, frames) {
        console.log(this.getProperties().getType() + ' is done ' + action + 'ing');

        if (!(this.getAction() === action)) {
            console.log('character: ' + characterType + ' action: "' + this.getAction()
                + '" is not equal to requested action "' + action + '"');
        }
        if (!(this.getDirection() === direction)) {
            console.log('character: ' + characterType + ' action: "' + this.getDirection()
                + '" is not equal to requested direction "' + direction + '"');
        }
        if (!(this.getVerticalDirection() === vertDirection)) {
            console.log('character: ' + characterType + ' vertical direction: "' + this.getVerticalDirection()
                + '" is not equal to requested vertical direction "' + vertDirection + '"');
        }
        if (!(!this.isAction(STOP_LABEL))) {
            console.log('character: ' + characterType + ' is stopped');
        }
        if (!(!this.shouldCpuChase(gameBoard))) {
            console.log('character: ' + characterType + ' should chase the Barbarian');
        }
        if (!(!Obstacle.isStoppedByBoundary(gameBoard))) {
            console.log('character: ' + characterType + ' is stopped by boundary');
        }
        if (!(!this.getObstacles().didCharacterHitObstacle(this))) {
            console.log('character: ' + characterType + ' hit obstacle');
        }
        if (!(!(this.isDeadButNotDying()))) {
            console.log('character: ' + characterType + ' is dead but not dying');
        }
        if (!(this.isOnScreen(gameBoard))) {
            console.log('character: ' + characterType + ' is not on screen');
        }
        if (!(!this.shouldCpuLaunchAttack(gameBoard))) {
            console.log('character: ' + characterType + ' should launch a CPU attack');
        }
        if (!(!this.shouldCpuFight(gameBoard))) {
            console.log('character: ' + characterType + ' is CPU and should fight');
        }
        if (!(!gameBoard.isPaused)) {
            console.log('game is paused');
        }
        if (!(frameIdx < frames.length)) {
            console.log('frame ' + frameIdx + ' of ' + this.getProperties().getType() + ' ' +
                this.getAction() +  ' is not less than ' + frames.length);
        }
    }
}

