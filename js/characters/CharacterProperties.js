class CharacterProperties {
    constructor(sprite, characterType, canElevate, canHighlight, canLeaveBehind, canTurnAround, isInvincible, sound,
                status) {
        validateRequiredParams(this.constructor, arguments, 'sprite', 'characterType', 'canElevate', 'canHighlight',
            'canLeaveBehind', 'canTurnAround', 'isInvincible', 'status');
        this.sprite = sprite;
        this.characterType = characterType;
        this.canElevate = canElevate;
        this.canHighlight = canHighlight;
        this.canLeaveBehind = canLeaveBehind;
        this.canTurnaround = canTurnAround;
        this.isInvincible = isInvincible;
        this.sound = sound;
        this.status = status;
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

    getStatus() {
        return this.status;
    }

    setStatus(status) {
        validateRequiredParams(this.setStatus, 'status');
        this.status = status;
    }
}
