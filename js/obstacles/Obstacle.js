const JUMP_EVADE_THRESHOLD = 4;

class Obstacle {

    constructor(x, y, type, action, minJumpThreshold, maxJumpThreshold) {

        if (x === undefined) {
            throw new Error('Obstacle: x is a required parameter');
        }
        if (y === undefined) {
            throw new Error('Obstacle: y is a required parameter');
        }
        if (type === undefined) {
            throw new Error('Obstacle: type is a required parameter');
        }
        if (action === undefined) {
            throw new Error('Obstacle: action is a required parameter');
        }
        if (minJumpThreshold !== undefined && maxJumpThreshold === undefined ||
            maxJumpThreshold !== undefined && minJumpThreshold === undefined) {
            throw new Error('Obstacle: both the min and max jump thresholds must be both included or both omitted');
        }

        this.x = x;
        this.y = y;
        this.type = type;
        this.action = action;
        if (minJumpThreshold !== undefined && maxJumpThreshold !== undefined) {
            this.jumpThresholds = {
                min: minJumpThreshold,
                max: maxJumpThreshold
            }
        } else {
            this.jumpThresholds = undefined;
        }
    }

    static isStoppedByBoundary(character, gameBoard) {
        return !this.isAtWaterBoundary(character, gameBoard) && Obstacle.isAtBoundary(character, gameBoard);
    }

    static isAtWaterBoundary(character, gameBoard) {
        return !gameBoard.isScrollAllowed(character.getScreenNumber(), character.getDirection()) &&
            gameBoard.isWater(character.getScreenNumber());
    }

    static isPastCharacter(character, otherCharacter) {
        return this.isPastCharacterLeft(character, otherCharacter) ||
            this.isPastCharacterRight(character, otherCharacter);
    }
s
    static isPastCharacterLeft(character, otherCharacter) {
        return character.isFacingLeft()
            && character.getX() + character.getWidth() * PASSING_MULTIPLIER < otherCharacter.getX() ||
                Obstacle.isCharacterAtLeftBoundary(character);
    }

    static isPastCharacterRight(character, otherCharacter) {
        return character.isFacingRight() &&
            character.getX() - character.getWidth() * PASSING_MULTIPLIER > otherCharacter.getX() ||
                Obstacle.isCharacterAtRightBoundary(character);
    }

    static isCharacterAtLeftBoundary(character) {
        return !character.isFacingRight() && character.getX() === 0;
    }

    static isCharacterAtRightBoundary(character) {
        return !character.isFacingLeft()
            && character.getX() === SCREEN_WIDTH - character.getProperties().getSprite().width();
    }

    static isAtBoundary(character, gameBoard) {
        validateRequiredParams(this.isAtBoundary, arguments, 'gameBoard');
        return Obstacle.isCharacterAtLeftBoundary(character) || Obstacle.isCharacterAtRightBoundary(character);
    }

    isCloseButNotPast(x, direction) {
        if (direction === RIGHT_LABEL) {
            //return this.x  > x - 25;
            return x - 50 < this.x;
        } else {
            //return this.x < x + 25;
            return x + 50 > this.x;
        }
    }

    getX() {
        return this.x;
    }

    isPast(x, direction) {
        if (direction === RIGHT_LABEL) {
            return x > this.x;
        } else {
            return x < this.x;
        }
    }

    isDownHillFrom(y) {
        return this.y <= y && this.type !== OBSTACLE_PIT_LABEL;
    }

    isEvadedWithJumpAt(x) {
        if (this.jumpThresholds === undefined) {
            return false;
        }
        return x > this.jumpThresholds[MIN_LABEL] && x < this.jumpThresholds[MAX_LABEL];
    }

    isTraversableDownhillElevation(character) {
        return this.isDownHillFrom(character.getY()) || (!character.isBarbarian()
            && character.getProperties().getCanElevate());
    }

    hitElevation(character) {
        return this.getIsElevation() && character.getY() != this.getHeight();
    }

    isCharacterPastObstacle(character) {
        return !character.isDead() && this.isPast(character.getX(), character.getDirection());
    }

    filterIfCharacterAvoided(character) {
        return this.didCharacterHitObstacle(character) ? this : undefined;
    }

    didCharacterHitObstacle(character) {
        return this.isCharacterPastObstacle(character) &&
            (this.didCharacterHitElevation(character) || this.didBarbarianFallInPit(character));
    }

    didCharacterHitElevation(character) {
        return this.hitElevation(character) && (!character.isBarbarian() || !character.isAction(ATTACK_LABEL));
    }

    didJumpEvadePit(character) {
        let frame = character.getCurrentFrame(JUMP_LABEL);
        // The Barbarian must jump from the edge of the pit which puts him at jump frame PIT_JUMP_EVADE_FRAME
        return character.getAction() === JUMP_LABEL && frame === PIT_JUMP_EVADE_FRAME;
    }

    didBarbarianFallInPit(character) {
        return this.getIsPit() && character.isBarbarian() && !this.didJumpEvadePit(character)
            && !character.isAction(FALL_LABEL);
    }

    getFailAction() {
        return this.action;
    }

    getType() {
        return this.type;
    }

    getIsElevation() {
        return this.type === ELEVATION_LABEL;
    }

    getIsPit() {
        return this.type === OBSTACLE_PIT_LABEL;
    }

    getHeight() {
        return this.y;
    }

    getMinJumpThreshold() {
        return this.jumpThresholds[MIN_LABEL];
    }

    getMaxJumpThreshold() {
        return this.jumpThresholds[MAX_LABEL];
    }

    didCharacterJumpEvade(character) {
        return character.getAction() === JUMP_LABEL && character.getCurrentFrame(JUMP_LABEL) < JUMP_EVADE_THRESHOLD;
    }
}
