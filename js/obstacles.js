/**
 * Determines if the sprite avoided the obstacle with a jump.
 * @param character the character
 * @param obstacle the obstacle the sprite is dealing with
 * @returns {boolean} true if the sprite avoided the obstacle, false otherwise
 */
function hasEvadedObstacleWithJump(character, obstacle) {
    return getProperty(character, ACTION) === JUMP &&
        getProperty(character, SPRITE).offset().left >
        getProperty(obstacle, JUMP_THRESHOLDS, MIN) &&
        getProperty(character, SPRITE).offset().left <
        getProperty(obstacle, JUMP_THRESHOLDS, MAX);
}

/**
 * Determines if the obstacle is downhill from the perspective of the sprite.
 * @param character the sprite
 * @param obstacle the obstacle
 * @returns {boolean} true if the obstacle is lower than the sprite, false otherwise
 */
function isDownhill(character, obstacle) {
    return getProperty(obstacle, HEIGHT) <= stripPxSuffix(getProperty(character, SPRITE).css('bottom')) &&
        !compareProperty(obstacle, OBSTACLE_TYPE, PIT);
}

/**
 * Determines if the character is past the obstacle boundary.
 * @param character the character
 * @param obstacle the obstacle
 * @returns {boolean} true if the sprite is past the boundary, false otherwise
 */
function isPastBoundary(character, obstacle) {
    if (compareProperty(character, DIRECTION, RIGHT)) {
        return getProperty(character, SPRITE).offset().left >= obstacle[LEFT];
    } else {
        return getProperty(character, SPRITE).offset().left <= obstacle[LEFT];
    }
}

/**
 * Returns true if the character is close to the obstacle
 * @param character the character
 * @param obstacle the obstacle
 * @returns {boolean} true if the sprite is close to the obstacle, false otherwise
 */
function isObstacleClose(character, obstacle) {
    return Math.abs(getProperty(obstacle, LEFT) - getProperty(character, SPRITE).offset().left) <=
        OBSTACLE_CLOSE_PROXIMITY;
}

/**
 * Gets the obstacles near the character.
 * @param character the characters
 * @returns {[]} the list of obstacles
 */
function getObstacles(character) {
    return getProperty(SCREENS, screenNumber, OBSTACLES, getProperty(character, DIRECTION))
        .filter(obstacle => isObstacleClose(character, obstacle));
}

/**
 * Handles obstacles for the character (pits, elevation changes etc.).
 * @param character the character encountering the obstacles
 * @returns {boolean} true if the obstacle stops the animation, false otherwise
 */
function handleObstacles(character) {

    if (getProperty(character, ACTION) === FALL) {
        // Don't want to handle obstacles while falling to prevent infinite recursion in the animateSprite method
        return false;
    }

    animateTrapDoor(character);

    for (let obstacle of getObstacles(character)) {
        if (isPastBoundary(character, obstacle)) {
            if (!compareProperty(character, NAME, BARBARIAN_SPRITE_NAME) ||
                isDownhill(character, obstacle) ||
                hasEvadedObstacleWithJump(character, obstacle)) {
                if (compareProperty(character, CAN_ELEVATE, true)) {
                    setCss(getProperty(character, SPRITE).css('bottom', obstacle[HEIGHT] + 'px'));
                }
            } else {

                let action = getProperty(obstacle, FAIL_ACTION);

                if (action === FALL) {
                    playFallSound();
                    setTimeout(function () {
                        barbarianDeath(character, FALL);
                    },  getProperty(character, DEATH, DELAY) * (1 / getProperty(character, FPS, action)));
                }

                if (!compareProperty(character, ACTION, ATTACK)) {
                    getProperty(character, SPRITE).stop();
                    performAction(character, action);
                    return true;
                } else {
                    return false;
                }
            }
        }
    }

    return false;
}
