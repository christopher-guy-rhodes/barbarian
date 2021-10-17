const DEFAULT_BOTTOM = 12;
class CharacterProperties {
    constructor(sprite, deathSprite, characterType, defaultX, canElevate, canHighlight, canLeaveBehind, canTurnAround,
                isInvincible, sound, actionNumberOfTimes, pixelsPerSecond, framesPerSecond, defaultStatus,
                defaultAction, defaultDirection, defaultBottom) {
        validateRequiredParams(this.constructor, arguments, 'sprite', 'deathSprite', 'characterType', 'canElevate',
            'canHighlight', 'canLeaveBehind', 'canTurnAround', 'isInvincible', 'actionNumberOfTimes', 'defaultStatus',
            'defaultAction', 'defaultX', 'defaultDirection', 'defaultBottom');
        this.sprite = sprite;
        this.deathSprite = deathSprite;
        this.characterType = characterType;
        this.defaultX = defaultX;
        this.canElevate = canElevate;
        this.canHighlight = canHighlight;
        this.canLeaveBehind = canLeaveBehind;
        this.canTurnaround = canTurnAround;
        this.isInvincible = isInvincible;
        this.sound = sound;
        this.actionNumberOfTimes = actionNumberOfTimes;
        this.pixelsPerSecond = pixelsPerSecond;
        this.framesPerSecond = framesPerSecond;
        this.defaultStatus = defaultStatus;
        this.defaultAction = defaultAction;
        this.defaultX = defaultX;
        this.defaultDirection = defaultDirection;
        this.defaultBottom = defaultBottom;
    }

    getType() {
        return this.characterType;
    }

    getCanElevate() {
        return this.canElevate;
    }

    getCanHighlight() {
        return this.canHighlight;
    }

    getCanLeaveBehind() {
        return this.canLeaveBehind;
    }

    getCanTurnAround() {
        return this.canTurnaround;
    }

    getSprite() {
        return this.sprite;
    }

    getSound() {
        return this.sound;
    }

    getIsInvincible() {
        return this.isInvincible;
    }

    getDefaultStatus() {
        return this.defaultStatus;
    }

    getDefaultAction() {
        return this.defaultAction;
    }

    getDefaultX() {
        return this.defaultX;
    }

    getDeathSprite() {
        return this.deathSprite;
    }

    getDefaultDirection() {
        return this.defaultDirection[HORIZONTAL_LABEL];
    }

    getActionNumberOfTimes(action) {
        validateRequiredParams(this.getActionNumberOfTimes, arguments, 'action');
        if (this.actionNumberOfTimes[action] === undefined) {
            throw new Error("getActionNumberOfTimes: there are no number of times configured for \"" + action + "\"");
        }
        return this.actionNumberOfTimes[action];
    }

    getPixelsPerSecond(action) {
        validateRequiredParams(this.getPixelsPerSecond, arguments, 'action');
        return this.pixelsPerSecond[action];
    }

    getFramesPerSecond(action) {
        return this.framesPerSecond[action];
    }

    getDefaultBottom(screenNumber) {
        validateRequiredParams(this.getDefaultBottom, arguments, 'screenNumber');
        if (this.defaultBottom[screenNumber] === undefined) {
            return DEFAULT_BOTTOM;
        } else {
            return this.defaultBottom[screenNumber];
        }
    }
}
