var SPRITE_FPS = 5;
var BOG_MONSTER_SPRITE_FPS = 5;
var BOG_MONSTER_PIXELS_PER_SECOND = 150;
var STOP_RIGHT_POSITION = 0;
var STOP_LEFT_POSITION = 6;
var STOP_RIGHT_HEIGHT_OFFSET = 0;
var STOP_LEFT_HEIGHT_OFFSET = 1;

var DEATH_FRAMES = {
    RIGHT : {
        FRAMES: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        HEIGHT_OFFSET: 0
    },
    LEFT : {
        FRAMES: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        HEIGHT_OFFSET: 0
    },
    FPS : BOG_MONSTER_SPRITE_FPS
};

BARBARIAN_SPRITE = {
    SPRITE : $(".barbarian"),
    NAME : BARBARIAN_SPRITE_NAME,
    ACTION : STOP,
    DIRECTION : RIGHT,
    HAS_MOVING_ATTACK: false,
    FPS : SPRITE_FPS,
    CURRENT_PIXELS_PER_SECOND: 0,
    PIXELS_PER_SECOND : 150,
    STATUS : ALIVE,
    FRAMES : {
        ATTACK : {
            LEFT : {
                FRAMES : [47, 46, 45, 44, 43, 42, 41, 40],
                HEIGHT_OFFSET : 5},
            RIGHT : {
                FRAMES :  [32, 33, 34, 35, 36, 37, 38, 39],
                HEIGHT_OFFSET : 4}},
        JUMP : {
            LEFT : {
                FRAMES : [62, 61, 60, 59, 58, 57, 56 ],
                HEIGHT_OFFSET : 7},
            RIGHT : {
                FRAMES :  [48, 49, 50, 51, 52, 53, 54],
                HEIGHT_OFFSET : 6}},
        RUN : {
            LEFT : {
                FRAMES : [24, 25, 26, 27, 28, 29],
                HEIGHT_OFFSET : 3},
            RIGHT : {
                FRAMES : [16, 17, 18, 19, 20, 21],
                HEIGHT_OFFSET : 2}},
        WALK : {
            LEFT : {
                FRAMES :  [13, 12, 11, 10, 9, 8],
                HEIGHT_OFFSET : 1},
            RIGHT : {
                FRAMES : [1, 2, 3, 4, 5, 6],
                HEIGHT_OFFSET : 0}}
    },
    POSITIONS : {
        ATTACK : {},
        JUMP : {}
    },
    ATTACK_THRESHOLDS : [
        {
            MIN : 30,
            MAX : 100
        },
        {
            MIN : 325,
            MAX : 390
        }
    ],
    DEATH : {
        SPRITE : $(".barbarian"),
        ANIMATION : {
            RIGHT : {
                FRAMES: [96, 97, 98, 99, 100],
                HEIGHT_OFFSET: 12
            },
            LEFT : {
                FRAMES : [108, 107, 106, 105, 104],
                HEIGHT_OFFSET: 13
            },
            FPS : SPRITE_FPS
        },
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
        WALK : {
            LEFT : {
                FRAMES: [13, 12, 11, 10, 9, 8],
                HEIGHT_OFFSET: 1
            },
            RIGHT : {
                FRAMES: [0, 1, 2, 3, 4, 5],
                HEIGHT_OFFSET: 0
            }
        },
        ATTACK : {
            LEFT : {
                FRAMES: [31, 30, 29, 28, 27, 26, 25, 24],
                HEIGHT_OFFSET: 3
            },
            RIGHT : {
                FRAMES: [16, 17 , 18, 19, 20, 21, 23, 23],
                HEIGHT_OFFSET: 2
            }
        }
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
