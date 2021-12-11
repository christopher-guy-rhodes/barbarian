const EMPTY_OBSTACLE = new Obstacle(0, 0, OBSTACLE_NONE_LABEL, STOP_LABEL, 0, 0);

class Obstacles {

    constructor(obstacles) {
        this.obstacles = obstacles;
    }

    didCharacterHitObstacle(character) {
        return this.getCharacterObstacle(character) !== undefined;
    }

    getCharacterObstacle(character) {
        return this.getNextObstacle(character.getX(), character.getHorizontalDirection(), character.getScreenNumber())
            .filterIfCharacterAvoided(character);
    }

    getNextObstacle(x, direction, screenNumber) {
        if (this.obstacles[screenNumber] === undefined || this.obstacles[screenNumber][direction] === undefined) {
            return EMPTY_OBSTACLE;
        }
        let obstacle =
            this.obstacles[screenNumber][direction].filter(obstacle => obstacle.isCloseButNotPast(x, direction))[0];
        return obstacle === undefined ? EMPTY_OBSTACLE : obstacle;
    }

    get(screenNumber, direction) {
        return this.obstacles[screenNumber][direction];
    }
}
