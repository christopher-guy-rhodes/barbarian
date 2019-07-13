/**
 * Determine if the barbarian is currently attacking.
 *
 * @param action the current action.
 * @returns True if the barbarian is attacking, false otherwise.
 */
function isAttacking(action) {
    return ATTACKING.includes(action);
}

/**
 * Determine if the barbarian is moving right.
 *
 * @param action The current action.
 * @returns True if the barbarian is moving right, false otherwise.
 */
function isMovingRight(action) {
    return MOVING_RIGHT.includes(action);
}

/**
 * Determine if the barbarian is facing right.
 *
 * @ param action The current action.
 * @returns True if the barbarian is facing right, false otherwise
 */
function isFacingRight(action) {
    return FACING_RIGHT.includes(action);
}

/**
 * Determine if the barbarian is facing left.
 *
 * @ param action The current action.
 * @returns True if the barbarian is facing left, false otherwise
 */
function isFacingLeft(action) {
    return FACING_LEFT.includes(action);
}

/**
 * Determine if the barbarian is moving left.
 *
 * @param action The current action.
 * @returns True if the barbarian is moving left, false otherwise.
 */
function isMovingLeft(action) {
    return MOVING_LEFT.includes(action);
}
