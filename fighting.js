var HEADON = 'HEADON';

function isSuccessfulAttack(sprite, opponent) {
    let sprite_left = sprite[SPRITE].offset().left;
    let opponent_left = opponent[SPRITE].offset().left;
    let distance = Math.abs(sprite_left - opponent_left);

    var thresholds;
    if (!isMonster(sprite)) {
        thresholds = opponent[BARBARIAN_ATTACK_THRESHOLDS];
    } else {
        thresholds = sprite[ATTACK_THRESHOLDS];
    }
    var successful = false;

    if (successful = distance >= thresholds[MIN] && distance <= thresholds[MAX]) {
        //$('.debug_sprite_left').css('left', sprite_left + 'px');
        //$('.debug_opponent_left').css('left', opponent_left + 'px');
        return true;
    }
    return false;
}

function launchMonsterAttack(sprite, opponent, opponents) {
    if (sprite[NAME] !== BARBARIAN_SPRITE_NAME && sprite[ACTION] !== ATTACK) {
        var proximity = Math.abs(getProximity(sprite, opponent));
        if (proximity > 0 && proximity < ATTACK_PROXIMITY) {
            performAction(sprite, ATTACK, 0);
            return true;
        }
    }
    return false;
}

function getProximity(sprite, opponent) {
    return sprite[SPRITE].offset().left - opponent[SPRITE].offset().left;
}



function isAttacking(sprite) {
    return sprite[ACTION] === ATTACK;
}

function hasJumpEvaded(sprite, opponent) {
    var isJumpEvaided = false;

    let sprite_left = sprite[SPRITE].offset().left;
    let opponent_left = opponent[SPRITE].offset().left;
    let distance = Math.abs(sprite_left - opponent_left);

    if (opponent[ACTION] === JUMP  && distance < 100 && distance > 15) {
        isJumpEvaided = true;
    }
    return isJumpEvaided;
}

function areBothAlive(sprite, opponent) {
    return opponent[STATUS] !== DEAD && sprite[STATUS] !== DEAD;
}

function opponentDefeated(sprite, opponent) {
    return isAttacking(sprite) &&
        !hasJumpEvaded(sprite, opponent) &&
        areBothAlive(sprite, opponent) &&
        isSuccessfulAttack(sprite, opponent);
}

function areAllMonstersDeadOnScreen() {
    for (const spr of SCREENS[screenNumber][OPPONENTS]) {
        if (spr[NAME] === BARBARIAN_SPRITE_NAME) {
            continue;
        }
        if (spr[STATUS] === ALIVE) {
            return false;
        }
    }
    return true;

}

function fightSequence(sprite, opponents) {
    var opponentsInProximity = getSpritesInProximity(sprite, opponents, sprite[SPRITE].width()*1.5);

    for (var i = 0; i < opponentsInProximity.length; i++) {
        var opponent = opponentsInProximity[i];
        if (launchMonsterAttack(sprite, opponent, opponents)) {
            return true;
        }
        if (opponentDefeated(sprite, opponent)) {
            opponent[DEATH][DELAY] = getRelativeDeathDelay(sprite, opponent);

            death(opponent);
        }
    }
    return false;
}

function getOpponents() {
    return SCREENS[getScreenNumber()][OPPONENTS];
}

function death(sprite) {
    if (isMonster(sprite)) {
        monsterDeath(sprite);
    } else {
        barbarianDeath(sprite);
    }
}

function handleDeath(sprite) {
    setDeathTime(sprite, new Date().getTime());
    setStatus(sprite, DEAD);
}

function barbarianDeath(sprite) {
    handleDeath(sprite);
    animateBarbarianDeath(sprite);
    playGruntSound();
    show(START_MESSAGE);
    setLives(getLives() - 1);
    if (getLives() < 1) {
        show(GAME_OVER_MESSAGE);
    }
}

function monsterDeath(sprite) {
    handleDeath(sprite);
    animateMonsterDeath(sprite);
    playFireSound();
}

/**
 * Highlights the monster when the barbarian is within attacking distance. Meant to hint to the player when to attack.
 * @param sprite the to highlight
 */
function highlightAttackRange(sprite) {
    if (!isHints() || isMonster(sprite)) {
        return;
    }
    let opponents = filterBarbarianSprite(getOpponents());
    for (const opponent of opponents) {
        const thresholds = opponent[BARBARIAN_ATTACK_THRESHOLDS];

        const distance = Math.abs(getLeft(sprite) - getLeft(opponent));

        let shoudHighlight = !isDead(sprite) &&
            (distance >= thresholds[MIN] - HIGHLIGHT_BUFFER) &&
            (distance <= thresholds[MAX] + HIGHLIGHT_BUFFER);
        setHighlight(opponent, shoudHighlight);
    }
}

function getRelativeDeathDelay(sprite, opponent) {
    const separation = Math.abs(getLeft(sprite) - getLeft(opponent));

    const relativePps = getDirection(sprite) === getDirection(opponent)
        ? getCurrentPixelsPerSecond(opponent) - getCurrentPixelsPerSecond(sprite)
        : getCurrentPixelsPerSecond(opponent) + getCurrentPixelsPerSecond(sprite);
    return DEFAULT_DEATH_DELAY + (separation / Math.abs(relativePps)) * MILLISECONDS_PER_SECOND;
}



