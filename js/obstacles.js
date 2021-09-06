/**
 * Determines if the sprite avoided the obstacle with a jump.
 * @param character the character
 * @param obstacle the obstacle the sprite is dealing with
 * @returns {boolean} true if the sprite avoided the obstacle, false otherwise
 */
function hasEvadedObstacleWithJump(character, obstacle) {
    return getProperty(character, ACTION) === JUMP &&
        character.getSprite().offset().left >
        getProperty(obstacle, JUMP_THRESHOLDS, MIN) &&
        character.getSprite().offset().left <
        getProperty(obstacle, JUMP_THRESHOLDS, MAX);
}

/**
 * Determines if the obstacle is downhill from the perspective of the sprite.
 * @param character the sprite
 * @param obstacle the obstacle
 * @returns {boolean} true if the obstacle is lower than the sprite, false otherwise
 */
function isDownhill(character, obstacle) {
    return getProperty(obstacle, HEIGHT) <= stripPxSuffix(character.getSprite().css('bottom')) &&
        !compareProperty(obstacle, OBSTACLE_TYPE, PIT);
}

/**
 * Determines if the character is past the obstacle boundary.
 * @param character the character
 * @param obstacle the obstacle
 * @returns {boolean} true if the sprite is past the boundary, false otherwise
 */
function isPastBoundary(character, obstacle) {
    if (character.getDirection() === RIGHT) {
        return character.getSprite().offset().left >= getProperty(obstacle, LEFT);
    } else {
        return character.getSprite().offset().left <= getProperty(obstacle, LEFT);
    }
}

/**
 * Returns true if the character is close to the obstacle
 * @param character the character
 * @param obstacle the obstacle
 * @returns {boolean} true if the sprite is close to the obstacle, false otherwise
 */
function isObstacleClose(character, obstacle) {
    return Math.abs(getProperty(obstacle, LEFT) - character.getSprite().offset().left) <=
        OBSTACLE_CLOSE_PROXIMITY;
}

/**
 * Gets the obstacles near the character.
 * @param character the characters
 * @returns {[]} the list of obstacles
 */
function getObstacles(character) {
    return getProperty(SCREENS, screenNumber, OBSTACLES, character.getDirection())
        .filter(obstacle => isObstacleClose(character, obstacle));
}

/**
 * Handles obstacles for the character (pits, elevation changes etc.).
 * @param character the character encountering the obstacles
 * @returns {boolean} true if the obstacle stops the animation, false otherwise
 */
function handleObstacles(character) {

    if (character.getAction() === FALL) {
        // Don't want to handle obstacles while falling to prevent infinite recursion in the animateSprite method
        return false;
    }

    animateTrapDoor(character);

    for (let obstacle of getObstacles(character)) {
        if (isPastBoundary(character, obstacle)) {
            if (character.getName() !== BARBARIAN_SPRITE_NAME ||
                isDownhill(character, obstacle) ||
                hasEvadedObstacleWithJump(character, obstacle)) {
                if (character.getCanElevate()) {
                    setCss(character.getSprite().css('bottom', getProperty(obstacle, HEIGHT) + 'px'));
                }
            } else {

                let action = getProperty(obstacle, FAIL_ACTION);

                if (action === FALL) {
                    playFallSound();
                    setTimeout(function () {
                        barbarianDeath(character, FALL);
                    },  character.getFallDelay());
                }

                if (character.getAction() !== ATTACK) {
                    character.getSprite().stop();
                    performAction(character, action, character.getActionNumberOfTimes(action));
                    return true;
                } else {
                    return false;
                }
            }
        }
    }

    return false;
}
