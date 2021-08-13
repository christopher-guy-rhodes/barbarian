/**
 * Determines if a sprites attack against the opponent would be successful given the current proximity.
 * @param sprite the sprite attacking
 * @param opponent the sprite being attacked
 * @returns {boolean|boolean} true if the attack was successful, false otherwise
 */
function isSuccessfulAttack(sprite, opponent) {
    let thresholds;
    if (!compareProperty(sprite, NAME, BARBARIAN_SPRITE_NAME)) {
        thresholds = sprite[ATTACK_THRESHOLDS];
    } else {
        thresholds = opponent[BARBARIAN_ATTACK_THRESHOLDS];
    }

    let heightDiff = getSpriteBottom(sprite) - getSpriteBottom(opponent);
    let distance = Math.abs(sprite[SPRITE].offset().left - opponent[SPRITE].offset().left);
    return distance >= thresholds[MIN] && distance <= thresholds[MAX] && heightDiff === 0;
}

/**
 * Launches an attack by sprite against opponent if they are within the attack proximity.
 * @param sprite the sprite that is attacking
 * @param opponent the opponent being attacked
 * @returns {boolean} returns true if the monster attacked, false otherwise
 */
function launchMonsterAttack(sprite, opponent) {
    if (!compareProperty(sprite, NAME, BARBARIAN_SPRITE_NAME) && getProperty(sprite, ACTION) !== ATTACK) {
        let proximity = getProximity(sprite, opponent);
        if (proximity > 0 && proximity < ATTACK_PROXIMITY) {
            performAction(sprite, ATTACK, 0);
            return true;
        }
    }
    return false;
}

/**
 * Gets the proximity of sprite to opponent. Positive if the sprite is to the left of the opponent, negative if the
 * sprite is to the right of the opponent. The distance is represented by the magnitude.
 * @param sprite the sprite
 * @param opponent the opponent
 * @returns {number} the number of pixels apart.
 */
function getProximity(sprite, opponent) {
    return Math.abs(sprite[SPRITE].offset().left - opponent[SPRITE].offset().left);
}

/**
 * Whether the opponent avoided an attack with a jump
 * @param sprite the sprite attacking
 * @param opponent the opponent being attacked
 * @returns {boolean} true if the opponent avoided the attack, false otherwise
 */
function hasJumpEvaded(sprite, opponent) {
    let distance = Math.abs(getProperty(sprite, SPRITE).offset().left - getProperty(opponent, SPRITE).offset().left);

    return getProperty(opponent, ACTION) === JUMP  && distance < getProperty(sprite, JUMP_THRESHOLDS, MAX) &&
        distance > getProperty(sprite, JUMP_THRESHOLDS, MIN);
}

/**
 * Determines if the sprite and the opponent are alive.
 * @param sprite the sprite
 * @param opponent the opponent
 * @returns {boolean|boolean} true if they are both alive, false otherwise
 */
function areBothAlive(sprite, opponent) {
    return !compareProperty(opponent, STATUS, DEAD) && !compareProperty(sprite, STATUS, DEAD);
}

/**
 * Determines of the sprite defeated the opponent.
 * @param sprite the sprite that is attacking the opponent
 * @param opponent the opponent being attacked
 * @returns {boolean|boolean} true if the sprite defeated the opponent, false otherwise
 */
function opponentDefeated(sprite, opponent) {
    return compareProperty(sprite, ACTION, ATTACK) &&
        !hasJumpEvaded(sprite, opponent) &&
        areBothAlive(sprite, opponent) &&
        isSuccessfulAttack(sprite, opponent);
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
        if (spr[STATUS] === ALIVE) {
            return false;
        }
    }
    return true;
}

/**
 * Handles the fight sequence between the barbarian sprite and the monsters on the screen. Has the side effect of
 * killing the loosing character.
 * @param sprite the barbarian sprite
 * @returns {boolean} true if the opponent launched an attack, false otherwise
 */
function handleFightSequence(sprite) {
    let opponentsInProximity = getOpponentsInProximity(sprite, sprite[SPRITE].width()*1.5);

    for (let i = 0; i < opponentsInProximity.length; i++) {
        let opponent = opponentsInProximity[i];
        if (launchMonsterAttack(sprite, opponent)) {
            return true;
        }
        if (opponentDefeated(sprite, opponent)) {
            setProperty(opponent, DEATH, DELAY, getRelativeDeathDelay(sprite, opponent));
            death(opponent);
        }
    }
    return false;
}

/**
 * Handles the death of a sprite.
 * @param sprite the sprite that has died
 */
function death(sprite) {
    if (!compareProperty(sprite, NAME, BARBARIAN_SPRITE_NAME)) {
        monsterDeath(sprite);
    } else {
        barbarianDeath(sprite, ATTACK);
    }
    animateDeath(sprite);
}

/**
 * Handles the death of the barbarian.
 * @param sprite the barbarian sprite
 * @param action the action the barbarian was taking when he died
 */
function barbarianDeath(sprite, action) {
    setProperty(sprite, DEATH, TIME, new Date().getTime());
    setProperty(sprite, STATUS, DEAD);
    if (action !== FALL) {
        playGruntSound();
    } else {
        hideSprite(BARBARIAN_SPRITE)
    }
    showMessage(START_MESSAGE);
    numLives = numLives - 1;
    if (numLives < 1) {
        showMessage(GAME_OVER_MESSAGE);
    }
}

/**
 * Handles the death of a monster.
 * @param sprite the monster sprite
 */
function monsterDeath(sprite) {
    setProperty(sprite, DEATH, TIME, new Date().getTime());
    setProperty(sprite, STATUS, DEAD);
    playFireSound();
}

/**
 * Highlights the monster when the barbarian is within attacking distance. Meant to hint to the player when to attack.
 * @param sprite the to highlight
 */
function highlightAttackRange(sprite) {
    if (!isHints || !compareProperty(sprite, NAME, BARBARIAN_SPRITE_NAME)) {
        return;
    }
    let opponents = filterBarbarianSprite(getOpponents());
    for (let opponent of opponents) {
        let thresholds = opponent[BARBARIAN_ATTACK_THRESHOLDS];

        let distance = Math.abs(getProperty(sprite, SPRITE).offset().left - getProperty(opponent, SPRITE).offset().left);

        let shoudHighlight = !compareProperty(sprite, STATUS, DEAD) &&
            (distance >= thresholds[MIN] - HIGHLIGHT_BUFFER) &&
            (distance <= thresholds[MAX] + HIGHLIGHT_BUFFER);
        setSpriteHighlight(opponent, shoudHighlight);
    }
}

/**
 * Gets the appropriate death delay based on the distance an speed of the sprite and opponent
 * @param sprite the sprite
 * @param opponent the opponent
 * @returns {number} the resulting delay in milliseconds
 */
function getRelativeDeathDelay(sprite, opponent) {
    const separation = Math.abs(getProperty(sprite, SPRITE).offset().left - getProperty(opponent, SPRITE).offset().left);

    const relativePps = getProperty(sprite, DIRECTION) === getProperty(opponent, DIRECTION)
        ? getProperty(opponent, PIXELS_PER_SECOND, getProperty(sprite, ACTION)) - getProperty(sprite, PIXELS_PER_SECOND, getProperty(sprite, ACTION))
        : getProperty(opponent, PIXELS_PER_SECOND, getProperty(sprite, ACTION)) + getProperty(sprite, PIXELS_PER_SECOND, getProperty(sprite, ACTION));
    return DEFAULT_DEATH_DELAY + (separation / Math.abs(relativePps)) * MILLISECONDS_PER_SECOND;
}

/**
 * Get the opponents in the proximity of the sprite
 * @param sprite the sprite
 * @param proximityThreshold the proximity threshold in pixels
 * @returns {[]}
 */
function getOpponentsInProximity(sprite, proximityThreshold) {
    let attackers = [];
    let opponents = getOpponents();
    for (let opponent of opponents) {
        let proximity = getProximity(sprite, opponent);
        if (proximity > 0 && proximity < proximityThreshold) {
            attackers.push(opponent);
        }
    }
    return attackers;
}

function getOpponents() {
    return SCREENS[screenNumber][OPPONENTS];
}


