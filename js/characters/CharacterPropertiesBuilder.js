class CharacterPropertiesBuilder {
    constructor(sprite, characterType) {
        validateRequiredParams(this.constructor, arguments, 'sprite', 'characterType')
        this.sprite = sprite;
        this.characterType = characterType;
        this.canElevate = true;
        this.canHighlight = true;
        this.canLeaveBehind = false;
        this.canTurnAround = true;
        this.sprite = sprite;
        this.isInvincible = false;
        this.sound = undefined;
        this.status = DEAD_LABEL;
    }

    withCanElevate(flag) {
        validateRequiredParams(this.withCanElevate, arguments, 'flag');
        this.canElevate = flag;
        return this;
    }

    withCanHighlight(flag) {
        validateRequiredParams(this.withCanHighlight, arguments, 'flag');
        this.canHighlight = flag;
        return this;
    }

    withCanLeaveBehind(flag) {
        validateRequiredParams(this.withCanLeaveBehind, arguments, 'flag');
        this.canLeaveBehind = flag;
        return this;
    }

    withCanTurnAround(flag) {
        validateRequiredParams(this.withCanTurnAround, arguments, 'flag');
        this.canTurnAround = flag;
        return this;
    }

    withSound(sound) {
        this.sound = sound;
        return this;
    }

    withIsInvincible(flag) {
        validateRequiredParams(this.withIsInvincible, arguments, 'flag');
        this.isInvincible = flag;
        return this
    }

    build() {
        return new CharacterProperties(this.sprite, this.characterType, this.canElevate, this.canHighlight,
            this.canLeaveBehind, this.canTurnAround, this.isInvincible, this.sound, this.status);
    }
}
