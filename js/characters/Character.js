class Character {
    constructor(frames,
                characterType,
                sprite,
                name,
                action,
                status,
                direction,
                verticalDirection,
                reset,
                actionNumberOfTimes,
                death,
                pixelsPerSecond,
                framesPerSecond,
                attackThresholds,
                barbarianAttackThresholds,
                jumpThresholds,
                canElevate,
                canHighlight,
                canLeaveBehind,
                sound) {
        this.frames = frames;
        this.characterType = characterType;
        this.sprite = sprite;
        this.name = name;
        this.action = action;
        this.status = status;
        this.direction = direction;
        this.verticalDirection = verticalDirection;
        this.reset = reset;
        this.actionNumberOfTimes = actionNumberOfTimes;
        this.death = death;
        this.pixelsPerSecond = pixelsPerSecond;
        this.framesPerSecond = framesPerSecond;
        this.attackThresholds = attackThresholds;
        this.barbarianAttackThresholds = barbarianAttackThresholds;
        this.jumpThresholds = jumpThresholds;
        this.canElevate = canElevate;
        this.canHighlight = canHighlight;
        this.canLeaveBehind = canLeaveBehind;
        this.sound = sound;
        this.previousAction = undefined;

        if (this.sprite === undefined) {
            alert('something is wrong');
        }
        this.animator = new Animator(this.sprite);
    }

    stopAnimation() {
        this.getSprite().stop();
    }

    /**
     * Moves from the current position to the boundary.
     * @param action the character action
     * @param pixelsPerSecond the rate at which to move
     */
    moveFromPositionToBoundary() {
        let pixelsPerSecond = this.getPixelsPerSecond(this.getAction());
        if (pixelsPerSecond <= 0) {
            // If the sprite isn't moving (stop, non-moving attack etc.) to not move it to the boundary
            return;
        }

        let x, y = undefined;
        if (this.getAction() === FALL) {
            y = 0;
        } else {

            if (compareProperty(SCREENS, screenNumber, WATER, true) && this.getName() !== BARBARIAN_SPRITE_NAME) {
                // Make water creates chase the barbarian in 2 dimensions
                let barbarianY = stripPxSuffix(getCss(BARBARIAN_CHARACTER.getSprite(), 'bottom'));
                y = stripPxSuffix(this.getSprite().css('bottom'));
                if (barbarianY > y) {
                    y = SCREEN_HEIGHT - this.getSprite().height() / 2;
                } else {
                    y = SCREEN_BOTTOM;
                }
            } else if (this.getVerticalDirection() === UP) {
                y = SCREEN_HEIGHT - this.getSprite().height() / 2;
            } else if (this.getVerticalDirection() === DOWN) {
                y = SCREEN_BOTTOM;
            }

            if (this.getDirection() === LEFT) {
                x = 0;
            } else if (this.getDirection() === RIGHT) {
                x = windowWidth - this.getSprite().width();
            }
        }
        this.moveToPosition(x, y, pixelsPerSecond);
    }


    moveToPosition(x, y, pixelsPerSecond) {
        this.animator.moveElementToPosition(x, y, pixelsPerSecond)
    }

    isStopped() {
        return this.action === STOP;
    }

    isAtLeftBoundary() {
        return this.direction !== RIGHT && this.sprite.offset().left === 0
    }

    isAtRightBoundary() {
        return this.direction === RIGHT && this.sprite.offset().left === SCREEN_WIDTH - this.sprite.width();
    }

    /*
     * Getters and setters
     */
    getFallDelay() {
        return this.death[FALL_DELAY];
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
        return this.death[TIME];
    }

    getDeathSpriteHeightOffset(direction) {
        if (direction === undefined) {
            throw new Error("getDeathFrames: direction is a required parameter");
        }
        return this.death[FRAMES][direction][HEIGHT_OFFSET];
    }

    getDeathFrames(direction) {
        if (direction === undefined) {
            throw new Error("getDeathFrames: direction is a required parameter");
        }
        return this.death[FRAMES][direction][FRAMES];
    }

    getDeathFramesPerSecond() {
        return this.death[FRAMES_PER_SECOND];
    }

    getMinAttackThreshold() {
        return this.attackThresholds[MIN];
    }

    getMaxAttackThreshold() {
        return this.attackThresholds[MAX];
    }

    getMinBarbarianAttackThreshold() {
        return this.barbarianAttackThresholds[MIN];
    }

    getMaxBarbarianAttackThreshold() {
        return this.barbarianAttackThresholds[MAX];
    }

    getPreviousAction() {
        return this.previousAction;
    }

    getStatus() {
        return this.status;
    }

    getName() {
        return this.name;
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

    getResetNumberOfTimes() {
        return this.reset[NUMBER_OF_TIMES];
    }

    getResetAction() {
        return this.reset[ACTION];
    }

    getResetDirection() {
        return this.reset[DIRECTION];
    }

    getResetStatus() {
        return this.reset[STATUS];
    }

    getResetTurnaround() {
        return this.reset[TURNAROUND];
    }

    getDeathDelay() {
        return this.death[DELAY];
    }

    getDirection() {
        return this.direction;
    }

    getHeightOffset(action, direction) {
        if (action === undefined || direction === undefined) {
            throw new Error("getHeightOffset: action and direction are required parameters");
        }
        return this.frames[action][direction][HEIGHT_OFFSET];
    }

    getFrames(action, direction) {
        if (action === undefined || direction === undefined) {
            throw new Error("getHeightOffset: action and direction are required parameters");
        }
        return this.frames[action][direction][FRAMES];
    }

    getMinJumpThreshold() {
        return this.jumpThresholds[MIN];
    }

    getMaxJumpThreshold() {
        return this.jumpThresholds[MAX];
    }

    getSprite() {
        return this.sprite;
    }

    getResetLeft() {
        return this.reset[LEFT];
    }

    getDeathSprite() {
        return this.death[SPRITE];
    }

    getCharacterType() {
        return this.characterType;
    }

    getResetBottom(screenNumber) {
        if (screenNumber === undefined) {
            throw new Error("getResetBottom: screenNumber parameter required");
        }
        return this.reset[BOTTOM][screenNumber];
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

    setDeathDelay(delay) {
        this.death[DELAY] = delay;
    }

    setDeathTime(time) {
        this.death[TIME] = time;
    }
}

