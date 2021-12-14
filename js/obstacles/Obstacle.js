const JUMP_EVADE_THRESHOLD = 4;

class Obstacle {

    constructor(x, y, type, action, minJumpThreshold, maxJumpThreshold) {
        validateRequiredParams(this.constructor, arguments, 'x', 'y', 'type', 'action');
        if (minJumpThreshold !== undefined && maxJumpThreshold === undefined ||
            maxJumpThreshold !== undefined && minJumpThreshold === undefined) {
            throw new Error('Obstacle: both the min and max jump thresholds must be both included or both omitted');
        }

        this.x = x;
        this.y = y;
        this.type = type;
        this.action = action;
        if (minJumpThreshold !== undefined && maxJumpThreshold !== undefined) {
            this.jumpThresholds = {
                min: minJumpThreshold,
                max: maxJumpThreshold
            }
        } else {
            this.jumpThresholds = undefined;
        }
    }

    /**
     * Determine if the character is stopped by a boundary.
     * @param character the character
     * @param gameBoard the game board
     * @returns {boolean} true if the character is stopped by a boundary, false otherwise
     */
    static isStoppedByBoundary(character, gameBoard) {
        return !this.isAtWaterBoundary(character, gameBoard) && Obstacle.isAtBoundary(character, gameBoard);
    }

    /**
     * Determine if the character is past another character.
     * @param character the character
     * @param otherCharacter the character to check if the character has passed
     * @returns {boolean} true if character has passed otherCharacter, false otherwise
     */
    static isPastCharacter(character, otherCharacter) {
        return this.isPastCharacterLeft(character, otherCharacter) ||
            this.isPastCharacterRight(character, otherCharacter);
    }

    /**
     * Determine whether the character is at the boundary.
     * @param character the character
     * @param gameBoard the game board
     * @returns {boolean} true if the character is at the boundary, false otherwise
     */
    static isAtBoundary(character, gameBoard) {
        validateRequiredParams(this.isAtBoundary, arguments, 'gameBoard');
        return Obstacle.isCharacterAtLeftBoundary(character) || Obstacle.isCharacterAtRightBoundary(character);
    }

    /**
     * Get the x coordinate of the obstacle.
     * @returns {number} the x coordinate
     */
    getX() {
        return this.x;
    }

    /**
     * Determine if the obstacle is a traversable downhill elevation.
     * @param character the character attempting to traverse the obstacle
     * @returns {boolean} true if the elevation is traversable and downhill, false otherwise
     */
    isTraversableDownhillElevation(character) {
        return this.isDownHillFrom(character.getY()) || (!character.isBarbarian()
            && character.getProperties().getCanElevate());
    }

    /**
     * Get the type of obstacle.
     * @returns {string} the obstacle type
     */
    getType() {
        return this.type;
    }

    /**
     * Determine if this obstacle is an elevation.
     * @returns {boolean} true if this obstacle is an elevation, false otherwise.
     */
    getIsElevation() {
        return this.type === ELEVATION_LABEL;
    }

    /**
     * Determine if the obstacle is a pit.
     * @returns {boolean} true if the obstacle is a pit, false otherwise
     */
    getIsPit() {
        return this.type === OBSTACLE_PIT_LABEL;
    }

    /**
     * Get the obstacle height.
     * @returns {number} the obstacle height
     */
    getHeight() {
        return this.y;
    }

    /**
     * Returns this obstacle if the character has not avoided it, undefined otherwise.
     * @param character the character
     * @returns {Character|undefined}
     */
    filterIfCharacterAvoided(character) {
        return this.didCharacterHitObstacle(character) ? this : undefined;
    }

    /**
     * Returns true if the x coordinate is close to the obstacle but not past it if x is moving in the given direction.
     * @param x the x coordinate
     * @param direction the direction the x coordinate is moving
     * @returns {boolean} true if the x coordinate is close to the obstacle but not past it, false otherwise
     */
    isCloseButNotPast(x, direction) {
        if (direction === RIGHT_LABEL) {
            return x - 50 < this.x;
        } else {
            return x + 50 > this.x;
        }
    }

    /**
     * Determine if the character evaded the obstacle with a jump.
     * @param character the character
     * @returns {boolean} true if the character evaded the obstacle with a jump, false otherwise
     */
    didCharacterJumpEvade(character) {
        return character.getAction() === JUMP_LABEL && character.getCurrentFrame(JUMP_LABEL) < JUMP_EVADE_THRESHOLD;
    }

    /* private */
    static isAtWaterBoundary(character, gameBoard) {
        return !gameBoard.isScrollAllowed(character.getScreenNumber(), character.getHorizontalDirection()) &&
            gameBoard.isWater(character.getScreenNumber());
    }

    /* private */
    static isPastCharacterLeft(character, otherCharacter) {
        return character.isFacingLeft()
            && character.getX() + character.getWidth() * PASSING_MULTIPLIER < otherCharacter.getX() ||
                Obstacle.isCharacterAtLeftBoundary(character);
    }

    /* private */
    static isPastCharacterRight(character, otherCharacter) {
        return character.isFacingRight() &&
            character.getX() - character.getWidth() * PASSING_MULTIPLIER > otherCharacter.getX() ||
                Obstacle.isCharacterAtRightBoundary(character);
    }

    /* private */
    static isCharacterAtLeftBoundary(character) {
        return !character.isFacingRight() && character.getX() === 0;
    }

    /* private */
    static isCharacterAtRightBoundary(character) {
        return !character.isFacingLeft()
            && character.getX() === SCREEN_WIDTH - character.getProperties().getSprite().width();
    }

    /* private */
    isPast(x, direction) {
        if (direction === RIGHT_LABEL) {
            return x > this.x;
        } else {
            return x < this.x;
        }
    }

    /* private */
    isDownHillFrom(y) {
        return this.y <= y && this.type !== OBSTACLE_PIT_LABEL;
    }

    /* private */
    hitElevation(character) {
        return this.getIsElevation() && character.getY() != this.getHeight();
    }

    /* private */
    isCharacterPastObstacle(character) {
        return !character.isDead() && this.isPast(character.getX(), character.getHorizontalDirection());
    }

    /* private */
    didCharacterHitObstacle(character) {
        return this.isCharacterPastObstacle(character) &&
            (this.didCharacterHitElevation(character) || this.didBarbarianFallInPit(character));
    }

    /* private */
    didCharacterHitElevation(character) {
        return this.hitElevation(character) && (!character.isBarbarian() || !character.isAction(ATTACK_LABEL));
    }

    /* private */
    didJumpEvadePit(character) {
        let frame = character.getCurrentFrame(JUMP_LABEL);
        // The Barbarian must jump from the edge of the pit which puts him at jump frame PIT_JUMP_EVADE_FRAME
        return character.getAction() === JUMP_LABEL && frame === PIT_JUMP_EVADE_FRAME;
    }

    /* private */
    didBarbarianFallInPit(character) {
        return this.getIsPit() && character.isBarbarian() && !this.didJumpEvadePit(character)
            && !character.isAction(FALL_LABEL);
    }
}
