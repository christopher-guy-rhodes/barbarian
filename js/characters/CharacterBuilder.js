const RUN_SPEED_INCREASE_FACTOR = 1.5;

class CharacterBuilder {

    constructor(barbarian, obstacles, frames) {
        this.barbarian = barbarian;
        this.obstacles = obstacles;
        this.frames = frames;

        this.action = undefined;

        this.direction = {
            x : LEFT_LABEL,
            y : undefined
        };

        this.defaults = {
            status : DEAD_LABEL,
            left : 850,
            action : WALK_LABEL,
            direction : LEFT_LABEL,
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
            sink: 0,
            sit: 0,
            jump: 1,
            stop: 1,
            fall: 1,
            death: 1
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
            sit: 0,
            death: DEFAULT_PIXELS_PER_SECOND,
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

        this.jumpThresholds = {
            min: 15,
            max: 100
        };

        this.screenNumber = 0;

        this.currentFrame = {
            stop: 0,
            sit: 0,
            attack: 0,
            walk: 0,
            fall: 0,
            run: 0,
            jump: 0,
            swim: 0,
            sink: 0
        }

    }

    withProperties(properties) {
        this.properties = properties;
        return this;
    }

    withVerticalDirection(direction) {
        this.direction[VERTICAL_LABEL] = direction;
        return this;
    }

    withAction(action) {
        this.action = action;
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

    withDefaultAction(action) {
        this.defaults.action = action;
        return this;
    }

    withDefaultBottom(screenNumber, value) {
        if (screenNumber === undefined || value == undefined) {
            throw new Error("withBottom: Both screenNumber and value must be set");
        }
        this.defaults.bottom[screenNumber] = value;
        return this;
    }

    withDefaultLeft(left) {
        this.defaults.left = left;
        return this;
    }

    withDefaultDirection(direction) {
        this.defaults.direction = direction;
        return this;
    }

    withDefaultStatus(status) {
        this.defaults.status= status;
        return this;
    }

    withDirection(direction) {
        this.direction[HORIZONTAL_LABEL] = direction;
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

    withScreenNumber(screenNumber) {
        this.screenNumber = screenNumber;
        return this;
    }

    build() {
        if (this.properties.getType() === undefined) {
            throw new Error('CharacterBuilder build error: character type property is missing');
        }
        if (this.frames === undefined) {
            throw new Error('CharacterBuilder build error: frames are missing');
        }
        if (this.obstacles === undefined) {
            throw new Error('CharacterBuilder build error: obstacles are missing');
        }

        return new Character(
            this.barbarian,
            this.obstacles,
            this.frames,
            this.properties,
            this.action,
            this.direction,
            this.defaults,
            this.actionNumberOfTimes,
            this.death,
            this.pixelsPerSecond,
            this.framesPerSecond,
            this.screenNumber,
            this.currentFrame);
    }
}
