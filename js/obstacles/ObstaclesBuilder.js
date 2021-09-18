class ObstaclesBuilder {

    constructor() {
        this.obstacles = {};
    }

    withObstacle(screenNumber, direction, obstacle) {
        if (this.obstacles[screenNumber] === undefined) {
            this.obstacles[screenNumber] = {};
        }
        if (this.obstacles[screenNumber][direction] === undefined) {
            this.obstacles[screenNumber][direction] = [];
        }
        this.obstacles[screenNumber][direction].push(obstacle);
        return this;
    }

    build() {
        return new Obstacles(this.obstacles);
    }
}
