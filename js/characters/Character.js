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

    stopAnimation() {
        this.getSprite().stop();
    }

    /**
     * Moves from the current position to the boundary.
     */
    moveFromPositionToBoundary(gameBoard) {
        let pixelsPerSecond = this.getPixelsPerSecond(this.getAction());
        if (pixelsPerSecond <= 0) {
            // If the sprite isn't moving (stop, non-moving attack etc.) to not move it to the boundary
            return;
        }

        let x, y = undefined;
        if (this.getAction() === FALL_LABEL) {
            y = 0;
        } else {
            if (gameBoard.isWater(this.getScreenNumber()) && !this.isBarbarian()) {
                // Make water creates chase the barbarian in 2 dimensions
                let barbarianY = stripPxSuffix(this.barbarian.getSprite().css('bottom'));
                y = stripPxSuffix(this.getSprite().css('bottom'));
                if (barbarianY > y) {
                    y = SCREEN_HEIGHT - this.getSprite().height() / 2;
                } else {
                    y = SCREEN_BOTTOM;
                }
            } else if (this.getVerticalDirection() === UP_LABEL) {
                y = SCREEN_HEIGHT - this.getSprite().height() / 2;
            } else if (this.getVerticalDirection() === DOWN_LABEL) {
                y = SCREEN_BOTTOM;
            }

            if (this.getDirection() === LEFT_LABEL) {
                x = 0;
            } else if (this.getDirection() === RIGHT_LABEL) {
                x = windowWidth - this.getSprite().width();
            }
        }
        this.moveToPosition(x, y, pixelsPerSecond);
    }


    moveToPosition(x, y, pixelsPerSecond) {
        this.animator.moveElementToPosition(x, y, pixelsPerSecond)
    }

    isStopped() {
        return this.action === STOP_LABEL;
    }

    isAtLeftBoundary() {
        // non visible items with have an offset of zero, don't consider that a boundary
        if (this.sprite.css('display') !== 'block') {
            return false;
        }
        return this.direction !== RIGHT_LABEL && this.sprite.offset().left === 0
    }

    isAtRightBoundary() {
        // non visible items with have an offset of zero, don't consider that a boundary
        if (this.sprite.css('display') !== 'block') {
            return false;
        }
        return this.direction === RIGHT_LABEL && this.sprite.offset().left === SCREEN_WIDTH - this.sprite.width();
    }

    isAtBoundary(requestedDirection) {
        return this.isAtLeftBoundary() || this.isAtRightBoundary();
    }

    isPastBarbarianLeft() {
        if (this.barbarian === undefined) {
            return false;
        }

        return this.getDirection() === LEFT_LABEL &&
        this.getSprite().offset().left + this.getSprite().width() * PASSING_MULTIPLIER <
        this.barbarian.getSprite().offset().left || this.isAtLeftBoundary();
    }

    isPastBarbarianRight() {
        if (this.barbarian === undefined) {
            return false;
        }
        return this.getDirection() === RIGHT_LABEL &&
        this.getSprite().offset().left - this.getSprite().width() * PASSING_MULTIPLIER >
        this.barbarian.getSprite().offset().left || this.isAtRightBoundary();
    }

    shouldTurnaround() {
        return (!this.isBarbarian() && this.isPassedBarbarian() && this.getResetTurnaround());
    }

    isPassedBarbarian() {
        return this.isPastBarbarianLeft() || this.isPastBarbarianRight();
    }

    getObstacleEncountered() {
        return this.obstacles.getNextObstacle(this.sprite.offset().left, this.getDirection(), this.getScreenNumber());
    }

    isPastObstacle(obstacle) {
        return obstacle.isPast(this.sprite.offset().left, this.getDirection());
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
        let distanceX = Math.abs(this.getSprite().offset().left - opponent.getSprite().offset().left);
        let distanceY = Math.abs(stripPxSuffix(this.getSprite().css('bottom'))
            - stripPxSuffix(opponent.getSprite().css('bottom')));
        return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
    }

    /**
     * Animate a character across the game board. Relies on the isPaused global variable.
     * @param gameBoard the game board to perform the animation on
     * @param requestedAction the requested action (run, walk, attack etc.)
     * @param requestedDirection the requested direction to move the character (left or right)
     * @param requestedVerticalDirection the requested virtical direction to move the character (up or down)
     * @param numberOfTimes the number of times to perform the animation loop (zero for infinite)
     * @param idx the frame index offset
     * @returns {Promise<number>} the frame for the action and direction that the animation stopped on
     */
    async animate(gameBoard, requestedAction, requestedDirection, requestedVerticalDirection, numberOfTimes, idx) {

        if (requestedAction !== DEATH_LABEL) {
            this.moveFromPositionToBoundary(gameBoard);
        }

        let frames = this.getFrames(requestedAction, this.getDirection());

        let frame = idx;
        this.setCurrentFrame(requestedAction, frame);
        let counter = numberOfTimes;

        while (this.getAction() === requestedAction &&
               this.getDirection() === requestedDirection &&
               this.getVerticalDirection() === requestedVerticalDirection &&
               !this.isStopped() &&
               !this.shouldTurnaround() &&
               !this.isAtBoundary(requestedDirection) &&
               !this.hitObstacle() &&
               !(this.isDead() && !this.isFalling() && !this.isDying()) &&
               this.isOnScreen(gameBoard) &&
               !(this.shouldLaunchAttack(gameBoard)) &&
               !this.shouldCpuFight(gameBoard) &&
               !game.getIsPaused() &&
               frame < frames.length) {

            let sprite = undefined;
            if (this.getAction() === DEATH_LABEL) {
                sprite = this.getDeathSprite();
                sprite.show();
                if (this.getSprite().css('display') === 'block') {
                    sprite.css('left', this.getX() + 'px');
                }
                if (!this.isBarbarian()) {
                    this.getSprite().hide();
                }
            } else {
                sprite = this.getSprite();
            }

            let heightOffset = this.getHeightOffset(requestedAction,
                this.getDirection()) * sprite.height();
            sprite.css('background-position',
                -1*frames[frame++]*sprite.width() + 'px ' + -1 *heightOffset + 'px');
            this.setCurrentFrame(requestedAction, frame);

            await sleep(MILLISECONDS_PER_SECOND / this.getFramesPerSecond(requestedAction));

            if (frame === frames.length) {
                // If times is 0 we loop infinitely, if times is set decrement it and keep looping
                if (counter === 0 || --counter > 0) {
                    frame = 0;
                    this.setCurrentFrame(requestedAction, frame);
                }
            }
        }

        /*
        uncomment to find out why character was stopped if it was unexpected
        if (this.isBarbarian()) {
            console.log(this.getCharacterType() + ' is done ' + requestedAction + 'ing');

            if (!(this.getAction() === requestedAction)) {
                console.log('a');
            }
            if (!(this.getDirection() === requestedDirection)) {
                console.log('b');
            }
            if (!(this.getVerticalDirection() === requestedVerticalDirection)) {
                console.log('c');
            }
            if (!(!this.isStopped())) {
                console.log('d');
            }
            if (!(!this.shouldTurnaround())) {
                console.log('e');
            }
            if (!(!this.isAtBoundary())) {
                console.log('f');
            }
            if (!(!this.hitObstacle())) {
                console.log('g');
            }
            if (!(!(this.isDead() && !this.isFalling() && !this.isDying()))) {
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
            if (!(!game.isPaused)) {
                console.log('l');
            }
            if (!(frame < frames.length)) {
                console.log('frame ' + frame + ' of ' + this.characterType + ' ' + this.action +  ' is not less than ' + frames.length);
            }

        }

         */
        return frame;
    }

    getX() {
        return this.sprite.offset().left;
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
}

