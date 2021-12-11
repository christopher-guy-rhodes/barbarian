class Fighting {
    constructor() {
    }

    static prepareDeathSprite(character) {
        let deathSprite = character.getProperties().getDeathSprite();
        deathSprite.show();
        deathSprite.css(CSS_LEFT_LABEL, character.getX() + CSS_PX_LABEL);
        if (!character.isBarbarian()) {
            character.getProperties().getSprite().hide();
        }
        return deathSprite;
    }

    static getOpponentsWithinX(character, gameBoard, x) {
        validateRequiredParams(this.getOpponentsWithinX, arguments, 'character', 'gameBoard', 'x');
        let self = this;
        return gameBoard.getOpponents(character.getBarbarian().getScreenNumber())
            .filter(function (opponent) {
                let proximity = self.getProximity(character, opponent);
                return proximity > 0 && proximity < x;
            });
    }

    static getProximity(character, opponent) {
        return Math.sqrt(Math.pow(Math.abs(character.getX() - opponent.getX()), 2)
            + Math.pow(Math.abs(character.getY() - opponent.getY()), 2));
    }

    static shouldCpuChase(character, gameBoard) {
        return !character.isBarbarian() &&
            (this.shouldCpuChaseVertically(character, gameBoard) || this.shouldCpuChaseHorizontally(character));
    }

    static shouldCpuChaseVertically(character, gameBoard) {
        return !character.isBarbarian() && gameBoard.isWater(character.getScreenNumber()) &&
            this.getCpuVerticalChaseDirection(character) !== character.getVerticalDirection() &&
                !character.isBarbarian() && Math.abs(character.getY() - character.getBarbarian().getY())
                    > CHASE_PROXIMITY;
    }

    static shouldCpuChaseHorizontally(character) {
        return Obstacle.isPastCharacter(character, character.getBarbarian())
            && character.getProperties().getCanTurnAround();
    }

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

    static didBarbarianEvadeAttack(barbarian, monster) {
        let frame = barbarian.getCurrentFrame(JUMP_LABEL);
        // While in the attack proximity the Barbarian has not evaded if he
        // 1. Reaches the MAX_AVOID_JUMP_FRAME jump frame (jumped too early)
        // 1. Experiences a jump frame < MIN_AVOID_JUMP_FRAME (jumped too late)
        return monster.isAction(ATTACK_LABEL) && barbarian.isAction(JUMP_LABEL)
            && frame >= MIN_AVOID_JUMP_FRAME && frame < MAX_AVOID_JUMP_FRAME;
    }

    static shouldCpuLaunchAttack(character, gameBoard) {
        validateRequiredParams(this.shouldCpuLaunchAttack, arguments, 'character', 'gameBoard');
        return !character.isBarbarian() && !character.getBarbarian().isDead() && !character.isAction(ATTACK_LABEL) &&
            !character.isDead() && this.getOpponentsWithinX(character, gameBoard, CPU_ATTACK_RANGE_PIXELS).length > 0;
    }
}
