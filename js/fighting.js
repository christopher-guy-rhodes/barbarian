/**
 * Launches an attack by the chracter against opponent if they are within the attack proximity.
 * @param character the character that is attacking
 * @param opponent the opponent being attacked
 */
function launchAttack(character, opponent) {
    if (character.getName() !== BARBARIAN_SPRITE_NAME) {
        game.performAction(character, ATTACK);
    }
}

/**
 * Gets the proximity of the character to the opponent. Positive if the sprite is to the left of the opponent, negative
 * if the character is to the right of the opponent. The distance is represented by the magnitude.
 * @param character the character
 * @param opponent the opponent
 * @returns {number} the number of pixels apart.
 */
function getProximity(character, opponent) {
    let distanceX = Math.abs(character.getSprite().offset().left - opponent.getSprite().offset().left);
    let distanceY = Math.abs(stripPxSuffix(getCss(character.getSprite(),'bottom'))
        - stripPxSuffix(getCss(opponent.getSprite(),'bottom')));
    return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
}

/**
 * Whether the opponent avoided an attack with a jump.
 * @param character the character attacking
 * @param opponent the opponent being attacked
 * @returns {boolean} true if the opponent avoided the attack, false otherwise
 */
function hasJumpEvaded(character, opponent) {
    let distance = Math.abs(character.getSprite().offset().left - opponent.getSprite().offset().left);

    return opponent.getAction() === JUMP  && distance < character.getMaxJumpThreshold() &&
        distance > character.getMinJumpThreshold();
}

/**
 * Determines if the sprite and the opponent are alive.
 * @param character the character
 * @param opponent the opponent
 * @returns {boolean|boolean} true if they are both alive, false otherwise
 */
function areBothAlive(character, opponent) {
    return opponent.getStatus() !== DEAD && character.getStatus() !== DEAD;
}

function launchCpuAttack(character) {
    if (character.isBarbarian() || character.isDead() || !game.doesScreenIncludeCharacter(character)) {
        return;
    }
    let opponentsInProximity = character.getOpponentsWithinX(GAME_BOARD, CPU_ATTACK_RANGE_PIXELS);

    for (let i = 0; i < opponentsInProximity.length; i++) {
        let opponent = opponentsInProximity[i];
        launchAttack(character, opponent);
    }
}



/**
 * Get the opponents in the proximity of the sprite
 * @param character the character
 * @param proximityThreshold the proximity threshold in pixels
 * @returns {[]}
 */
function getOpponentsInProximity(character, gameBoard, proximityThreshold) {
    let attackers = [];
    let opponents = game.getOpponentsOnScreen();
    for (let opponent of opponents) {
        if (opponent === character) {
            continue;
        }
        let proximity = getProximity(character, opponent);
        if (Math.abs(proximity) < proximityThreshold) {
            attackers.push(opponent);
        }
    }
    return attackers;
}

