class Obstacles {

    constructor(obstacles) {
        this.obstacles = obstacles;
    }

    getNextObstacle(x, direction, screenNumber) {
        if (this.obstacles[screenNumber] === undefined || this.obstacles[screenNumber][direction] === undefined) {
            return undefined;
        }
        return this.obstacles[screenNumber][direction].filter(obstacle => obstacle.isCloseButNotPast(x, direction))[0];
    }

    get(screenNumber, direction) {
        return this.obstacles[screenNumber][direction];
    }
}
