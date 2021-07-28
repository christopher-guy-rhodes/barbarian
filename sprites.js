var SPRITE_FPS = 5;
var FALLING_PIXELS_PER_SECOND = 300;
var BOG_MONSTER_SPRITE_FPS = 5;
var BOG_MONSTER_PIXELS_PER_SECOND = 150;
var DOG_SPRITE_FPS = 5;
var DOG_PIXELS_PER_SECOND = 150;
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
    currentPixelsPerSecond: 0,
    PIXELS_PER_SECOND : 150,
    STATUS : DEAD,
    DEATH_TIME: 0,
    FRAMES : {
        ATTACK : {
            LEFT : {
                FRAMES : [7, 6, 5, 4, 3, 2, 1, 0],
                HEIGHT_OFFSET : 5},
            RIGHT : {
                FRAMES :  [0, 1, 2, 3, 4, 5, 6, 7],
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
                HEIGHT_OFFSET : 0}},
        FALL : {
            LEFT: {
                FRAMES : [3, 2, 1, 0],
                HEIGHT_OFFSET : 15},
            RIGHT: {
                FRAMES : [0, 1, 2, 3],
                HEIGHT_OFFSET: 14}}
    },
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

DOG_SPRITE = {
    SPRITE : $('.dog'),
    NAME : DOG_SPRITE_NAME,
    ACTION : SIT,
    DIRECTION : LEFT,
    HAS_MOVING_ATTACK : true,
    FPS : DOG_SPRITE_FPS,
    PIXELS_PER_SECOND : DOG_PIXELS_PER_SECOND,
    currentPixelsPerSecond : 0,
    STATUS : DEAD,
    DEATH_TIME: 0,
    FRAMES : {
        SIT : {
            LEFT : {
                FRAMES: [3, 2, 1, 0],
                HEIGHT_OFFSET : 1
            },
            RIGHT : {
                FRAMES : [0, 1, 2, 3],
                HEIGHT_OFFSET : 0
            }
        },
        ATTACK : {
            LEFT : {
                FRAMES: [4, 3, 2, 1, 0],
                HEIGHT_OFFSET : 3
            },
            RIGHT : {
                FRAMES : [0, 1, 2, 3, 4],
                HEIGHT_OFFSET : 2
            }
        },
        WALK : {
            LEFT : {
                FRAMES: [4, 3, 2, 1, 0],
                HEIGHT_OFFSET : 3
            },
            RIGHT : {
                FRAMES : [0, 1, 2, 3, 4],
                HEIGHT_OFFSET : 2
            }
        }
    },
    ATTACK_THRESHOLDS : {
        MIN : 0,
        MAX : 100
    },
    BARBARIAN_ATTACK_THRESHOLDS : {
        MIN : 0,
        MAX : 115
    },
    DEATH : {
        SPRITE : $(".death"),
        ANIMATION : DEATH_FRAMES,
        DELAY : 1800
    },
    STOP_POSITION : {
        RIGHT : 0,
        LEFT: 3,
        RIGHT_HEIGHT : 0,
        LEFT_HEIGHT: 1
    }
}

MONSTER_SPRITE = {
    SPRITE : $(".monster"),
    NAME : MONSTER_SPRITE_NAME,
    ACTION : WALK,
    DIRECTION : LEFT,
    HAS_MOVING_ATTACK : true,
    FPS: BOG_MONSTER_SPRITE_FPS,
    PIXELS_PER_SECOND : BOG_MONSTER_PIXELS_PER_SECOND,
    currentPixelsPerSecond: BOG_MONSTER_PIXELS_PER_SECOND,
    STATUS : DEAD,
    DEATH_TIME: 0,
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
    ATTACK_THRESHOLDS : {
        MIN : 0,
        MAX : 100
    },
    BARBARIAN_ATTACK_THRESHOLDS : {
        MIN: 0,
        MAX: 100
    },
    DEATH : {
        SPRITE : $(".death"),
        ANIMATION : DEATH_FRAMES,
        DELAY : 1800
    }
};

SCREENS = {
    0 : {
        OPPONENTS: [MONSTER_SPRITE, BARBARIAN_SPRITE]
    },
    1 : {
        OBSTACLES: {
            RIGHT: [
                {LEFT: 50, OBSTACLE_TYPE: ELEVATION, HEIGHT: 82, FAIL_ACTION: STOP, JUMP_RANGE: [-100, 100]},
                {LEFT: 400, OBSTACLE_TYPE: ELEVATION, HEIGHT: 164, FAIL_ACTION: STOP, JUMP_RANGE: [400, 430]},
                {LEFT: 800, OBSTACLE_TYPE: PIT, HEIGHT: 164, FAIL_ACTION: FALL, JUMP_RANGE: [710, 830]}
            ],
            LEFT: [
                {LEFT: 100, OBSTACLE_TYPE: ELEVATION, HEIGHT: 12},
                {LEFT: 400, OBSTACLE_TYPE: ELEVATION, HEIGHT: 82},
                {LEFT: 950, OBSTACLE_TYPE: PIT, HEIGHT: 164, FAIL_ACTION: FALL, JUMP_RANGE: [880, 1000]}
            ]
        },
        OPPONENTS: [DOG_SPRITE, BARBARIAN_SPRITE]
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

function isMonster(sprite) {
    return sprite[NAME] !== BARBARIAN_SPRITE_NAME;
}

function isDead(sprite) {
    return sprite[STATUS] === DEAD;
}

function isSpriteCurrentOpponent(sprite) {
    return SCREENS[screenNumber][OPPONENTS].includes(sprite);
}

function show(sprite) {
    sprite.css('display', 'block');
}

function hide(sprite) {
    sprite.css('display', 'none');
}

function setBottom(sprite, bottom) {
    sprite.css('bottom', bottom + 'px')
}

function setLeft(sprite, left) {
    sprite.css('left', left + 'px')
}

function setStatus(sprite, status) {
    sprite[STATUS] = status;
}

function getAction(sprite) {
    return sprite[ACTION];
}

function setAction(sprite, action) {
    sprite[ACTION] = action;
}

function getDirection(sprite) {
    return sprite[DIRECTION];
}

function setDirection(sprite, direction) {
    sprite[DIRECTION] = direction;
}

function setBackgroundPosition(sprite, backgroundPosition) {
    sprite.css('background-position', backgroundPosition + 'px')
}
