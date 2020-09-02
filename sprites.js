BARBARIAN_SPRITE = {
    SPRITE : $(".barbarian"),
    NAME : BARBARIAN_SPRITE_NAME,
    ACTION : STOP,
    DIRECTION : RIGHT,
    HAS_MOVING_ATTACK: false,
    FPS : SPRITE_FPS,
    CURRENT_PIXELS_PER_SECOND: 0,
    PIXELS_PER_SECOND : SPRITE_PIXELS_PER_SECOND,
    STATUS : ALIVE,
    FRAMES : {
        ATTACK : BARBARIAN_ATTACK_FRAMES,
        JUMP : BARBARIAN_JUMP_FRAMES,
        RUN : BARBARIAN_RUN_FRAMES,
        WALK : BARBARIAN_WALK_FRAMES
    },
    POSITIONS : {
        ATTACK : {},
        JUMP : {}
    },
    ATTACK_THRESHOLDS : [
        {
            MIN : 0,
            MAX : 100
        },
        {
            MIN : 325,
            MAX : 390
        }
    ],
    DEATH : {
        SPRITE : $(".barbarian"),
        ANIMATION : BARBARIAN_DEATH_FRAMES,
        DELAY : 1800
    },
    STOP_POSITION : {
        RIGHT : STOP_RIGHT_POSITION,
        LEFT: STOP_LEFT_POSITION,
        RIGHT_HEIGHT : STOP_RIGHT_HEIGHT_OFFSET,
        LEFT_HEIGHT: STOP_LEFT_HEIGHT_OFFSET
    }
};

MONSTER_SPRITE = {
    SPRITE : $(".monster"),
    NAME : MONSTER_SPRITE_NAME,
    ACTION : WALK,
    DIRECTION : LEFT,
    HAS_MOVING_ATTACK : true,
    FPS: BOG_MONSTER_SPRITE_FPS,
    PIXELS_PER_SECOND : BOG_MONSTER_PIXELS_PER_SECOND,
    CURRENT_PIXELS_PER_SECOND: BOG_MONSTER_PIXELS_PER_SECOND,
    STATUS : ALIVE,
    FRAMES : {
        WALK : BOG_MONSTER_WALK_FRAMES,
        ATTACK : BOG_MONSTER_ATTACK_FRAMES
    },
    POSITIONS : {
        ATTACK : {}
    },
    ATTACK_THRESHOLDS : [
        {
            MIN : 0,
            MAX : 100
        },
        {
            MIN : 100,
            MAX : 390
        }
    ],
    DEATH : {
        SPRITE : $(".death"),
        ANIMATION : DEATH_FRAMES,
        DELAY : 1800
    }
};

function getSpritesInProximity(sprite, opponents, proximityThreshold) {
    var attackers = [];
    for (var i = 0; i < opponents.length; i++) {
        var opponent = opponents[i];
        proximity = getProximity(sprite, opponent);
        if (sprite[DIRECTION] == 'LEFT') {
            if (proximity > 0 && proximity < proximityThreshold) {
                attackers.push(opponent);
            }
        } else {
            if (proximity < 0 && proximity > -1*proximityThreshold ) {
                attackers.push(opponent);
            }
        }
    }
    return attackers;
}

function getPositionsAtAction(sprites) {
    var positionsAtAttack = {};
    for (var i = 0; i < sprites.length; i++) {
        var sprite = sprites[i];
        positionsAtAttack[sprite[NAME]] = sprite[SPRITE].offset().left;
    }
    return positionsAtAttack;
}
