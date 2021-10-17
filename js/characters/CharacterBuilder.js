const RUN_SPEED_INCREASE_FACTOR = 1.5;

class CharacterBuilder {

    constructor(barbarian, obstacles) {
        this.barbarian = barbarian;
        this.obstacles = obstacles;

        this.action = undefined;

        this.direction = {
            x : LEFT_LABEL,
            y : undefined
        };

        this.status = DEAD_LABEL;

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

    withDirection(direction) {
        this.direction[HORIZONTAL_LABEL] = direction;
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
        if (this.obstacles === undefined) {
            throw new Error('CharacterBuilder build error: obstacles are missing');
        }

        return new Character(
            this.barbarian,
            this.obstacles,
            this.properties,
            this.action,
            this.direction,
            this.status,
            this.screenNumber,
            this.currentFrame);
    }
}
