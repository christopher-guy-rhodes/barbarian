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
    }

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

