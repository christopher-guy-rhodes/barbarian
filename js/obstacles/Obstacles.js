const EMPTY_OBSTACLE = new Obstacle(0, 0, OBSTACLE_NONE_LABEL, STOP_LABEL, 0, 0);

class Obstacles {

    /**
     * Create an Obstacles object
     * @param obstacles the list of obstacles this object controls
     */
    constructor(obstacles) {
        validateRequiredParams(this.constructor, arguments, 'obstacles');
        this.obstacles = obstacles;
    }

    /**
     * Determine if the character hit the next obstacle.
     * @param character the character
     * @returns {boolean} true if the character hit the obstacle, false otherwise
     */
    didCharacterHitObstacle(character) {
        validateRequiredParams(this.didCharacterHitObstacle, arguments, 'character');
        return this.getCharacterObstacle(character) !== undefined;
    }

    /**
     * Get the closest obstacle that the character has not avoided.
     * @param character the character
     * @returns {Obstacle} the obstacle
     */
    getCharacterObstacle(character) {
        validateRequiredParams(this.getCharacterObstacle, arguments, 'character');
        return this.getNextObstacle(character.getX(), character.getHorizontalDirection(), character.getScreenNumber())
            .filterIfCharacterAvoided(character);
    }

    /* private */
    getNextObstacle(x, direction, screenNumber) {
        validateRequiredParams(this.getNextObstacle, arguments, 'x', 'direction', 'screenNumber');
        if (this.obstacles[screenNumber] === undefined || this.obstacles[screenNumber][direction] === undefined) {
            return EMPTY_OBSTACLE;
        }
        let obstacle =
            this.obstacles[screenNumber][direction].filter(obstacle => obstacle.isCloseButNotPast(x, direction))[0];
        return obstacle === undefined ? EMPTY_OBSTACLE : obstacle;
    }
}
