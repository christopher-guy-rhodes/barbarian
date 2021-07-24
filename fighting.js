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

    console.log(sprite[NAME] + '\'s distance is ' + distance + ' min:' + thresholds[MIN] + ' max:' + thresholds[MAX]);
    if (successful = distance >= thresholds[MIN] && distance <= thresholds[MAX]) {
        $('.debug_sprite_left').css('left', sprite_left + 'px');
        $('.debug_opponent_left').css('left', opponent_left + 'px');
        console.log(sprite[NAME] + " defeated " + opponent[NAME]);
        return true;
    }
    return false;
}

function launchMonsterAttack(sprite, opponent, opponents) {
    if (sprite[NAME] !== BARBARIAN_SPRITE_NAME && sprite[ACTION] !== ATTACK) {
        var proximity = Math.abs(getProximity(sprite, opponent));
        if (proximity > 0 && proximity < ATTACK_PROXIMITY) {
            sprite[POSITIONS][ATTACK] = getPositionsAtAction(opponents);
            actionHelper(sprite, ATTACK, 0);
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
    if (opponent[POSITIONS][JUMP] && Object.keys(opponent[POSITIONS][JUMP]).length > 0) {
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
    return isAttacking(sprite) &&
        !hasJumpEvaded(sprite, opponent) &&
        areBothAlive(sprite, opponent) &&
        isSuccessfulAttack(sprite, opponent);
}

function areAllMonstersDeadOnScreen() {
    console.log('have all the monsters in screen ' + screenNumber + ' been defeated ');
    for (const spr of SCREENS[screenNumber][OPPONENTS]) {
        if (spr[NAME] === BARBARIAN_SPRITE_NAME) {
            continue;
        }
        if (spr[STATUS] === ALIVE) {
            return false;
        }
        console.log(spr[NAME] + ' has status:' + spr[STATUS]);
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
            opponent[DEATH][DELAY] = getDeathDelay(sprite, opponent);
            death(opponent);
        }
    }
    return false;
}

