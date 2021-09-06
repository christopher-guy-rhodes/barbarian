class CharacterBuilder {
    constructor(frames, characterType, sprite) {
        this.frames = frames;
        this.characterType = characterType;
        this.sprite = sprite;
        this.name = undefined;
        this.action = WALK;
        this.status = DEAD;
        this.direction = LEFT;
        this.verticalDirection = undefined;

        this.reset = {
            status : DEAD,
            numberOfTimes : 0,
            left : 850,
            action : WALK,
            direction : LEFT,
            turnaround : true,
            bottom : {
                0: 12,
                1: 12,
                2: 12,
                3: 12
            }
        };

        this.actionNumberOfTimes = {
            run : 0,
            walk: 0,
            swim : 0,
            attack: 0,
            jump: 1,
            stop: 1,
            fall: 1
        };

        this.death = {
            sprite : $('.death'),
            frames : {
                right: {
                    frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    heightOffset: 0
                },
                left: {
                    frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    heightOffset: 0
                },
            },
            framesPerSecond : SPRITE_FPS,
            delay : 1800,
            fallDelay : 800,
            time : 0
        };

        this.pixelsPerSecond = {
            walk: DEFAULT_PIXELS_PER_SECOND,
            swim : DEFAULT_PIXELS_PER_SECOND,
            run : DEFAULT_PIXELS_PER_SECOND * RUN_SPEED_INCREASE_FACTOR,
            jump: DEFAULT_PIXELS_PER_SECOND,
            attack: DEFAULT_PIXELS_PER_SECOND,
            stop: 0,
            fall: DEFAULT_PIXELS_PER_SECOND,
            sit: 0
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
        };

        this.attackThresholds = {
            min: 0,
            max: 100
        };

        this.barbarianAttackThresholds = {
            min: 0,
            max: 115
        };

        this.jumpThresholds = {
            min: 15,
            max: 100
        };

        this.canElevate = true;
        this.canHighlight = true;
        this.canLeaveBehind = false;
        this.sound = undefined;
        this.previousAction = undefined;
    }

    withCanLeaveBehind(flag) {
        this.canLeaveBehind = flag;
        return this;
    }

    withVerticalDirection(direction) {
        this.verticalDirection = direction;
    }

    withName(name) {
        this.name = name;
        return this;
    }

    withAction(action) {
        this.action = action;
        return this;
    }

    withDeathDelay(delay) {
        this.death.delay = delay;
        return this;
    }

    withDeathTime(time) {
        this.death.time = time;
        return this;
    }

    withDeathSprite(sprite) {
        this.death.sprite = sprite;
        return this;
    }

    withDeathFrames(frames) {
        this.death.frames = frames;
        return this;
    }

    withDeathFramesPerSecond(fps) {
        this.death.framesPerSecond = fps;
    }

    withSound(sound) {
        this.sound = sound;
        return this;
    }

    withResetAction(action) {
        this.reset.action = action;
        return this;
    }

    withResetBottom(screenNumber, value) {
        if (screenNumber === undefined || value == undefined) {
            throw new Error("withBottom: Both screenNumber and value must be set");
        }
        this.reset.bottom[screenNumber] = value;
        return this;
    }

    withResetLeft(left) {
        this.reset.left = left;
        return this;
    }

    withResetTurnaround(isEnabled) {
        this.reset.turnaround = isEnabled;
        return this;
    }

    withResetDirection(direction) {
        this.reset.direction = direction;
        return this;
    }

    withResetStatus(status) {
        this.reset.status= status;
        return this;
    }

    withDirection(direction) {
        this.direction = direction;
        return this;
    }

    withCanElevate(canElevate) {
        this.canElevate = canElevate;
        return this;
    }

    withCanHighlight(canHighlight) {
        this.canHighlight = canHighlight;
        return this;
    }

    withFramesPerSecond(action, fps) {
        if (action === undefined || fps === undefined) {
            throw new Error("withFps: Both action and fps arguments must be set");
        }
        this.framesPerSecond[action] = fps;
        return this;
    }

    withPixelsPerSecond(action, pixelsPerSecond) {
        if (action === undefined || pixelsPerSecond === undefined) {
            throw new Error("withPixelsPerSecond: Both action and pixelsPerSecond arguments must be set");
        }
        this.pixelsPerSecond[action] = pixelsPerSecond;
        return this;
    }

    withActionNumberOfTimes(action, numberOfTimes) {
        if (action === undefined || numberOfTimes === undefined) {
            throw new Error("withActionNumberOfTimes: Action and numberOfTimes arguments must be set");
        }
        this.actionNumberOfTimes[action] = numberOfTimes;
        return this;
    }

    withMinAttackThreshold(min) {
        this.attackThresholds[MIN] = min;
        return this;
    }

    withMaxAttackThreshold(max) {
        this.attackThresholds[MAX] = max;
        return this;
    }

    withMinJumpThreshold(min) {
        this.jumpThresholds[MIN] = min;
        return this;
    }

    withMaxJumpThreshold(max) {
        this.jumpThresholds[MAX] = max;
        return this;
    }

    withMinBarbarianAttackThreshold(min) {
        this.barbarianAttackThresholds[MIN] = min;
        return this;
    }

    withMaxBarbarianAttackThreshold(max) {
        this.barbarianAttackThresholds[MAX] = max;
        return this;
    }


    withStatus(statu) {
        this.status = status;
        return this;
    }

    build() {
        if (this.sprite === undefined) {
            throw new Error('CharacterBuilder build error: sprite is missing')
        }
        if (this.characterType === undefined) {
            throw new Error('CharacterBuilder build error: character type is missing');
        }
        if (this.frames === undefined) {
            throw new Error('CharacterBuilder build error: frames are missing');
        }
        return new Character(this.frames,
            this.characterType,
            this.sprite,
            this.name,
            this.action,
            this.status,
            this.direction,
            this.verticalDirection,
            this.reset,
            this.actionNumberOfTimes,
            this.death,
            this.pixelsPerSecond,
            this.framesPerSecond,
            this.attackThresholds,
            this.barbarianAttackThresholds,
            this.jumpThresholds,
            this.canElevate,
            this.canHighlight,
            this.canLeaveBehind,
            this.sound);
    }
}
