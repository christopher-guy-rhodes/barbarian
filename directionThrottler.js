var lastDirectionChangeTime = 0;

/**
 * Throttles rapid diretion changes.
 *
 * @param requestedDirection The requested direction that may be throttled.
 * @returns True if throttling should be performed, false otherwise.
 */
function shouldThrottleDirectionChange(requestedDirection) {
    var isDirectionChange = oldaction === (requestedDirection === WALK_LEFT ? WALK_RIGHT : WALK_LEFT);
    if (isDirectionChange) {
        var currentTime = new Date().getTime();
        if (lastDirectionChangeTime === 0 ) {
            lastDirectionChangeTime = currentTime;
        } else {
            var elapsedTimeSinceDirectionChange = currentTime - lastDirectionChangeTime;
            if (elapsedTimeSinceDirectionChange >= DIRECTION_CHANGE_DELAY) {
                lastDirectionChangeTime = currentTime;
            }
        }
    }
    if (isDirectionChange && elapsedTimeSinceDirectionChange < DIRECTION_CHANGE_DELAY) {
        return true;
    }
    return false;
}

