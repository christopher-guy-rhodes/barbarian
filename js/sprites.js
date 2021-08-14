BARBARIAN_CHARACTER = {
    SPRITE : $(".barbarian"),
    NAME : BARBARIAN_SPRITE_NAME,
    ACTION : STOP,
    DIRECTION : RIGHT,
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
        }},
    DEATH : {
        SPRITE : $(".barbarian"),
        DELAY : 1800,
        TIME: 0,
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
        }
    },
    STOP_POSITION : {
        RIGHT : STOP_RIGHT_POSITION,
        LEFT: STOP_LEFT_POSITION,
        RIGHT_HEIGHT : STOP_RIGHT_HEIGHT_OFFSET,
        LEFT_HEIGHT: STOP_LEFT_HEIGHT_OFFSET
    },
    RESET : {
        ACTION : STOP,
        DIRECTION : RIGHT,
        LEFT: 0,
        BOTTOM: 12,
        STATUS: ALIVE
    }
};

DOG_CHARACTER = {
    SPRITE : $('.dog'),
    NAME : DOG_SPRITE_NAME,
    ACTION : SIT,
    DIRECTION : LEFT,
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
        },
    },
    ATTACK_THRESHOLDS : {
        MIN : 0,
        MAX : 100
    },
    JUMP_THRESHOLDS : {
        MIN : 15,
        MAX : 100
    },
    BARBARIAN_ATTACK_THRESHOLDS : {
        MIN : 0,
        MAX : 115
    },
    DEATH : {
        SPRITE : $(".death"),
        DELAY : 1800,
        TIME: 0,
        FRAMES : {
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
        },
    },
    STOP_POSITION : {
        RIGHT : 0,
        LEFT: 3,
        RIGHT_HEIGHT : 0,
        LEFT_HEIGHT: 1
    },
    SOUND: GROWL_SOUND,
    RESET : {
        ACTION : SIT,
        DIRECTION: LEFT,
        LEFT: 850,
        BOTTOM: 160,
        STATUS: DEAD
    }
};

MONSTER_CHARACTER = {
    SPRITE : $(".monster"),
    NAME : MONSTER_SPRITE_NAME,
    ACTION : WALK,
    DIRECTION : LEFT,
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
        },
    },
    ATTACK_THRESHOLDS : {
        MIN : 0,
        MAX : 100
    },
    JUMP_THRESHOLDS : {
        MIN : 15,
        MAX : 100
    },
    BARBARIAN_ATTACK_THRESHOLDS : {
        MIN: 0,
        MAX: 100
    },
    DEATH : {
        SPRITE : $(".death"),
        DELAY : 1800,
        TIME: 0,
        FRAMES : {
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
        },
    },
    SOUND: MONSTER_SOUND,
    RESET : {
        ACTION : WALK,
        DIRECTION : LEFT,
        LEFT: 850,
        BOTTOM: 12,
        STATUS: DEAD
    }
};

SPRITES = [BARBARIAN_CHARACTER, MONSTER_CHARACTER, DOG_CHARACTER];

SCREENS = {
    0 : {
        OBSTACLES : {
            LEFT: [],
            RIGHT: [],
        },
        OPPONENTS: [MONSTER_CHARACTER, BARBARIAN_CHARACTER],
        TRAP_DOORS: []
    },
    1 : {
        OBSTACLES: {
            RIGHT: [
                {LEFT: 50, OBSTACLE_TYPE: ELEVATION, FAIL_ACTION: STOP, HEIGHT: 82, JUMP_THRESHOLDS: {MIN: -100, MAX: 100}},
                {LEFT: 400, OBSTACLE_TYPE: ELEVATION, FAIL_ACTION: STOP, HEIGHT: 160, JUMP_THRESHOLDS: {MIN: 400, MAX: 430}},
                {LEFT: 800, OBSTACLE_TYPE: PIT, FAIL_ACTION: FALL, HEIGHT: 160, JUMP_THRESHOLDS: {MIN: 710, MAX: 830}}
            ],
            LEFT: [
                {LEFT: 100, OBSTACLE_TYPE: ELEVATION, FAIL_ACTION: STOP, HEIGHT: 12},
                {LEFT: 400, OBSTACLE_TYPE: ELEVATION, FAIL_ACTION: STOP, HEIGHT: 82},
                {LEFT: 950, OBSTACLE_TYPE: PIT, FAIL_ACTION: FALL, HEIGHT: 160, JUMP_THRESHOLDS: {MIN: 880, MAX: 1000}}
            ]
        },
        OPPONENTS: [DOG_CHARACTER, BARBARIAN_CHARACTER],
        TRAP_DOORS: [{
            ELEMENT: BRIDGE,
            RESET : {
                BOTTOM: 116
            },
            TRIGGER : {
                LEFT: 700,
                TIME: 300
            }}],
    }
};
