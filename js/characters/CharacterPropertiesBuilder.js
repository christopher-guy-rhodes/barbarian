class CharacterPropertiesBuilder {
    constructor(sprite, characterType, defaultX) {
        validateRequiredParams(this.constructor, arguments, 'sprite', 'characterType', 'defaultX');
        this.sprite = sprite;
        this.frames = {};
        this.deathSprite = $('.death');
        this.characterType = characterType;
        this.defaultX = defaultX;
        this.canElevate = true;
        this.canHighlight = true;
        this.canLeaveBehind = false;
        this.canTurnAround = true;
        this.sprite = sprite;
        this.isInvincible = false;
        this.sound = undefined;
        this.defaultStatus = DEAD_LABEL;
        this.defaultAction = WALK_LABEL;

        this.defaultDirection = {
            x : LEFT_LABEL,
            y : undefined
        };

        this.defaultBottom = {};

        this.actionNumberOfTimes = {
            run : 0,
            walk: 0,
            swim : 0,
            attack: 0,
            sink: 0,
            sit: 0,
            jump: 1,
            stop: 1,
            fall: 1,
            death: 1
        };

        this.pixelsPerSecond = {
            walk: DEFAULT_PIXELS_PER_SECOND,
            swim : DEFAULT_PIXELS_PER_SECOND,
            run : DEFAULT_PIXELS_PER_SECOND * RUN_SPEED_INCREASE_FACTOR,
            jump: DEFAULT_PIXELS_PER_SECOND,
            attack: DEFAULT_PIXELS_PER_SECOND,
            stop: 0,
            fall: DEFAULT_PIXELS_PER_SECOND,
            sink: DEFAULT_PIXELS_PER_SECOND,
            sit: 0,
            death: 0,
        };

        this.framesPerSecond = {
            walk: SPRITE_FPS,
            swim: SWIM_FPS,
            run: SPRITE_FPS * RUN_SPEED_INCREASE_FACTOR,
            jump: SPRITE_FPS,
            attack: SPRITE_FPS,
            stop: 0,
            fall: SPRITE_FPS,
            sit: SPRITE_FPS,
            death: SPRITE_FPS
        };
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

    withDeathSprite(sprite) {
        validateRequiredParams(this.withDeathSprite, arguments, 'sprite');
        this.deathSprite = sprite;
        return this;
    }

    withIsInvincible(flag) {
        validateRequiredParams(this.withIsInvincible, arguments, 'flag');
        this.isInvincible = flag;
        return this;
    }

    withDefaultStatus(flag) {
        validateRequiredParams(this.withDefaultStatus, arguments, 'flag');
        this.defaultStatus = flag;
        return this;
    }

    withDefaultAction(action) {
        validateRequiredParams(this.withDefaultAction, arguments, 'action');
        this.defaultAction = action;
        return this;
    }

    withDefaultDirection(direction) {
        validateRequiredParams(this.withDefaultDirection, arguments, 'direction');
        this.defaultDirection[HORIZONTAL_LABEL] = direction;
        return this;
    }

    withDefaultBottom(screenNumber, bottom) {
        validateRequiredParams(this.withDefaultBottom, arguments, 'screenNumber', 'bottom');
        this.defaultBottom[screenNumber] = bottom;
        return this;
    }

    withActionNumberOfTimes(action, numberOfTimes) {
        validateRequiredParams(this.withActionNumberOfTimes, arguments, 'action', 'numberOfTimes');
        this.actionNumberOfTimes[action] = numberOfTimes;
        return this;
    }

    withPixelsPerSecond(action, pixelsPerSecond) {
        if (action === undefined || pixelsPerSecond === undefined) {
            throw new Error("withPixelsPerSecond: Both action and pixelsPerSecond arguments must be set");
        }
        this.pixelsPerSecond[action] = pixelsPerSecond;
        return this;
    }

    withFramesPerSecond(action, fps) {
        if (action === undefined || fps === undefined) {
            throw new Error("withFps: Both action and fps arguments must be set");
        }
        this.framesPerSecond[action] = fps;
        return this;
    }

    withFrames(frames) {
        this.frames = frames;
        return this;
    }

    build() {
        if (this.frames === undefined) {
            throw new Error("CharacterPropertiesBuilder: frames is required although not a part of the constructor " +
                "for readability, please use 'withFrames'");
        }
        return new CharacterProperties(this.sprite, this.frames, this.deathSprite, this.characterType, this.defaultX,
            this.canElevate, this.canHighlight, this.canLeaveBehind, this.canTurnAround, this.isInvincible, this.sound,
            this.actionNumberOfTimes, this.pixelsPerSecond, this.framesPerSecond, this.defaultStatus,
            this.defaultAction, this.defaultDirection, this.defaultBottom);
    }
}
