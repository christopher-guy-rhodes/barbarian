/**
 * Determines if a character attack against the opponent would be successful given the current proximity.
 * @param character the character attacking
 * @param opponent the sprite being attacked
 * @returns {boolean|boolean} true if the attack was successful, false otherwise
 */
function isSuccessfulAttack(character, opponent) {
    if (character.getCharacterType() === opponent.getCharacterType()) {
        //characters of the same type cannot kill eachother
        return false;
    }
    let minAttackThreshold, maxAttackThreshold;
    if (character.getName() !== BARBARIAN_SPRITE_NAME) {
        minAttackThreshold = character.getMinAttackThreshold();
        maxAttackThreshold = character.getMaxAttackThreshold();
    } else {
        minAttackThreshold = opponent.getMinBarbarianAttackThreshold();
        maxAttackThreshold = opponent.getMaxBarbarianAttackThreshold();
    }

    let heightDiff = Math.abs(stripPxSuffix(character.getSprite().css('bottom')) - stripPxSuffix(opponent.getSprite().css('bottom')));
    let distance = Math.abs(character.getSprite().offset().left - opponent.getSprite().offset().left);
    return distance >= minAttackThreshold && distance <= maxAttackThreshold && heightDiff < 100;
}

/**
 * Launches an attack by the chracter against opponent if they are within the attack proximity.
 * @param character the character that is attacking
 * @param opponent the opponent being attacked
 * @returns {boolean} returns true if the monster attacked, false otherwise
 */
function launchMonsterAttack(character, opponent) {
    if (character.getName() !== BARBARIAN_SPRITE_NAME && character.getAction() !== ATTACK) {
        let isWater = compareProperty(SCREENS, screenNumber, WATER, true);
        let proximityThreshold = isWater ? ATTACK_PROXIMITY_WATER : ATTACK_PROXIMITY;
        let proximity = getProximity(character, opponent);
        if (proximity < proximityThreshold) {
            performAction(character, ATTACK, character.getResetNumberOfTimes());
            return true;
        }
    }
    return false;
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
 * Determines of the character defeated the opponent.
 * @param character the character that is attacking the opponent
 * @param opponent the opponent being attacked
 * @returns {boolean|boolean} true if the sprite defeated the opponent, false otherwise
 */
function opponentDefeated(character, opponent) {

    return character.getAction() === ATTACK &&
        !hasJumpEvaded(character, opponent) &&
        areBothAlive(character, opponent) &&
        isSuccessfulAttack(character, opponent);
}

/**
 * Determines if all the monsters on the screen are dead.
 * @returns {boolean} true if all the monsters on the screen are dead, false otherwise.
 */
function areAllMonstersDefeated() {
    for (let character of SCREENS[screenNumber][OPPONENTS]) {
        if (character.getName() === BARBARIAN_SPRITE_NAME) {
            continue;
        }
        if (!character.getCanLeaveBehind() && character.getStatus() === ALIVE) {
            return false;
        }
    }
    return true;
}

/**
 * Handles the fight sequence between the barbarian character and the monsters on the screen. Has the side effect of
 * killing the loosing character.
 * @param character the barbarian sprite
 * @returns {boolean} true if the opponent launched an attack, false otherwise
 */
function handleFightSequence(character) {
    let opponentsInProximity = getOpponentsInProximity(character, character.getSprite().width()*1.5);

    for (let i = 0; i < opponentsInProximity.length; i++) {
        let opponent = opponentsInProximity[i];
        if (launchMonsterAttack(character, opponent)) {
            return true;
        }
        if (opponentDefeated(character, opponent)) {
            opponent.setDeathDelay(getRelativeDeathDelay(character, opponent));
            death(opponent);
        }
    }
    return false;
}

/**
 * Handles the death of a character.
 * @param character the sprite that has died
 */
function death(character) {
    if (character.getName() !== BARBARIAN_SPRITE_NAME) {
        monsterDeath(character);
    } else {
        barbarianDeath(character, ATTACK);
    }
    animateDeath(character);
}

/**
 * Handles the death of the barbarian.
 * @param character the barbarian character
 * @param action the action the barbarian was taking when he died
 */
function barbarianDeath(character, action) {
    character.setDeathTime(new Date().getTime());
    character.setStatus(DEAD);
    if (action !== FALL) {
        playGruntSound();
    } else {
        BARBARIAN_CHARACTER.getSprite().css('display', 'none');
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
    playFireSound();
}

/**
 * Highlights the monster when the barbarian is within attacking distance. Meant to hint to the player when to attack.
 * @param character the to highlight
 */
function highlightAttackRange(character) {
    if (!isHints || character.getName() !== BARBARIAN_SPRITE_NAME) {
        return;
    }
    let opponents = filterBarbarianCharacter(getOpponents());
    for (let opponent of opponents) {
        if (!opponent.getCanHighlight()) {
            continue;
        }
        let thresholds = opponent[BARBARIAN_ATTACK_THRESHOLDS];
        let minThreshold = opponent.getMinBarbarianAttackThreshold();
        let maxThreshold = opponent.getMaxBarbarianAttackThreshold();

        let distance = Math.abs(character.getSprite().offset().left - opponent.getSprite().offset().left);

        let shouldHighlight = character.getStatus() !== DEAD &&
            (distance >= minThreshold - HIGHLIGHT_BUFFER) &&
            (distance <= maxThreshold + HIGHLIGHT_BUFFER);
        setCharacterCss(opponent, 'filter', 'brightness(' + (shouldHighlight ? '300%' : '100%') + ')');
    }
}

/**
 * Gets the appropriate death delay based on the distance an speed of the character and opponent.
 * @param character the character
 * @param opponent the opponent
 * @returns {number} the resulting delay in milliseconds
 */
function getRelativeDeathDelay(character, opponent) {
    const separation = Math.abs(character.getSprite().offset().left - opponent.getSprite().offset().left);

    const relativePps = getProperty(character, DIRECTION) === getProperty(opponent, DIRECTION)
        ? opponent.getPixelsPerSecond(character.getAction()) - character.getPixelsPerSecond(character.getAction())
        : opponent.getPixelsPerSecond(character.getAction()) + character.getPixelsPerSecond(character.getAction());
    return DEFAULT_DEATH_DELAY + (separation / Math.abs(relativePps)) * MILLISECONDS_PER_SECOND;
}

/**
 * Get the opponents in the proximity of the sprite
 * @param character the character
 * @param proximityThreshold the proximity threshold in pixels
 * @returns {[]}
 */
function getOpponentsInProximity(character, proximityThreshold) {
    let attackers = [];
    let opponents = getOpponents();
    for (let opponent of opponents) {
        let proximity = getProximity(character, opponent);
        if (proximity > 0 && proximity < proximityThreshold) {
            attackers.push(opponent);
        }
    }
    return attackers;
}

/**
 * Gets the opponents on the current screen.
 * @returns {*}
 */
function getOpponents() {
    return getProperty(SCREENS, screenNumber, OPPONENTS);
}


