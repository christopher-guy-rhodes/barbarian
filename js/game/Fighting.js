const MIN_ATTACK_THRESHOLD = 3;
const MAX_ATTACK_THRESHOLD = 4;

class Fighting {
    constructor() {
    }

    /**
     * Determine if the barbarian has been targetet by the character due to overlapping frame targets.
     * @param character the character
     * @param barbarian the barbarian
     * @param action the action the character is taking
     * @param frame the frame to check for targeting
     * @returns {boolean} true if the character is hit by an axe, false otherwise
     */
    static wasBarbarianTargetedByCharacter(character, barbarian, action, direction, frame) {
        if (character.isBarbarian()) {
            return false;
        }
        let frameTarget = character.getProperties().getFrameTarget(action, direction,
            character.getScreenNumber(),
            frame);

        let barbarianAction = barbarian.getAction() === undefined ? barbarian.getProperties().getDefaultAction()
                                                                  : barbarian.getAction();
        let barbarianDirection = barbarian.getHorizontalDirection();
        let barbarianFrame = barbarian.getCurrentFrame(barbarianAction);

        let frameTargetBarbarian = barbarian.getProperties().getFrameTarget(barbarianAction, barbarianDirection,
            barbarian.getScreenNumber(),
            barbarianFrame);
        //console.log('frame target for %s direction %s %o',character.getProperties().getSprite().attr('class'), direction, frameTarget);
        //console.log('frame (x:%d) target for frame %d character %s for action %s is %o',character.getX(), frame, character.getProperties().getSprite().attr('class'), action, frameTarget);
        //console.log('frame (x:%d) target for frame %d %o character %s for action %s is %o',barbarian.getX(), barbarianFrame, barbarian.getCurrentFrame(barbarianAction), barbarian.getProperties().getSprite().attr('class'), barbarianAction, frameTargetBarbarian);
        if (frameTarget !== undefined && frameTargetBarbarian !== undefined) {
            //console.log('frame target for %s frame %s is %o. frame target for %s is %o', character.getProperties().getSprite().attr('class'), frame, frameTarget, barbarian.getProperties().getSprite().attr('class'), frameTargetBarbarian);

            let x1 = frameTarget['leftOffset'] + character.getX();
            let x1Offset = frameTarget['width'];
            let x2 = frameTargetBarbarian['leftOffset'] + barbarian.getX();
            let x2Offset = frameTargetBarbarian['width'];
            let y1 = frameTarget['bottomOffset'] + character.getY();
            let y1Offset = frameTarget['height'];
            let y2 = frameTargetBarbarian['bottomOffset'] + barbarian.getY();
            let y2Offset = frameTargetBarbarian['height'];

            let xSmaller = Math.min(x1, x2);
            let xSmallerOffset = x1 === xSmaller ? x1Offset : x2Offset;
            let xLarger = x1 === xSmaller ? x2 : x1;
            let xLargetOffset = x1 === xSmaller ? x2Offset : x1Offset;

            let ySmaller = Math.min(y1, y2);
            let ySmallerOffset = y1 === ySmaller ? y1Offset : y2Offset;
            let yLarger = y1 === ySmaller ? y2 : y1;
            let yLargerOffset = y1 === ySmaller ? y2Offset : y1Offset;

            let horizontalOverlap = false;
            if (xLarger <= xSmaller + xSmallerOffset) {
                //console.log('xBarbarian:' + xLarger + ' <= ' + 'xCharacter:' + (xSmallerOffset + xSmallerOffset));
                horizontalOverlap = true;
            } else {
                //console.log('xBarbarian:' + xLarger + ' !<= ' + 'xCharacter:' + (xSmallerOffset + xSmallerOffset));
            }

            let verticalOverlap = false;
            if (yLarger <= ySmaller + ySmallerOffset) {
                //console.log('yBarbarian:' + y2 + ' <= ' + 'yCharacter:' + (y1 + frameTarget['height']));
                verticalOverlap = true;
            } else {
                //console.log('yBarbarian:' + y2 + ' !<= ' + 'yCharacter:' + (y1 + frameTarget['height']));
            }

            if (horizontalOverlap && verticalOverlap) {
                //console.log(character.getProperties().getType() + ' hit the barbarian at frame ' + frame);
                return true;
            }
        }
        return false;
    }

    /**
     * Determine if the opponent won a fight against the character
     * @param opponent the opponent
     * @param character the character
     * @returns {boolean} true if the opponent won, false otherwise
     */
    static didOpponentWinFight(opponent, character) {
        let opponentAction = opponent.getAction();
        let opponentCurrentFrame = opponent.getCurrentFrameIndex(opponentAction);
        return opponentAction === ATTACK_LABEL && (opponentCurrentFrame >= MIN_ATTACK_THRESHOLD
            && opponentCurrentFrame <= MAX_ATTACK_THRESHOLD) && !(opponent.isBarbarian()
            && character.getProperties().getIsInvincible());
    }

    /**
     * Prepare the death sprite by making it visible and positioning it. For monsters hide the main sprite.
     * @param character the character to prepare the death sprite for
     * @returns {jQuery|HTMLElement}
     */
    static prepareDeathSprite(character) {
        let deathSprite = character.getProperties().getDeathSprite();
        deathSprite.show();
        deathSprite.css(CSS_LEFT_LABEL, character.getX() + CSS_PX_LABEL);
        if (!character.isBarbarian()) {
            character.getProperties().getSprite().hide();
        }
        return deathSprite;
    }

    /**
     * Get opponents of the character within x pixels.
     * @param character the character
     * @param gameBoard the game board
     * @param x the pixel threshold
     * @returns {Opponent[]}
     */
    static getOpponentsWithinX(character, gameBoard, x) {
        validateRequiredParams(this.getOpponentsWithinX, arguments, 'character', 'gameBoard', 'x');
        let self = this;
        return gameBoard.getOpponents(character.getBarbarian().getScreenNumber())
            .filter(function (opponent) {
                if (!character.isBarbarian() && !opponent.isBarbarian()) {
                    return false;
                }
                let proximity = self.getProximity(character, opponent);
                return proximity > 0 && proximity < x;
            });
    }

    /**
     * The the proximity of character to opponent in a 2-dimensional plain.
     * @param character the character
     * @param opponent the opponent
     * @returns {number} the proximity in pixels
     */
    static getProximity(character, opponent) {
        return Math.sqrt(Math.pow(Math.abs(character.getX() - opponent.getX()), 2)
            + Math.pow(Math.abs(character.getY() - opponent.getY()), 2));
    }

    /**
     * Determine if the character is the CPU and should chase the Barbarian in a 2-dimensional plain.
     * @param character the character
     * @param gameBoard the game board
     * @returns {boolean} true if the character should chase the Barbarian, false otherwise
     */
    static shouldCpuChase(character, gameBoard) {
        return !character.isBarbarian() &&
            (this.shouldCpuChaseVertically(character, gameBoard) || this.shouldCpuChaseHorizontally(character));
    }

    /**
     * Determine if the character is the CPU and should chase the Barbarian vertically.
     * @param character the character
     * @param gameBoard the game board
     * @returns {boolean}
     */
    static shouldCpuChaseVertically(character, gameBoard) {
        return !character.isBarbarian() && gameBoard.isWater(character.getScreenNumber()) &&
            this.getCpuVerticalChaseDirection(character) !== character.getVerticalDirection() &&
                !character.isBarbarian() && Math.abs(character.getY() - character.getBarbarian().getY())
                    > CHASE_PROXIMITY;
    }

    /**
     * Determine if the character is the CPU and should chase the Barbarian horizontally.
     * @param character the character
     * @returns {boolean}
     */
    static shouldCpuChaseHorizontally(character) {
        return !character.isBarbarian() && Obstacle.isPastCharacter(character, character.getBarbarian())
            && character.getProperties().getCanTurnAround();
    }

    /**
     * Get the vertical direction the CPU should go in order to chase the Barbarian.
     * @param character the character
     * @returns {string} the direction (up or down)
     */
    static getCpuVerticalChaseDirection(character) {
        return (character.getBarbarian().getY() > character.getY()) ? UP_LABEL : DOWN_LABEL;
    }

    static shouldCpuFight(character, gameBoard) {
        validateRequiredParams(this.shouldCpuFight, arguments, 'character', 'gameBoard');

        return character.getProperties().getType() !== AXE_CHARACTER_TYPE &&
            character.getProperties().getType() !== SHARK_CHARACTER_TYPE &&
            !character.isBarbarian() && !character.isDead() && !character.getBarbarian().isDead() &&
            this.getOpponentsWithinX(character, gameBoard, FIGHTING_RANGE_PIXELS).length > 0 &&
                !this.didBarbarianEvadeAttack(character.getBarbarian(), character);
    }

    static shouldDragonBreatheFire(character, frame) {
        return character.getProperties().getType() === DRAGON_CHARACTER_TYPE && frame === -1;
    }

    /**
     * Determine if the Barbarian evaded the attack from the monster
     * @param barbarian the Barbarian
     * @param monster the monster
     * @returns {boolean} true if the Barbarian evaded the attack, false otherwise
     */
    static didBarbarianEvadeAttack(barbarian, monster) {
        let frame = barbarian.getCurrentFrameIndex(JUMP_LABEL);
        // While in the attack proximity the Barbarian has not evaded if he
        // 1. Reaches the MAX_AVOID_JUMP_FRAME jump frame (jumped too early)
        // 1. Experiences a jump frame < MIN_AVOID_JUMP_FRAME (jumped too late)
        return monster.isAction(ATTACK_LABEL) && barbarian.isAction(JUMP_LABEL)
            && frame >= MIN_AVOID_JUMP_FRAME && frame < MAX_AVOID_JUMP_FRAME;
    }

    /**
     * Determine if the CPU should launch an attack.
     * @param character the character
     * @param gameBoard the game board
     * @returns {boolean} true if the character should launch an attack against the Barbarian, false otherwise
     */
    static shouldCpuLaunchAttack(character, gameBoard) {
        validateRequiredParams(this.shouldCpuLaunchAttack, arguments, 'character', 'gameBoard');
        return !character.isBarbarian() && !character.getBarbarian().isDead() && !character.isAction(ATTACK_LABEL) &&
            !character.isDead() && this.getOpponentsWithinX(character, gameBoard, CPU_ATTACK_RANGE_PIXELS).length > 0;
    }
}
