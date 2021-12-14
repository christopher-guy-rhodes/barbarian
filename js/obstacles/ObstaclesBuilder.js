class ObstaclesBuilder {

    /**
     * Create an obstacles builder.
     */
    constructor() {
        this.obstacles = {};
    }

    /**
     * Set the obstacles for the screen number and direction.
     * @param screenNumber the screen number
     * @param direction the direction
     * @param obstacle the obstacle
     * @returns {ObstaclesBuilder} this obstacle builder
     */
    withObstacle(screenNumber, direction, obstacle) {
        validateRequiredParams(this.withObstacle, arguments, 'screenNumber', 'direction', 'obstacle');
        if (this.obstacles[screenNumber] === undefined) {
            this.obstacles[screenNumber] = {};
        }
        if (this.obstacles[screenNumber][direction] === undefined) {
            this.obstacles[screenNumber][direction] = [];
        }
        this.obstacles[screenNumber][direction].push(obstacle);
        return this;
    }

    /**
     * Build eh Obstacles
     * @returns {Obstacles} the Obstacles object.
     */
    build() {
        return new Obstacles(this.obstacles);
    }
}
