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
        return this.y <= y && this.type !== PIT_LABEL;
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

    fetchIfCharacterHit(character) {
        return this.didCharacterHitObstacle(character) ? this : undefined;
    }

    didCharacterHitObstacle(character) {
        return this.isCharacterPastObstacle(character) &&
            (this.didCharacterHitElevation(character) || this.didBarbarianFallInPit(character));
    }

    didCharacterHitElevation(character) {
        return this.hitElevation(character) && (!character.isBarbarian() || !character.isAttacking());
    }

    didBarbarianFallInPit(character) {
        return this.getIsPit() && character.isBarbarian() && !character.didJumpEvade() && !character.isFalling();
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
        return this.type === PIT_LABEL;
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
