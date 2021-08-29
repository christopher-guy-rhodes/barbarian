/**
 * Determines if a character attack against the opponent would be successful given the current proximity.
 * @param character the character attacking
 * @param opponent the sprite being attacked
 * @returns {boolean|boolean} true if the attack was successful, false otherwise
 */
function isSuccessfulAttack(character, opponent) {
    let thresholds;
    if (!compareProperty(character, NAME, BARBARIAN_SPRITE_NAME)) {
        thresholds = getProperty(character, ATTACK_THRESHOLDS);
    } else {
        thresholds = getProperty(opponent, BARBARIAN_ATTACK_THRESHOLDS);
    }

    let heightDiff = stripPxSuffix(getProperty(character, SPRITE).css('bottom')) - stripPxSuffix(getProperty(opponent, SPRITE).css('bottom'));
    let distance = Math.abs(getProperty(character, SPRITE).offset().left - getProperty(opponent, SPRITE).offset().left);
    return distance >= thresholds[MIN] && distance <= thresholds[MAX] && heightDiff === 0;
}

/**
 * Launches an attack by the chracter against opponent if they are within the attack proximity.
 * @param character the character that is attacking
 * @param opponent the opponent being attacked
 * @returns {boolean} returns true if the monster attacked, false otherwise
 */
function launchMonsterAttack(character, opponent) {
    if (!compareProperty(character, NAME, BARBARIAN_SPRITE_NAME) && !compareProperty(character, ACTION, ATTACK)) {
        let proximity = getProximity(character, opponent);
        if (proximity > 0 && proximity < ATTACK_PROXIMITY) {
            performAction(character, ATTACK, getProperty(character, RESET, NUMBER_OF_TIMES));
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
    return Math.abs(getProperty(character, SPRITE).offset().left - getProperty(opponent, SPRITE).offset().left);
}

/**
 * Whether the opponent avoided an attack with a jump.
 * @param character the character attacking
 * @param opponent the opponent being attacked
 * @returns {boolean} true if the opponent avoided the attack, false otherwise
 */
function hasJumpEvaded(character, opponent) {
    let distance = Math.abs(getProperty(character, SPRITE).offset().left - getProperty(opponent, SPRITE).offset().left);

    return getProperty(opponent, ACTION) === JUMP  && distance < getProperty(character, JUMP_THRESHOLDS, MAX) &&
        distance > getProperty(character, JUMP_THRESHOLDS, MIN);
}

/**
 * Determines if the sprite and the opponent are alive.
 * @param character the character
 * @param opponent the opponent
 * @returns {boolean|boolean} true if they are both alive, false otherwise
 */
function areBothAlive(character, opponent) {
    return !compareProperty(opponent, STATUS, DEAD) && !compareProperty(character, STATUS, DEAD);
}

/**
 * Determines of the character defeated the opponent.
 * @param character the character that is attacking the opponent
 * @param opponent the opponent being attacked
 * @returns {boolean|boolean} true if the sprite defeated the opponent, false otherwise
 */
function opponentDefeated(character, opponent) {
    return compareProperty(character, ACTION, ATTACK) &&
        !hasJumpEvaded(character, opponent) &&
        areBothAlive(character, opponent) &&
        isSuccessfulAttack(character, opponent);
}

/**
 * Determines if all the monsters on the screen are dead.
 * @returns {boolean} true if all the monsters on the screen are dead, false otherwise.
 */
function areAllMonstersDeadOnScreen() {
    for (let spr of SCREENS[screenNumber][OPPONENTS]) {
        if (spr[NAME] === BARBARIAN_SPRITE_NAME) {
            continue;
        }
        if (compareProperty(spr, STATUS, ALIVE)) {
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
    let opponentsInProximity = getOpponentsInProximity(character, character[SPRITE].width()*1.5);

    for (let i = 0; i < opponentsInProximity.length; i++) {
        let opponent = opponentsInProximity[i];
        if (launchMonsterAttack(character, opponent)) {
            return true;
        }
        if (opponentDefeated(character, opponent)) {
            setProperty(opponent, DEATH, DELAY, getRelativeDeathDelay(character, opponent));
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
    if (!compareProperty(character, NAME, BARBARIAN_SPRITE_NAME)) {
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
    setProperty(character, DEATH, TIME, new Date().getTime());
    setProperty(character, STATUS, DEAD);
    if (action !== FALL) {
        playGruntSound();
    } else {
        setCharacterCss(BARBARIAN_CHARACTER, 'display', 'none');
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
    setProperty(character, DEATH, TIME, new Date().getTime());
    setProperty(character, STATUS, DEAD);
    playFireSound();
}

/**
 * Highlights the monster when the barbarian is within attacking distance. Meant to hint to the player when to attack.
 * @param character the to highlight
 */
function highlightAttackRange(character) {
    if (!isHints || !compareProperty(character, NAME, BARBARIAN_SPRITE_NAME)) {
        return;
    }
    let opponents = filterBarbarianCharacter(getOpponents());
    for (let opponent of opponents) {
        let thresholds = opponent[BARBARIAN_ATTACK_THRESHOLDS];

        let distance = Math.abs(getProperty(character, SPRITE).offset().left - getProperty(opponent, SPRITE).offset().left);

        let shouldHighlight = !compareProperty(character, STATUS, DEAD) &&
            (distance >= thresholds[MIN] - HIGHLIGHT_BUFFER) &&
            (distance <= thresholds[MAX] + HIGHLIGHT_BUFFER);
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
    const separation = Math.abs(getProperty(character, SPRITE).offset().left - getProperty(opponent, SPRITE).offset().left);

    const relativePps = getProperty(character, DIRECTION) === getProperty(opponent, DIRECTION)
        ? getProperty(opponent, PIXELS_PER_SECOND, getProperty(character, ACTION)) -
                getProperty(character, PIXELS_PER_SECOND, getProperty(character, ACTION))
        : getProperty(opponent, PIXELS_PER_SECOND, getProperty(character, ACTION)) +
                getProperty(character, PIXELS_PER_SECOND, getProperty(character, ACTION));
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
        if (compareProperty(opponent, NAME, ROCK_CHARACTER)) {
            console.log('checking if rock is close');
        }
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


