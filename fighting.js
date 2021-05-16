var HEADON = 'HEADON';

function isSuccessfulAttack(sprite, opponent) {
    var distance = sprite[POSITIONS][ATTACK][opponent[NAME]][LEFT] - sprite[POSITIONS][ATTACK][sprite[NAME]][LEFT];

    var thresholds = sprite[ATTACK_THRESHOLDS];
    var successful = false;
    for (var i = 0; i < thresholds.length; i++) {

        var successfulTurnaround = sprite[DIRECTION] === LEFT &&
            -1*thresholds[i][MIN] > distance &&
            -1*thresholds[i][MAX] < distance;
        var successfulHeadon = sprite[DIRECTION] === RIGHT &&
            thresholds[i][MIN] < distance &&
            thresholds[i][MAX] > distance ;

        if (successfulTurnaround || successfulHeadon) {
            successful = true;
        }
    }
    return successful;
}

function launchMonsterAttack(sprite, opponent, opponents) {
    if (sprite[NAME] !== BARBARIAN_SPRITE_NAME && sprite[ACTION] !== ATTACK) {
        var proximity = Math.abs(getProximity(sprite, opponent));
        if (proximity > 0 && proximity < ATTACK_PROXIMITY) {
            sprite[POSITIONS][ATTACK] = getPositionsAtAction(opponents);
            actionHelper(sprite, opponents, ATTACK, 0);
            return true;
        }
    }
    return false;
}

function getProximity(sprite, opponent) {
    return sprite[SPRITE].offset().left - opponent[SPRITE].offset().left;
}



function hasAttacked(sprite) {
    return Object.keys(sprite[POSITIONS][ATTACK]).length > 0;
}

function hasJumpEvaded(sprite, opponent) {
    var isJumpEvaided = false;
    if (opponent[POSITIONS][JUMP] && Object.keys(opponent[POSITIONS][JUMP]).length > 0) {
        console.log('==> failure opponent[' + POSITIONS + '][' + JUMP + '][' + sprite[NAME] + '][' + LEFT + ']');
        var jumpDiff = Math.abs(opponent[POSITIONS][JUMP][opponent[NAME]][LEFT] - opponent[POSITIONS][JUMP][sprite[NAME]][LEFT]);
        if (opponent[ACTION] === JUMP && jumpDiff < 400 && jumpDiff > 240) {
            isJumpEvaided = true;
        }
    }
    return isJumpEvaided;
}

function areBothAlive(sprite, opponent) {
    return opponent[STATUS] !== DEAD && sprite[STATUS] !== DEAD;
}

function opponentDefeated(sprite, opponent) {
    return hasAttacked(sprite) &&
        !hasJumpEvaded(sprite, opponent) &&
        areBothAlive(sprite, opponent) &&
        isSuccessfulAttack(sprite, opponent);
}

function fightSequence(sprite, opponents) {
    var opponentsInProximity = getSpritesInProximity(sprite, opponents, sprite[SPRITE].width()*1.5);

    for (var i = 0; i < opponentsInProximity.length; i++) {
        var opponent = opponentsInProximity[i];
        if (launchMonsterAttack(sprite, opponent, opponents)) {
            return true;
        }
        if (opponentDefeated(sprite, opponent)) {
            opponent[DEATH][DELAY] = getDeathDelay(sprite, opponent);
            death(opponent);
            canAdvance = true;
        }
    }
    return false;
}

