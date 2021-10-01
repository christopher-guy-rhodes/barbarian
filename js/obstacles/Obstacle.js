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
        if (direction === RIGHT) {
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
        if (direction === RIGHT) {
            return x > this.x;
        } else {
            return x < this.x;
        }
    }

    isDownHillFrom(y) {
        return this.y <= y && this.type !== PIT;
    }

    isEvadedWithJumpAt(x) {
        if (this.jumpThresholds === undefined) {
            return false;
        }
        return x > this.jumpThresholds[MIN] && x < this.jumpThresholds[MAX];
    }

    isTraversableDownhillElevation(character) {
        return this.isDownHillFrom(character.getY()) || (!character.isBarbarian() && character.getCanElevate());
    }

    getFailAction() {
        return this.action;
    }

    getType() {
        return this.type;
    }

    getIsElevation() {
        return this.type === ELEVATION;
    }

    getIsPit() {
        return this.type === PIT;
    }

    getHeight() {
        return this.y;
    }

    getMinJumpThreshold() {
        return this.jumpThresholds[MIN];
    }

    getMaxJumpThreshold() {
        return this.jumpThresholds[MAX];
    }

    didCharacterJumpEvade(character) {
        return character.getAction() === JUMP && character.getCurrentFrame(JUMP) < JUMP_EVADE_THRESHOLD;
    }
}
