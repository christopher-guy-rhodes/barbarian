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

/**
 * Determines if all the monsters on the screen are dead.
 * @returns {boolean} true if all the monsters on the screen are dead, false otherwise.
 */
function areAllMonstersDefeated() {
    return game.getMonstersOnScreen().filter(m => !m.getCanLeaveBehind() && !m.isDead()).length < 1;
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
 * Handles the death of a character.
 * @param character the sprite that has died
 */
function death(character) {
    character.setDeathTime(new Date().getTime());
    character.setStatus(DEAD);
    if (!character.isBarbarian()) {
        monsterDeath(character);
    } else {
        barbarianDeath(character, ATTACK);
    }
    if (game.isWater()) {
        character.getSprite().stop();
        let timeToFall = character.getY() / DEFAULT_PIXELS_PER_SECOND * MILLISECONDS_PER_SECOND;
        //character.getSprite().css('transform', 'scaleY(-1)');
        //character.getSprite().css('bottom', character.getY() - 300 + 'px');

        // TODO, share this logic with animate death
        let frame = character.getDeathFrames(character.getDirection())[4];
        let heightOffset = character.getDeathSpriteHeightOffset(character.getDirection()) * character.getSprite().height();
        setCss(character.getDeathSprite(), 'background-position',
            -1*frame*character.getSprite().width() + 'px ' + -1*heightOffset + 'px');

        character.moveToPosition(character.getX(), 0, DEFAULT_PIXELS_PER_SECOND);
    } else {
        game.animateDeath(character).catch(function(error) {
            handlePromiseError(error);
        });
    }

}

/**
 * Handles the death of the barbarian.
 * @param character the barbarian character
 * @param action the action the barbarian was taking when he died
 */
function barbarianDeath(character, action) {
    if (action !== FALL) {
        game.playGruntSound();
    } else {
        console.log('===> hiding1 ' + character.getCharacterType() + ' because he is falling ');
        game.getBarbarian().hide();
    }
    showMessage(START_MESSAGE);
    numLives = numLives - 1;
    if (numLives < 1) {
        showMessage(GAME_OVER_MESSAGE);
    }
}

/**
 * Handles the death of a monster.
 * @param character the monster sprite
 */
function monsterDeath(character) {
    character.setDeathTime(new Date().getTime());
    character.setStatus(DEAD);
    game.playFireSound();
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

