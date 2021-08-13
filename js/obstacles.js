/**
 * Determines if the sprite avoided the obstacle with a jump.
 * @param sprite the sprite
 * @param obstacle the obstacle the sprite is dealing with
 * @returns {boolean} true if the sprite avoided the obstacle, false otherwise
 */
function hasEvadedObstacleWithJump(sprite, obstacle) {
    return getProperty(sprite, ACTION) === JUMP && getProperty(sprite, SPRITE).offset().left > getProperty(obstacle, JUMP_THRESHOLDS, MIN) &&
        getProperty(sprite, SPRITE).offset().left < getProperty(obstacle, JUMP_THRESHOLDS, MAX);
}

/**
 * Determines if the obstacle is downhill from the perspective of the sprite.
 * @param sprite the sprite
 * @param obstacle the obstacle
 * @returns {boolean} true if the obstacle is lower than the sprite, false otherwise
 */
function isDownhill(sprite, obstacle) {
    return getObstacleHeight(obstacle) <= getSpriteBottom(sprite) && getObstacleType(obstacle) !== PIT;
}

/**
 * Get the height of the obstacle.
 * @param obstacle the obstacle to get the height of
 * @returns {int} the obstacle height
 */
function getObstacleHeight(obstacle) {
    return obstacle[HEIGHT];
}

/**
 * Get the left position of the obstacle.
 * @param obstacle the obstacle to get the left position of
 * @returns {int} the obstacle left position
 */
function getObstacleLeft(obstacle) {
    return obstacle[LEFT];
}

/**
 * Get the type of the obstacle.
 * @param obstacle the obstacle to get the type of
 * @returns {string} obstacle type
 */
function getObstacleType(obstacle) {
    return obstacle[OBSTACLE_TYPE];
}

/**
 * Determines if the sprite is past the obstacle boundary.
 * @param sprite the sprite
 * @param obstacle the obstacle
 * @returns {boolean} true if the sprite is past the boundary, false otherwise
 */
function isPastBoundary(sprite, obstacle) {
    if (compareProperty(sprite, DIRECTION, RIGHT)) {
        return getProperty(sprite, SPRITE).offset().left >= obstacle[LEFT];
    } else {
        return getProperty(sprite, SPRITE).offset().left <= obstacle[LEFT];
    }
    return false;
}

/**
 * Returns true if the sprite is close to the obstacle
 * @param sprite the sprite
 * @param obstacle the obstacle
 * @returns {boolean} true if the sprite is close to the obstacle, false otherwise
 */
function isObstacleClose(sprite, obstacle) {
    return Math.abs(getObstacleLeft(obstacle) - getProperty(sprite, SPRITE).offset().left) <= OBSTACLE_CLOSE_PROXIMITY;
}

/**
 * Gets the obstacles near the sprite.
 * @param sprite the sprite
 * @returns {[]} the list of obstacles
 */
function getObstacles(sprite) {
    let obstacles = SCREENS[screenNumber][OBSTACLES][sprite[DIRECTION]];

    let result = [];
    for (let obstacle of obstacles) {
        if (isObstacleClose(sprite, obstacle)) {
            result.push(obstacle);
        }
    }

    return result;
}

/**
 * Handles obstacles for the sprite (pits, elevation changes etc.).
 * @param sprite the barbarian sprite
 * @returns {boolean} true if the obstacle stop or starts a new animation, false otherwise
 */
function handleObstacles(sprite) {

    if (getProperty(sprite, ACTION) === FALL) {
        // Don't want to handle obstacles while falling to prevent infinite recursion in the animateSprite method
        return false;
    }

    animateTrapDoor(sprite);

    for (const obstacle of getObstacles(sprite)) {
        if (isPastBoundary(sprite, obstacle)) {
            if (!compareProperty(sprite, NAME, BARBARIAN_SPRITE_NAME) ||
                isDownhill(sprite, obstacle) ||
                hasEvadedObstacleWithJump(sprite, obstacle)) {
                setCss(getProperty(sprite, SPRITE).css('bottom', obstacle[HEIGHT] + 'px'));
            } else {
                getProperty(sprite, SPRITE).stop();

                let action = getProperty(obstacle, FAIL_ACTION);

                if (action === FALL) {
                    playFallSound();
                    setTimeout(function () {
                        barbarianDeath(sprite, FALL);
                    },  getProperty(sprite, DEATH, DELAY) * (1 / getProperty(sprite, FPS, action)));
                }

                performAction(sprite, action);
                // Allow barbarian to attack at boundary
                if (getProperty(sprite, ACTION) !== ATTACK || getProperty(sprite, ACTION) !== JUMP) {
                    return true;
                }
            }
        }
    }

    return false;
}
