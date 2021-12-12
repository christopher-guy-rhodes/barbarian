class Fighting {
    constructor() {
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
        return Obstacle.isPastCharacter(character, character.getBarbarian())
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

        return !character.isBarbarian() && !character.isDead() &&
            !character.getBarbarian().isDead() && this.getOpponentsWithinX(character, gameBoard, FIGHTING_RANGE_PIXELS)
                .filter(opponent => opponent.getProperties().getType() != character.getProperties().getType()
                    && !this.didBarbarianEvadeAttack(character.getBarbarian(), character)).length > 0;
    }

    /**
     * Determine if the Barbarian evaded the attack from the monster
     * @param barbarian the Barbarian
     * @param monster the monster
     * @returns {boolean} true if the Barbarian evaded the attack, false otherwise
     */
    static didBarbarianEvadeAttack(barbarian, monster) {
        let frame = barbarian.getCurrentFrame(JUMP_LABEL);
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
