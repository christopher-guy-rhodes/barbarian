const SCREEN_BOTTOM = 12;
const BOTTOM_LABEL = 'bottom';
const ACTION_LABEL = 'action';
const DIRECTION_LABEL = 'direction';
const SPRITE_LABEL = 'sprite';
const FRAMES_LABEL = 'frames';
const HEIGHT_OFFSET_LABEL = 'heightOffset';
const FRAMES_PER_SECOND_LABEL = 'framesPerSecond';
const STATUS_LABEL = 'status';
const FALL_DELAY_LABELS = 'fallDelay';
const TIME_LABEL = 'time';
const TURNAROUND_LABEL = 'turnaround';
const PASSING_MULTIPLIER = 1.5;

/**
 * Class that supports character actions
 */
class Character {
    constructor(barbarian,
                obstacles,
                frames,
                characterType,
                sprite,
                action,
                status,
                direction,
                verticalDirection,
                reset,
                actionNumberOfTimes,
                death,
                pixelsPerSecond,
                framesPerSecond,
                canElevate,
                canHighlight,
                canLeaveBehind,
                sound,
                screenNumber,
                currentFrame,
                isInvincible) {
        if (barbarian === undefined) {
            this.barbarian = this;
        } else {
            this.barbarian = barbarian;
        }
        this.frames = frames;
        this.characterType = characterType;
        this.sprite = sprite;
        this.action = action;
        this.status = status;
        this.direction = direction;
        this.verticalDirection = verticalDirection;
        this.reset = reset;
        this.actionNumberOfTimes = actionNumberOfTimes;
        this.death = death;
        this.pixelsPerSecond = pixelsPerSecond;
        this.framesPerSecond = framesPerSecond;
        this.canElevate = canElevate;
        this.canHighlight = canHighlight;
        this.canLeaveBehind = canLeaveBehind;
        this.sound = sound;
        this.obstacles = obstacles;
        this.screenNumber = screenNumber;
        this.currentFrame = currentFrame;
        this.isInvincible = isInvincible;

        this.previousAction = undefined;
        this.animator = new Animator(this.sprite);
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
        //if (this.isBarbarian()) {
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
        this.animator.moveElementToPosition(x, y, pixelsPerSecond)
    }

    /**
     * Returns true if the character is at a horizontal boundary, false otherwise.
     * @param gameBoard the game board
     * @returns {boolean}
     */
    isAtBoundary(gameBoard) {
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
        return !this.isDirectionLeft() && this.getX() === SCREEN_WIDTH - this.sprite.width();
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

    isMovingVertically() {
        return this.getVerticalDirection() !== undefined;
    }

    /* private */
    isBarbarian() {
        return this.barbarian === undefined;
    }

    /* private */
    isAnimationInterrupted(requestedAction, requestedDirection, requestedVerticalDirection, gameBoard, frame) {
        return (this.getAction() !== requestedAction ||
            this.getDirection() !== requestedDirection ||
            this.getVerticalDirection() !== requestedVerticalDirection ||
            this.isStopped() ||
            this.shouldTurnaround() ||
            this.isAtBoundary(gameBoard) ||
            this.hitObstacle() ||
            this.isDeadButNotDying() ||
            !this.isOnScreen(gameBoard) ||
            this.shouldLaunchAttack(gameBoard) ||
            this.shouldCpuFight(gameBoard) ||
            gameBoard.getIsPaused());
    }

    /* private */
    moveCharacter(action, gameBoard) {
        if (action !== DEATH_LABEL) {
            if (action === FALL_LABEL || action === SINK_LABEL) {
                this.moveToPosition(undefined, 0, this.getPixelsPerSecond(FALL_LABEL));
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
                this.getSprite().hide();
            }
            return deathSprite;
        } else {
            return this.getSprite();
        }
    }

    /* private */
    isVisible() {
        return this.getSprite().css(CSS_DISPLAY_LABEL) === CSS_BLOCK_LABEL;
    }

    /* private */
    isDeadButNotDying() {
        return this.isDead() && !this.isFalling() && !this.isDying() && !this.isSinking();
    }

    /* private */
    stopMovement() {
        this.getSprite().stop();
    }

    /* private */
    moveFromPositionToBoundary(gameBoard) {
        let pixelsPerSecond = this.getPixelsPerSecond(this.getAction());
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


    shouldTurnaround() {
        return (!this.isBarbarian() && this.isPassedBarbarian() && this.getResetTurnaround());
    }

    isPassedBarbarian() {
        return this.isPastBarbarianLeft() || this.isPastBarbarianRight();
    }

    getObstacleEncountered() {
        return this.obstacles.getNextObstacle(this.getX(), this.getDirection(), this.getScreenNumber());
    }

    isPastObstacle(obstacle) {
        return obstacle.isPast(this.getX(), this.getDirection());
    }

    // TODO: move to fight class and set fight class object in this class
    shouldCpuFight(gameBoard) {

        if (this.barbarian.didJumpEvade() || this.getAction() === DEATH_LABEL) {
            return false;
        }

        return !this.isBarbarian() && !this.barbarian.isDead() &&
            this.getOpponentsWithinX(gameBoard, FIGHTING_RANGE_PIXELS)
                .filter(opponent => opponent.getCharacterType() != this.getCharacterType()).length > 0;
    }

    // TODO: move to fight class and set fight class object in this class
    shouldLaunchAttack(gameBoard) {

        return !this.isBarbarian() && !this.barbarian.isDead() && this.getAction() !== ATTACK_LABEL &&
            this.getAction() !== DEATH_LABEL && this.getOpponentsWithinX(gameBoard, CPU_ATTACK_RANGE_PIXELS).length > 0
    }

    // TODO: move to fight class and set fight class object in this class
    getOpponentsWithinX(gameBoard, proximityThreshold) {
        let attackers = [];
        let opponents = gameBoard.getOpponents(this.barbarian.getScreenNumber());
        for (let opponent of opponents) {
            let proximity = this.getProximity(opponent);
            if (proximity > 0 && proximity < proximityThreshold) {
                attackers.push(opponent);
            }
        }
        return attackers;
    }

    // TODO: move to fight class and set fight class object in this class
    getProximity(opponent) {
        let distanceX = Math.abs(this.getX() - opponent.getX());
        let distanceY = Math.abs(stripPxSuffix(this.getSprite().css('bottom'))
            - stripPxSuffix(opponent.getSprite().css('bottom')));
        return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
    }

    getX() {
        return parseInt(stripPxSuffix(this.sprite.css(CSS_LEFT_LABEL)));
    }

    getY() {
        return parseInt(stripPxSuffix(this.sprite.css('bottom')));
    }

    getHeight() {
        return parseInt(stripPxSuffix(this.getSprite().css('height')));
    }

    getWidth() {
        return parseInt(stripPxSuffix(this.getSprite().css('height')));
    }

    isOnScreen(gameBoard) {
        return gameBoard.getOpponents(this.barbarian.getScreenNumber()).includes(this);
    }

    isBarbarian() {
        return this === this.barbarian;
    }

    hide() {
        this.getSprite().css('display', 'none');
    }

    show() {
        this.getSprite().css('display', 'block');
    }

    isDead() {
        return this.getStatus() === DEAD_LABEL;
    }

    isAlive() {
        return this.getStatus() === ALIVE_LABEL;
    }

    isDirectionRight() {
        return this.getDirection() === RIGHT_LABEL;
    }

    isDirectionLeft() {
        return this.getDirection() === LEFT_LABEL;
    }

    isDirectionUp() {
        return this.getVerticalDirection() === UP_LABEL;
    }

    isDirectionDown() {
        return this.getVerticalDirection() === DOWN_LABEL;
    }

    isWalking() {
        return this.getAction() === WALK_LABEL;
    }

    isRunning() {
        return this.getAction() === RUN_LABEL;
    }

    isFalling() {
        return this.getAction() === FALL_LABEL;
    }

    isDying() {
        return this.getAction() === DEATH_LABEL;
    }

    isSinking() {
        return this.getAction() === SINK_LABEL;
    }

    isSwimming() {
        return this.getAction() === SWIM_LABEL;
    }

    isDying() {
        return this.getAction() === DEATH_LABEL;
    }

    isJumping() {
        return this.getAction() === JUMP_LABEL;
    }

    isAttacking() {
        return this.getAction() === ATTACK_LABEL;
    }

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

    isActionInfinite(action) {
        if (action === undefined) {
            throw new Error("isActionInfinite: action is a required parameter");
        }
        return this.getActionNumberOfTimes(action) === 0;
    }

    hitObstacle() {
        if (this.getAction() === FALL_LABEL) {
            return false;
        }
        let obstacle =  this.getObstacle();

        if (obstacle === undefined) {
            return false;
        } else if (obstacle.getType() === PIT_LABEL) {
            // TODO: put jump evade frame in config
            if (this.didJumpEvade() || !this.isBarbarian()) {
                return false;
            }
            return true;
        } else {
            return true;
        }
    }

    didJumpEvade() {
        return this.getAction() === JUMP_LABEL && this.getCurrentFrame(JUMP_LABEL) >= 3;
    }

    /*
     * Getters and setters
     */
    getFallDelay() {
        return this.death[FALL_DELAY_LABELS];
    }

    getCanLeaveBehind() {
        return this.canLeaveBehind;
    }

    getActionNumberOfTimes(action) {
        return this.actionNumberOfTimes[action];
    }

    getStatus() {
        return this.status;
    }

    getDeathTime() {
        return this.death[TIME_LABEL];
    }

    getDeathFallDelay() {
        return this.death[FALL_DELAY_LABELS];
    }

    getDeathSpriteHeightOffset(direction) {
        if (direction === undefined) {
            throw new Error("getDeathFrames: direction is a required parameter");
        }
        return this.death[FRAMES_LABEL][direction][HEIGHT_OFFSET_LABEL];
    }

    getDeathFrames(direction) {
        if (direction === undefined) {
            throw new Error("getDeathFrames: direction is a required parameter");
        }
        return this.death[FRAMES_LABEL][direction][FRAMES_LABEL];
    }

    getDeathFramesPerSecond() {
        return this.death[FRAMES_PER_SECOND_LABEL];
    }

    getStatus() {
        return this.status;
    }

    getIsInvincible() {
        return this.isInvincible;
    }

    getAction() {
        return this.action;
    }

    getVerticalDirection() {
        return this.verticalDirection;
    }

    getPixelsPerSecond(action) {
        if (action === undefined) {
            throw new Error("getPixelsPerSecond: action parameter is required");
        }
        return this.pixelsPerSecond[action];
    }

    getFramesPerSecond(action) {
        if (action === undefined) {
            throw new Error("getPixelsPerSecond: action parameter is required");
        }
        return this.framesPerSecond[action];
    }

    getResetAction() {
        return this.reset[ACTION_LABEL];
    }

    getResetDirection() {
        return this.reset[DIRECTION_LABEL];
    }

    getResetStatus() {
        return this.reset[STATUS_LABEL];
    }

    getResetTurnaround() {
        return this.reset[TURNAROUND_LABEL];
    }

    getDirection() {
        return this.direction;
    }

    getHeightOffset(action, direction) {
        if (action === undefined || direction === undefined) {
            throw new Error("getHeightOffset: action and direction are required parameters");
        }
        return this.frames[action][direction][HEIGHT_OFFSET_LABEL];
    }

    getFrames(action, direction) {
        if (action === undefined || direction === undefined) {
            throw new Error("getHeightOffset: action and direction are required parameters");
        }
        return this.frames[action][direction][FRAMES_LABEL];
    }

    getMinJumpThreshold() {
        return this.jumpThresholds[MIN_LABEL];
    }

    getMaxJumpThreshold() {
        return this.jumpThresholds[MAX_LABEL];
    }

    getSprite() {
        return this.sprite;
    }

    getResetLeft() {
        return this.reset[LEFT_LABEL];
    }

    getDeathSprite() {
        return this.death[SPRITE_LABEL];
    }

    getCharacterType() {
        return this.characterType;
    }

    getResetBottom(screenNumber) {
        if (screenNumber === undefined) {
            throw new Error("getResetBottom: screenNumber parameter required");
        }
        return this.reset[BOTTOM_LABEL][screenNumber];
    }

    getCanElevate() {
        return this.canElevate;
    }

    getCanHighlight() {
        return this.canHighlight;
    }

    getSound() {
        return this.sound;
    }

    getScreenNumber() {
        return this.screenNumber;
    }

    getCurrentFrame(action) {
        return this.currentFrame[action];
    }

    setAction(action) {
        this.action = action;
    }

    setDirection(direction) {
        this.direction = direction;
    }

    setVerticalDirection(direction) {
        this.verticalDirection = direction;
    }

    setStatus(status) {
        this.status = status;
    }

    setPreviousAction(action) {
        this.previousAction = action;
    }

    setDeathTime(time) {
        this.death[TIME_LABEL] = time;
    }

    setScreenNumber(screenNumber) {
        this.screenNumber = screenNumber;
    }

    setCurrentFrame(action, frame) {
        this.currentFrame[action] = frame;
    }

    setBottom(y) {
        this.sprite.css('bottom', y + 'px')
    }

    /* private */
    debugAnimationTermination(action, direction, vertDirection, gameBoard, frameIdx, frames) {
        console.log(this.getCharacterType() + ' is done ' + action + 'ing');

        if (!(this.getAction() === action)) {
            console.log('a');
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
        if (!(!this.shouldTurnaround())) {
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
        if (!(!this.shouldLaunchAttack(gameBoard))) {
            console.log('j');
        }
        if (!(!this.shouldCpuFight(gameBoard))) {
            console.log('k');
        }
        if (!(!gameBoard.isPaused)) {
            console.log('l');
        }
        if (!(frameIdx < frames.length)) {
            console.log('frame ' + frameIdx + ' of ' + this.characterType + ' ' + this.action +  ' is not less than ' + frames.length);
        }
    }
}

