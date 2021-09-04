let BARBARIAN_CHARACTER = {
    SPRITE : $(".barbarian"),
    NAME : BARBARIAN_SPRITE_NAME,
    CHARACTER_TYPE: BARBARIAN_CHARACTER_TYPE,
    ACTION : STOP,
    PREVIOUS_ACTION : undefined,
    DIRECTION : RIGHT,
    VERTICAL_DIRECTION : undefined,
    CAN_ELEVATE : true,
    CAN_HIGHLIGHT: false,
    FPS: {
      WALK : SPRITE_FPS,
      SWIM : SWIM_FPS,
      RUN : SPRITE_FPS * RUN_SPEED_INCREASE_FACTOR,
      JUMP: SPRITE_FPS,
      ATTACK: SPRITE_FPS,
      STOP: 0,
      FALL: SPRITE_FPS
    },
    PIXELS_PER_SECOND : {
        WALK : BARBARIAN_SPRITE_PIXELS_PER_SECOND,
        SWIM : BARBARIAN_SPRITE_PIXELS_PER_SECOND,
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
        SWIM : {
            LEFT : {
                FRAMES :  [3, 2, 1, 0],
                HEIGHT_OFFSET : 17},
            RIGHT : {
                FRAMES : [0, 1, 2, 3],
                HEIGHT_OFFSET : 16}},
        FALL : {
            LEFT: {
                FRAMES : [3, 2, 1, 0],
                HEIGHT_OFFSET : 15},
            RIGHT: {
                FRAMES : [0, 1, 2, 3],
                HEIGHT_OFFSET: 14}},
        STOP: {
            LEFT : {
                FRAMES :  [3, 2, 1, 0],
                HEIGHT_OFFSET : 17},
            RIGHT : {
                FRAMES : [0, 1, 2, 3],
                HEIGHT_OFFSET : 16}
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
    RESET : {
        ACTION : STOP,
        DIRECTION : RIGHT,
        LEFT: 0,
        BOTTOM: {
            0 : 12,
            1 : 12,
            2 : 160,
            3 : 12,
            4 : 700,
        },
        STATUS: ALIVE
    }
};

let DOG_CHARACTER = {
    SPRITE : $('.dog'),
    NAME : DOG_SPRITE_NAME,
    CHARACTER_TYPE: DOG_CHARACTER_TYPE,
    ACTION : SIT,
    PREVIOUS_ACTION : undefined,
    DIRECTION : LEFT,
    VERTICAL_DIRECTION : undefined,
    CAN_ELEVATE : true,
    CAN_HIGHLIGHT: true,
    FPS: {
        SIT: DOG_SPRITE_FPS,
        ATTACK: DOG_SPRITE_FPS * RUN_SPEED_INCREASE_FACTOR,
        WALK : DOG_SPRITE_FPS,
    },
    PIXELS_PER_SECOND : {
        SIT: 0,
        ATTACK: DOG_PIXELS_PER_SECOND,
        WALK : DOG_PIXELS_PER_SECOND,
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
    SOUND: GROWL_SOUND,
    RESET : {
        ACTION : SIT,
        DIRECTION: LEFT,
        LEFT: 850,
        BOTTOM: {
            0 : 12,
            1 : 160,
            2 : 12,
            3 : 12,
        },
        STATUS: DEAD,
        NUMBER_OF_TIMES: 0,
        TURNAROUND : true
    }
};

let MONSTER_INVINCIBLE_CHARACTER = {
    SPRITE : $(".monster_invincible"),
    NAME : MONSTER_INVINCIBLE_SPRITE_NAME,
    CHARACTER_TYPE: MONSTER_CHARACTER_TYPE,
    ACTION : WALK,
    PREVIOUS_ACTION : undefined,
    DIRECTION : LEFT,
    VERTICAL_DIRECTION : undefined,
    CAN_ELEVATE : true,
    CAN_HIGHLIGHT: false,
    FPS: {
        WALK : BOG_MONSTER_SPRITE_FPS,
        ATTACK : BOG_MONSTER_SPRITE_FPS * RUN_SPEED_INCREASE_FACTOR,
    },
    PIXELS_PER_SECOND : {
        WALK : BOG_MONSTER_PIXELS_PER_SECOND,
        ATTACK: BOG_MONSTER_PIXELS_PER_SECOND,
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
        MIN : -25,
        MAX : 125
    },
    BARBARIAN_ATTACK_THRESHOLDS : {
        MIN: 0,
        MAX: 0
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
        BOTTOM: {
            0 : 12,
            1 : 12,
            2 : 12,
            3 : 12,
        },
        STATUS: DEAD,
        NUMBER_OF_TIMES: 0,
        TURNAROUND : true
    }
};

let MONSTER_CHARACTER = {
    SPRITE : $(".monster"),
    NAME : MONSTER_SPRITE_NAME,
    TYPE: MONSTER_CHARACTER_TYPE,
    ACTION : WALK,
    PREVIOUS_ACTION : undefined,
    DIRECTION : LEFT,
    VERTICAL_DIRECTION : undefined,
    CAN_ELEVATE : true,
    CAN_HIGHLIGHT: true,
    FPS: {
        WALK : BOG_MONSTER_SPRITE_FPS,
        ATTACK : BOG_MONSTER_SPRITE_FPS * RUN_SPEED_INCREASE_FACTOR,
    },
    PIXELS_PER_SECOND : {
        WALK : BOG_MONSTER_PIXELS_PER_SECOND,
        ATTACK: BOG_MONSTER_PIXELS_PER_SECOND,
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
        MIN : -10,
        MAX : 110
    },
    BARBARIAN_ATTACK_THRESHOLDS : {
        MIN: 0,
        MAX: 115
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
        BOTTOM: {
            0 : 12,
            1 : 12,
            2 : 12,
            3 : 12,
        },
        STATUS: DEAD,
        NUMBER_OF_TIMES: 0,
        TURNAROUND : true
    }
};

let ROCK_CHARACTER = {
    SPRITE : $('.rock'),
    NAME : ROCK_SPRITE_NAME,
    CHARACTER_TYPE: ROCK_CHARACTER_TYPE,
    ACTION : SIT,
    PREVIOUS_ACTION : undefined,
    DIRECTION : LEFT,
    CAN_ELEVATE : false,
    CAN_HIGHLIGHT: false,
    FPS: {
        SIT: ROCK_SPRITE_FPS,
        WALK : ROCK_SPRITE_FPS,
        ATTACK: ROCK_SPRITE_FPS,
    },
    PIXELS_PER_SECOND : {
        SIT: 0,
        ATTACK: ROCK_PIXELS_PER_SECOND,
        WALK : ROCK_PIXELS_PER_SECOND,
    },
    STATUS : DEAD,
    FRAMES : {
        SIT : {
            LEFT : {
                FRAMES: [5, 4],
                HEIGHT_OFFSET : 0
            },
            RIGHT : {
                FRAMES : [0, 1],
                HEIGHT_OFFSET : 0
            }
        },
        ATTACK : {
            LEFT : {
                FRAMES: [5, 4, 3, 2, 1, 0],
                HEIGHT_OFFSET : 0
            },
            RIGHT : {
                FRAMES : [0, 1, 2, 3, 4, 5],
                HEIGHT_OFFSET : 0
            }
        },
        WALK : {
            LEFT : {
                FRAMES: [5, 4, 3, 2, 1, 0],
                HEIGHT_OFFSET : 0
            },
            RIGHT : {
                FRAMES : [0, 1, 2, 3, 4, 5],
                HEIGHT_OFFSET : 0
            }
        },
    },
    ATTACK_THRESHOLDS : {
        MIN : MONSTER_CHARACTER[ATTACK_THRESHOLDS][MIN] - 50,
        MAX : MONSTER_CHARACTER[ATTACK_THRESHOLDS][MAX] + 50
    },
    JUMP_THRESHOLDS : {
        MIN : 0,
        MAX : 0
    },
    BARBARIAN_ATTACK_THRESHOLDS : {
        MIN : 0,
        MAX : 0
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
    SOUND: undefined,
    RESET : {
        ACTION : SIT,
        DIRECTION: LEFT,
        LEFT: 1270,
        BOTTOM: {
            SCREEN_0 : 12,
            SCREEN_1 : 12,
            SCREEN_2 : 12
        },
        STATUS: DEAD,
        NUMBER_OF_TIMES: 0,
        TURNAROUND : false
    }
};

let SHARK_CHARACTER1 = newShark($('.shark1'), SHARK_SPRITE_NAME1, 400, 0);
let SHARK_CHARACTER2 = newShark($('.shark2'), SHARK_SPRITE_NAME2, 0, 1400);
let SHARK_CHARACTER3 = newShark($('.shark3'), SHARK_SPRITE_NAME3, 800, 1400);
let SHARK_CHARACTER4 = newShark($('.shark4'), SHARK_SPRITE_NAME4, 400, 1400);

function newShark(element, name, bottom, left) {
    return {
        SPRITE: element,
        CHARACTER_TYPE : SHARK_CHARACTER_TYPE,
        NAME: name,
        ACTION: WALK,
        PREVIOUS_ACTION: undefined,
        DIRECTION: LEFT,
        CAN_ELEVATE: false,
        CAN_HIGHLIGHT: false,
        FPS: {
            WALK: SHARK_SPRITE_FPS,
            ATTACK: SHARK_SPRITE_FPS,
        },
        PIXELS_PER_SECOND: {
            ATTACK: SHARK_PIXELS_PER_SECOND,
            WALK: SHARK_PIXELS_PER_SECOND,
        },
        STATUS: DEAD,
        FRAMES: {
            ATTACK: {
                LEFT: {
                    FRAMES: [2, 1, 0],
                    HEIGHT_OFFSET: 3
                },
                RIGHT: {
                    FRAMES: [0, 1, 2],
                    HEIGHT_OFFSET: 2
                }
            },
            WALK: {
                LEFT: {
                    FRAMES: [17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
                    HEIGHT_OFFSET: 1
                },
                RIGHT: {
                    FRAMES: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
                    HEIGHT_OFFSET: 0
                }
            },
        },
        ATTACK_THRESHOLDS: {
            MIN: 0,
            MAX: 100
        },
        JUMP_THRESHOLDS: {
            MIN: 15,
            MAX: 100
        },
        BARBARIAN_ATTACK_THRESHOLDS: {
            MIN: 0,
            MAX: 115
        },
        DEATH: {
            SPRITE: $(".death"),
            DELAY: 1800,
            TIME: 0,
            FRAMES: {
                DEATH: {
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
        SOUND: SPLASH_SOUND,
        RESET: {
            ACTION: WALK,
            DIRECTION: LEFT,
            LEFT: left,
            BOTTOM: {
                SCREEN_0: bottom,
                SCREEN_1: bottom,
                SCREEN_2: bottom,
                SCREEN_3: bottom,
            },
            STATUS: DEAD,
            NUMBER_OF_TIMES: 0,
            TURNAROUND: true
        }
    };
}

SPRITES = [BARBARIAN_CHARACTER, MONSTER_CHARACTER, DOG_CHARACTER, ROCK_CHARACTER, MONSTER_INVINCIBLE_CHARACTER, SHARK_CHARACTER1, SHARK_CHARACTER2, SHARK_CHARACTER3, SHARK_CHARACTER4];

SCREENS = {
    0 : {
        OBSTACLES : {
            LEFT: [],
            RIGHT: [],
        },
        OPPONENTS: [BARBARIAN_CHARACTER, MONSTER_CHARACTER],
        TRAP_DOORS: [],
        WATER: false,
        ALLOWED_SCROLL_DIRECTIONS: {
            LEFT : false,
            RIGHT: true
        }
    },
    1 : {
        OBSTACLES: {
            RIGHT: [
                {LEFT: 50, OBSTACLE_TYPE: ELEVATION, FAIL_ACTION: STOP, HEIGHT: 82, JUMP_THRESHOLDS: {MIN: -100, MAX: 100}},
                {LEFT: 400, OBSTACLE_TYPE: ELEVATION, FAIL_ACTION: STOP, HEIGHT: 160, JUMP_THRESHOLDS: {MIN: 350, MAX: 430}},
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
        WATER: false,
        ALLOWED_SCROLL_DIRECTIONS: {
            LEFT : true,
            RIGHT: true
        }
    },
    2 : {
        OBSTACLES : {
            RIGHT: [
                {LEFT: 107, OBSTACLE_TYPE : ELEVATION, FAIL_ACTION: STOP, HEIGHT: 122},
                {LEFT: 207, OBSTACLE_TYPE : ELEVATION, FAIL_ACTION: STOP, HEIGHT: 74},
                {LEFT: 325, OBSTACLE_TYPE : ELEVATION, FAIL_ACTION: STOP, HEIGHT: 12},
            ],
            LEFT: [
                {LEFT: 410, OBSTACLE_TYPE : ELEVATION, FAIL_ACTION: STOP, HEIGHT: 75, JUMP_THRESHOLDS : {MIN: 310, MAX: 460}},
                {LEFT: 165, OBSTACLE_TYPE : ELEVATION, FAIL_ACTION: STOP, HEIGHT: 165, JUMP_THRESHOLDS : {MIN: 65, MAX: 215}},
                {LEFT: 280, OBSTACLE_TYPE : ELEVATION, FAIL_ACTION: STOP, HEIGHT: 122, JUMP_THRESHOLDS : {MIN: 180, MAX: 330}},
            ],
        },
        OPPONENTS: [BARBARIAN_CHARACTER, ROCK_CHARACTER, MONSTER_INVINCIBLE_CHARACTER],
        TRAP_DOORS: [],
        WATER: false,
        ALLOWED_SCROLL_DIRECTIONS: {
            LEFT : true,
            RIGHT: true
        }
    },
    3 : {
        OBSTACLES : {
            LEFT: [],
            RIGHT: [],
        },
        OPPONENTS: [BARBARIAN_CHARACTER, SHARK_CHARACTER1, SHARK_CHARACTER2, SHARK_CHARACTER3, SHARK_CHARACTER4],
        TRAP_DOORS: [],
        WATER: true,
        ALLOWED_SCROLL_DIRECTIONS: {
            LEFT : false,
            RIGHT: true
        }
    }
};

BARBARIAN_ACTION_NUM_TIMES = {
    RUN : 0,
    WALK: 0,
    SWIM : 0,
    ATTACK: 1,
    JUMP: 1,
    STOP: 1
}
