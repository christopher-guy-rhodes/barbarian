BARBARIAN_SPRITE = {
    SPRITE : $(".barbarian"),
    NAME : BARBARIAN_SPRITE_NAME,
    ACTION : STOP,
    DIRECTION : RIGHT,
    HAS_MOVING_ATTACK: false,
    FPS : SPRITE_FPS,
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
    STATUS : ALIVE,
    FRAMES : {
        WALK : BOG_MONSTER_WALK_FRAMES,
        ATTACK : BOG_MONSTER_ATTACK_FRAMES
    }
};

DEATH_SPRITE = {
    SPRITE : $(".death"),
    NAME : DEATH_SPRITE_NAME,
    ACTION : DEATH,
    DIRECTION : UP,
    FPS : SPRITE_FPS,
    PIXELS_PER_SECOND : SPRITE_PIXELS_PER_SECOND,
    FRAMES : {
        DEATH : DEATH_FRAMES
    }
}

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

