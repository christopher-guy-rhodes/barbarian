var SPRITE_FPS = 5;
var FALLING_PIXELS_PER_SECOND = 300;
var BOG_MONSTER_SPRITE_FPS = 5;
var BOG_MONSTER_PIXELS_PER_SECOND = 150;
var DOG_SPRITE_FPS = 5;
var DOG_PIXELS_PER_SECOND = 150;
var BARBARIAN_SPRITE_PIXELS_PER_SECOND = 150;
var STOP_RIGHT_POSITION = 0;
var STOP_LEFT_POSITION = 6;
var STOP_RIGHT_HEIGHT_OFFSET = 0;
var STOP_LEFT_HEIGHT_OFFSET = 1;

var DEATH_FRAMES = {
    DEATH : {
        RIGHT: {
            FRAMES: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            HEIGHT_OFFSET: 0
        },
        LEFT: {
            FRAMES: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            HEIGHT_OFFSET: 0
        },
        FPS: BOG_MONSTER_SPRITE_FPS
    }
};

BARBARIAN_SPRITE = {
    SPRITE : $(".barbarian"),
    NAME : BARBARIAN_SPRITE_NAME,
    ACTION : STOP,
    DIRECTION : RIGHT,
    HAS_MOVING_ATTACK: false,
    FPS: {
      WALK : SPRITE_FPS,
      RUN : SPRITE_FPS * RUN_SPEED_INCREASE_FACTOR,
      JUMP: SPRITE_FPS,
      ATTACK: SPRITE_FPS,
      STOP: 0,
      FALL: SPRITE_FPS
    },
    PIXELS_PER_SECOND : {
        WALK : BARBARIAN_SPRITE_PIXELS_PER_SECOND,
        RUN : BARBARIAN_SPRITE_PIXELS_PER_SECOND * RUN_SPEED_INCREASE_FACTOR,
        JUMP: BARBARIAN_SPRITE_PIXELS_PER_SECOND,
        ATTACK: 0,
        STOP: 0,
        FALL: BARBARIAN_SPRITE_PIXELS_PER_SECOND
    },

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
                HEIGHT_OFFSET: 14}},
        STOP: {
            LEFT: {
                FRAMES : [13],
                HEIGHT_OFFSET : 1
            },
            RIGHT: {
                FRAMES : [1],
                HEIGHT_OFFSET: 1
            }
        }
    },
    DEATH : {
        SPRITE : $(".barbarian"),
        FRAMES : {
            DEATH: {
                RIGHT: {
                    FRAMES: [96, 97, 98, 99, 100],
                    HEIGHT_OFFSET: 12
                },
                LEFT: {
                    FRAMES: [108, 107, 106, 105, 104],
                    HEIGHT_OFFSET: 13
                },
                FPS: SPRITE_FPS
            }
        },
        DELAY : 1800
    },
    STOP_POSITION : {
        RIGHT : STOP_RIGHT_POSITION,
        LEFT: STOP_LEFT_POSITION,
        RIGHT_HEIGHT : STOP_RIGHT_HEIGHT_OFFSET,
        LEFT_HEIGHT: STOP_LEFT_HEIGHT_OFFSET
    },
    RESET_LEFT: 0,
    RESET_BOTTOM: 12,
    RESET_DISPLAY: 'block',
    RESET_STATUS: ALIVE
};

DOG_SPRITE = {
    SPRITE : $('.dog'),
    NAME : DOG_SPRITE_NAME,
    ACTION : SIT,
    DIRECTION : LEFT,
    HAS_MOVING_ATTACK : true,
    FPS: {
        WALK : DOG_SPRITE_FPS,
        RUN : DOG_SPRITE_FPS * RUN_SPEED_INCREASE_FACTOR,
        JUMP: DOG_SPRITE_FPS,
        ATTACK: DOG_SPRITE_FPS * RUN_SPEED_INCREASE_FACTOR,
        STOP: 0,
        FALL: DOG_SPRITE_FPS,
        SIT: DOG_SPRITE_FPS
    },
    PIXELS_PER_SECOND : {
        WALK : DOG_PIXELS_PER_SECOND,
        RUN : DOG_PIXELS_PER_SECOND * RUN_SPEED_INCREASE_FACTOR,
        JUMP: DOG_PIXELS_PER_SECOND,
        ATTACK: DOG_PIXELS_PER_SECOND,
        SIT: 0,
        STOP: 0,
        FALL: DOG_PIXELS_PER_SECOND
    },
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
        FRAMES : DEATH_FRAMES,
        DELAY : 1800
    },
    STOP_POSITION : {
        RIGHT : 0,
        LEFT: 3,
        RIGHT_HEIGHT : 0,
        LEFT_HEIGHT: 1
    },
    DEFAULT_ACTION: SIT,
    SOUND: GROWL_SOUND,
    RESET_LEFT: 850,
    RESET_BOTTOM: 160,
    RESET_DISPLAY: 'none',
    RESET_STATUS: DEAD
}

MONSTER_SPRITE = {
    SPRITE : $(".monster"),
    NAME : MONSTER_SPRITE_NAME,
    ACTION : WALK,
    DIRECTION : LEFT,
    HAS_MOVING_ATTACK : true,
    FPS: {
        WALK : BOG_MONSTER_SPRITE_FPS,
        RUN : BOG_MONSTER_SPRITE_FPS * RUN_SPEED_INCREASE_FACTOR,
        JUMP: BOG_MONSTER_SPRITE_FPS,
        ATTACK : BOG_MONSTER_SPRITE_FPS * RUN_SPEED_INCREASE_FACTOR,
        STOP: 0,
        FALL: BOG_MONSTER_SPRITE_FPS
    },
    PIXELS_PER_SECOND : {
        WALK : BOG_MONSTER_PIXELS_PER_SECOND,
        RUN : BOG_MONSTER_PIXELS_PER_SECOND * RUN_SPEED_INCREASE_FACTOR,
        JUMP: BOG_MONSTER_PIXELS_PER_SECOND,
        ATTACK: BOG_MONSTER_PIXELS_PER_SECOND,
        STOP: 0,
        FALL: BOG_MONSTER_PIXELS_PER_SECOND
    },
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
        FRAMES : DEATH_FRAMES,
        DELAY : 1800
    },
    SOUND: MONSTER_SOUND,
    DEFAULT_ACTION: WALK,
    RESET_LEFT: 850,
    RESET_BOTTOM: 12,
    RESET_DISPLAY: 'block',
    RESET_STATUS: DEAD
};

SPRITES = [BARBARIAN_SPRITE, MONSTER_SPRITE, DOG_SPRITE];

SCREENS = {
    0 : {
        OPPONENTS: [MONSTER_SPRITE, BARBARIAN_SPRITE]
    },
    1 : {
        OBSTACLES: {
            RIGHT: [
                {LEFT: 50, OBSTACLE_TYPE: ELEVATION, FAIL_ACTION: STOP, HEIGHT: 82, JUMP_RANGE: [-100, 100]},
                {LEFT: 400, OBSTACLE_TYPE: ELEVATION, FAIL_ACTION: STOP, HEIGHT: 164, JUMP_RANGE: [400, 430]},
                {LEFT: 800, OBSTACLE_TYPE: PIT, FAIL_ACTION: FALL, HEIGHT: 164, JUMP_RANGE: [710, 830]}
            ],
            LEFT: [
                {LEFT: 100, OBSTACLE_TYPE: ELEVATION, FAIL_ACTION: STOP, HEIGHT: 12},
                {LEFT: 400, OBSTACLE_TYPE: ELEVATION, FAIL_ACTION: STOP, HEIGHT: 82},
                {LEFT: 950, OBSTACLE_TYPE: PIT, FAIL_ACTION: FALL, HEIGHT: 164, JUMP_RANGE: [880, 1000]}
            ]
        },
        OPPONENTS: [DOG_SPRITE, BARBARIAN_SPRITE],
        ARTIFACTS: [BRIDGE],
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

function setDisplay(sprite, display) {
    sprite.css('display', display);
}

function show(sprite) {
    sprite.css('display', 'block');
}

function showSprite(sprite) {
    show(getElement(sprite));
}

function hide(sprite) {
    sprite.css('display', 'none');
}

function hideSprite(sprite) {
    hide(getElement(sprite));
}

function setBottom(sprite, bottom) {
    sprite.css('bottom', bottom + 'px')
}

function setSpriteBottom(sprite, bottom) {
    setBottom(getElement(sprite), bottom);
}

function setLeft(sprite, left) {
    getElement(sprite).css('left', left + 'px')
}

function getStatus(sprite) {
    return sprite[STATUS];
}

function setStatus(sprite, status) {
    sprite[STATUS] = status;
}

function getAction(sprite) {
    return sprite[ACTION];
}

function getSound(sprite) {
    return sprite[SOUND];
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

function isMovingRight(sprite) {
    return getDirection(sprite) === RIGHT;
}

function setBackgroundPosition(sprite, backgroundPosition) {
    sprite.css('background-position', backgroundPosition + 'px')
}

function stopSpriteMovement(sprite) {
    getElement(sprite).stop();
}

function getName(sprite) {
    return sprite[NAME];
}

function setHighlight(sprite, state) {
    getElement(sprite).css('filter','brightness(' + (state ? '300%' : '100%') + ')');
}

function getPixelsPerSecond(sprite, action) {
    return sprite[PIXELS_PER_SECOND][action];
}

function hasMovingAttack(sprite) {
    return sprite[HAS_MOVING_ATTACK];
}

function getRightStopPosition(sprite) {
    return sprite[STOP_POSITION][RIGHT];
}

function getLeftStopPosition(sprite) {
    return sprite[STOP_POSITION][LEFT];
}

function getWidth(sprite) {
    return getElement(sprite).width();
}

function getHeight(sprite) {
    return getElement(sprite).height();
}

function getRightHeightStopPosition(sprite) {
    return sprite[STOP_POSITION][RIGHT_HEIGHT];
}

function getLeftHeightStopPosition(sprite) {
    return sprite[STOP_POSITION][LEFT_HEIGHT];
}

function getLeft(sprite) {
    return getElement(sprite).offset().left;
}

function getBottom(sprite) {
    return stripPxSuffix(getElement(sprite).css('bottom'));
}

function setSpriteBackgroundPosition(sprite, x, y) {
    getElement(sprite).css('background-position', x + 'px ' + y + 'px');
}

function setDeathTime(sprite, time) {
    sprite[DEATH_TIME] = time;
}

function getDeathTime(sprite) {
    return sprite[DEATH_TIME];
}

function getDefaultAction(sprite) {
    return sprite[DEFAULT_ACTION];
}

function getResetLeft(sprite) {
    return sprite[RESET_LEFT];
}

function getResetBottom(sprite) {
    return sprite[RESET_BOTTOM];
}

function getResetStatus(sprite) {
    return sprite[RESET_STATUS];
}

function getResetDisplay(sprite) {
    return sprite[RESET_DISPLAY];
}

function getFrames(sprite, requestedAction, direction) {
    return sprite[FRAMES][requestedAction][direction][FRAMES];
}

function getDeathDelay(sprite) {
    return sprite[DEATH][DELAY];
}

function getFps(sprite, action) {
    return sprite[FPS][action];
}

function getElement(sprite) {
    return sprite[SPRITE];
}

function isWalking(sprite) {
    return getAction(sprite) === WALK;
}
