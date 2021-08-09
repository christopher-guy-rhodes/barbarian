/**
 * Determines if the sprite avoided the obstacle with a jump.
 * @param sprite the sprite
 * @param obstacle the obstacle the sprite is dealing with
 * @returns {boolean} true if the sprite avoided the obstacle, false otherwise
 */
function hasEvadedObstacleWithJump(sprite, obstacle) {
    return getAction(sprite) === JUMP && getLeft(sprite) > getLowerJumpThreshold(obstacle) &&
        getLeft(sprite) < getUpperJumpThreshold(obstacle);
}

/**
 * Determines if the obstacle is downhill from the perspective of the sprite.
 * @param sprite the sprite
 * @param obstacle the obstacle
 * @returns {boolean} true if the obstacle is lower than the sprite, false otherwise
 */
function isDownhill(sprite, obstacle) {
    return getObstacleHeight(obstacle) <= getBottom(sprite) && getObstacleType(obstacle) !== PIT;
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
 * Moves the sprite the the specified height.
 * @param sprite the sprite to move
 * @param height the height to move the sprite too
 */
function moveSpriteToHeight(sprite, height) {
    setSpriteBottom(sprite, height);
}

/**
 * Determines if the sprite is past the obstacle boundary.
 * @param sprite the sprite
 * @param obstacle the obstacle
 * @returns {boolean} true if the sprite is past the boundary, false otherwise
 */
function isPastBoundary(sprite, obstacle) {
    if (isMovingRight(sprite)) {
        return getLeft(sprite) >= obstacle[LEFT];
    } else {
        return getLeft(sprite) <= obstacle[LEFT];
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
    return Math.abs(getObstacleLeft(obstacle) - getLeft(sprite)) <= OBSTACLE_CLOSE_PROXIMITY;
}

/**
 * Gets the obstacles near the sprite.
 * @param sprite the sprite
 * @returns {[]} the list of obstacles
 */
function getObstacles(sprite) {
    let obstacles = SCREENS[getScreenNumber()][OBSTACLES][sprite[DIRECTION]];

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

    if (getAction(sprite) === FALL) {
        // Don't want to handle obstacles while falling to prevent infinite recursion in the animateSprite method
        return false;
    }

    animateTrapDoor(sprite);

    for (const obstacle of getObstacles(sprite)) {
        if (isPastBoundary(sprite, obstacle)) {
            if (isMonster(sprite) || isDownhill(sprite, obstacle) || hasEvadedObstacleWithJump(sprite, obstacle)) {
                moveSpriteToHeight(sprite, obstacle[HEIGHT]);
            } else {
                stopSpriteMovement(sprite);

                let action = getFailAction(obstacle);

                if (action === FALL) {
                    playFallSound();
                    setTimeout(function () {
                        barbarianDeath(sprite, FALL);
                    },  getDeathDelay(sprite) * (1 / getFps(sprite, action)));
                }

                performAction(sprite, action);
                // Allow barbarian to attack at boundary
                if (getAction(sprite) !== ATTACK || getAction(sprite) !== JUMP) {
                    return true;
                }
            }
        }
    }

    return false;
}

/**
 * Gets the fail action for a particular obstacle.
 * @param obstacle the obstacle to get the fail action for
 * @returns {String} the fail action
 */
function getFailAction(obstacle) {
    return obstacle[FAIL_ACTION];
}

