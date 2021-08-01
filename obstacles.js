function avoidedObstacleWithJump(sprite, obstacle) {
    if (sprite[ACTION] === JUMP) {
        let sprite_left = sprite[SPRITE].offset().left;
        if (sprite_left > obstacle[JUMP_RANGE][0] && sprite_left < obstacle[JUMP_RANGE][1]) {
            return true;
        }
    }
    /*
    var actionPosition = sprite[POSITIONS][JUMP][BARBARIAN_SPRITE_NAME];
    var jumpedAgo = actionPosition ? new Date().getTime() - actionPosition[TIMESTAMP] : 100000;
    var jumpPosition = actionPosition ? actionPosition[LEFT] : undefined;
    return obstacle[JUMP_RANGE] && (jumpedAgo < 1000 && jumpPosition > obstacle[JUMP_RANGE][0] &&
        jumpPosition < obstacle[JUMP_RANGE][1]);

     */
    return false;
}

function isDownhill(sprite, obstacle) {
    return obstacle[HEIGHT] <= sprite[SPRITE].css('bottom').substring(0, sprite[SPRITE].css('bottom').length - 2)
        && obstacle[OBSTACLE_TYPE] !== PIT;
}

function moveSpriteToHeight(sprite, height) {
    sprite[SPRITE].css('bottom', height + 'px');
}

function isPastBoundry(sprite, obstacle) {
    if (sprite[DIRECTION] === RIGHT) {
        return sprite[SPRITE].offset().left >= obstacle[LEFT];
    } else {
        return sprite[SPRITE].offset().left <= obstacle[LEFT];
    }
    return false;
}

function isObstacleClose(sprite, obstacle) {
    var pixelsFromObsticle = Math.abs(obstacle[LEFT] - sprite[SPRITE].offset().left);

    if (pixelsFromObsticle <= 50) {
        return true;
    }
    return false;
}

function getFailAction(obstacle) {
    return obstacle[FAIL_ACTION];
}

function getObstacles(sprite) {
    var obstacleObj = SCREENS[screenNumber][OBSTACLES];
    obstacleObj = obstacleObj === undefined ? {LEFT: [], RIGHT: []} : obstacleObj;
    var obstacles = obstacleObj[sprite[DIRECTION]];

    var result = [];
    for (const obstacle of obstacles) {
        if (isObstacleClose(sprite, obstacle)) {
            result.push(obstacle);
        }
    }

    return result;
}

function handleObstacles(sprite, obstacle) {

    if (sprite[NAME] === BARBARIAN_SPRITE_NAME && screenNumber == 1 && $('.bridge').css('display') === 'block' &&
        sprite[SPRITE].offset().left >= 700) {
        //$('.bridge').css('display', 'none');
        $('.bridge').animate({bottom: '0px'}, 300, 'linear');

        setTimeout(function () {
            $('.bridge').css('display', 'none')
        }, 300);
    }

    for (const obstacle of getObstacles(sprite)) {
        if (isPastBoundry(sprite, obstacle)) {
            if (isMonster(sprite) || isDownhill(sprite, obstacle) || avoidedObstacleWithJump(sprite, obstacle)) {
                moveSpriteToHeight(sprite, obstacle[HEIGHT]);
            } else {
                performAction(sprite, getFailAction(obstacle), 1);
                // Allow barbarian to attack at boundary
                if (sprite[ACTION] !== ATTACK || sprite[ACTION] !== JUMP) {
                    return true;
                }
            }
        }
    }

    return false;
}
