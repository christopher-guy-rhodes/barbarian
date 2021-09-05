class CharacterBuilder {
    constructor(frames, characterType, sprite) {
        this.frames = frames;
        this.characterType = characterType;
        this.sprite = sprite;

        this.config = {
            SPRITE: this.sprite,
            CHARACTER_TYPE : characterType,
            NAME: undefined,
            ACTION: WALK,
            PREVIOUS_ACTION: undefined,
            DIRECTION: LEFT,
            CAN_ELEVATE: true,
            CAN_HIGHLIGHT: true,
            FPS: {
                WALK: SPRITE_FPS,
                SWIM: SWIM_FPS,
                RUN: SPRITE_FPS * RUN_SPEED_INCREASE_FACTOR,
                JUMP: SPRITE_FPS,
                ATTACK: SPRITE_FPS,
                STOP: 0,
                FALL: SPRITE_FPS,
                SIT: SPRITE_FPS,
            },
            PIXELS_PER_SECOND: {
                WALK: BARBARIAN_SPRITE_PIXELS_PER_SECOND,
                SWIM : BARBARIAN_SPRITE_PIXELS_PER_SECOND,
                RUN : BARBARIAN_SPRITE_PIXELS_PER_SECOND * RUN_SPEED_INCREASE_FACTOR,
                JUMP: BARBARIAN_SPRITE_PIXELS_PER_SECOND,
                ATTACK: BARBARIAN_SPRITE_PIXELS_PER_SECOND,
                STOP: 0,
                FALL: BARBARIAN_SPRITE_PIXELS_PER_SECOND,
                SIT: 0
            },
            STATUS: DEAD,
            FRAMES: this.frames,
            ATTACK_THRESHOLDS: {
                MIN: 0,
                MAX: 100
            },
            JUMP_THRESHOLDS: {
                MIN: 15,
                MAX: 100
            },
            BARBARIAN_ATTACK_THRESHOLDS: {
                MIN: 0,
                MAX: 115
            },
            DEATH: {
                SPRITE: $(".death"),
                DELAY: 1800,
                TIME: 0,
                FRAMES: {
                    DEATH: {
                        RIGHT: {
                            FRAMES: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                            HEIGHT_OFFSET: 0
                        },
                        LEFT: {
                            FRAMES: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                            HEIGHT_OFFSET: 0
                        },
                        FPS: BOG_MONSTER_SPRITE_FPS
                    }
                },
            },
            SOUND: undefined,
            RESET: {
                ACTION: WALK,
                DIRECTION: LEFT,
                LEFT: 850,
                BOTTOM: {
                    0: 12,
                    1: 12,
                    2: 12,
                    3: 12
                },
                STATUS: DEAD,
                NUMBER_OF_TIMES: 0,
                TURNAROUND: true
            }
        };

    }

    withName(name) {
        this.config.NAME = name;
        return this;
    }

    withAction(action) {
        this.config.ACTION = action;
        return this;
    }

    withSound(sound) {
        this.config.SOUND = sound;
        return this;
    }

    withResetAction(action) {
        this.config.RESET.ACTION = action;
        return this;
    }

    withResetBottom(screenNumber, value) {
        if (screenNumber === undefined || value == undefined) {
            throw new Error("withBottom: Both screenNumber and value must be set");
        }
        this.config.RESET.BOTTOM[screenNumber] = value;
        return this;
    }

    withResetLeft(left) {
        this.config.RESET.LEFT = left;
        return this;
    }

    withResetTurnaround(isEnabled) {
        this.config.RESET[TURNAROUND] = isEnabled;
        return this;
    }

    withResetDirection(direction) {
        this.config.RESET[DIRECTION] = direction;
        return this;
    }

    withDirection(direction) {
        this.config.DIRECTION = direction;
        return this;
    }

    withResetStatus(status) {
        this.config.RESET[STATUS] = status;
        return this;
    }

    withCanElevate(canElevate) {
        this.config.CAN_ELEVATE = canElevate;
        return this;
    }

    withCanHighlight(canHighlight) {
        this.config.CAN_HIGHLIGHT = canHighlight;
        return this;
    }

    withFps(action, fps) {
        if (action === undefined || fps === undefined) {
            throw new Error("withFps: Both action and fps arguments must be set");
        }
        this.config.FPS[action] = fps;
        return this;
    }

    withPixelsPerSecond(action, pixelsPerSecond) {
        this.config.PIXELS_PER_SECOND[action] = pixelsPerSecond;
        return this;
    }

    withMinAttackThreshold(min) {
        this.config.ATTACK_THRESHOLDS[MIN] = min;
        return this;
    }

    withMaxAttackThreshold(max) {
        this.config.ATTACK_THRESHOLDS[MAX] = max;
        return this;
    }

    withMinJumpThreshold(min) {
        this.config.JUMP_THRESHOLDS[MIN] = min;
        return this;
    }

    withMaxJumpThreshold(max) {
        this.config.JUMP_THRESHOLDS[MAX] = max;
        return this;
    }

    withMinBarbarianAttackThreshold(min) {
        this.config.BARBARIAN_ATTACK_THRESHOLDS[MIN] = min;
        return this;
    }

    withMaxBarbarianAttackThreshold(max) {
        this.config.BARBARIAN_ATTACK_THRESHOLDS[MAX] = max;
        return this;
    }

    withDeathSprite(sprite) {
        this.config.DEATH[SPRITE] = sprite;
        return this;
    }

    withDeathFrames(frames) {
        this.config.DEATH[FRAMES] = frames;
        return this;
    }

    withStatus(statu) {
        this.config[STATUS] = status;
        return this;
    }

    build() {
        if (this.config.SPRITE === undefined) {
            throw new Error('Sprite is missing')
        }
        if (this.config.CHARACTER_TYPE === undefined) {
            throw new Error('Character type is missing');
        }
        if (this.config.FRAMES === undefined) {
            throw new Error('Frames are missing');
        }
        return this.config;
    }
}

