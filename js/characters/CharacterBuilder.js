const RUN_SPEED_INCREASE_FACTOR = 1.5;

class CharacterBuilder {

    /**
     * Construct a character builder.
     * @param barbarian the Barbarian character. Undefined for the Barbarian
     * @param obstacles the obstacles that the character will face
     */
    constructor(barbarian, obstacles) {
        validateRequiredParams(this.constructor, arguments, 'obstacles');
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

    /**
     * Set the character properties.
     * @param properties the character properties
     * @returns {CharacterBuilder}
     */
    withProperties(properties) {
        validateRequiredParams(this.withProperties, arguments, 'properties');
        this.properties = properties;
        return this;
    }

    /**
     * Set the character action.
     * @param action the action
     * @returns {CharacterBuilder}
     */
    withAction(action) {
        validateRequiredParams(this.withAction, arguments, 'action');
        this.action = action;
        return this;
    }

    /**
     * Set the character horizontal direction.
     * @param direction the direction
     * @returns {CharacterBuilder}
     */
    withHorizontalDirection(direction) {
        validateRequiredParams(this.withHorizontalDirection, arguments, 'direction');
        this.direction[HORIZONTAL_LABEL] = direction;
        return this;
    }

    /**
     * Set the character screen number
     * @param screenNumber the screen number
     * @returns {CharacterBuilder}
     */
    withScreenNumber(screenNumber) {
        validateRequiredParams(this.withScreenNumber, arguments, 'screenNumber');
        this.screenNumber = screenNumber;
        return this;
    }

    /**
     * Build the character object.
     * @returns {Character}
     */
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
