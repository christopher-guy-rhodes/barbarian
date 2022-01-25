/**
 * Class to build a collection of obstacles.
 */
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
            this.obstacles[screenNumber] = {left : [], right: []};
        }
        this.obstacles[screenNumber][direction].push(obstacle);
        return this;
    }

    /**
     * Build the Obstacles
     * @returns {Obstacles} the Obstacles object.
     */
    build() {
        for (let screenNumber of Object.keys(this.obstacles)) {
            // The left obstacles must be sorted descending by x
            if (this.obstacles[screenNumber][LEFT_LABEL] !== undefined) {
                this.obstacles[screenNumber][LEFT_LABEL].sort((a,b) => (a.x <= b.x) ? 1 : -1);
            }
            // The right obstacles must be sorted ascending by x
            if (this.obstacles[screenNumber][RIGHT_LABEL] !== undefined) {
                this.obstacles[screenNumber][RIGHT_LABEL].sort((a,b) => (a.x > b.x) ? 1 : -1);
            }
        }
        return new Obstacles(this.obstacles);
    }
}
