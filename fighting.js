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
        //console.log(sprite[NAME] + " defeated " + opponent[NAME]);
        return true;
    }
    return false;
}

function launchMonsterAttack(sprite, opponent, opponents) {
    if (sprite[NAME] !== BARBARIAN_SPRITE_NAME && sprite[ACTION] !== ATTACK) {
        var proximity = Math.abs(getProximity(sprite, opponent));
        if (proximity > 0 && proximity < ATTACK_PROXIMITY) {
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

    let sprite_left = sprite[SPRITE].offset().left;
    let opponent_left = opponent[SPRITE].offset().left;
    let distance = Math.abs(sprite_left - opponent_left);

    if (opponent[ACTION] === JUMP  && distance < 100 && distance > 15) {
        isJumpEvaided = true;
        console.log('distance:' + distance + ' is between 15 and 100');
    } else {
        console.log('distance:' + distance + ' is not between 15 and 100');
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
            console.log(spr[NAME] + ' is not dead');
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
            console.log(sprite[NAME] + ' defeated ' + opponent[NAME]);
            opponent[DEATH][DELAY] = getDeathDelay(sprite, opponent);
            death(opponent);
        }
    }
    return false;
}

