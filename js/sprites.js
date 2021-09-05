const BARBARIAN_FRAMES = {
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
    }
};

const DOG_FRAMES = {
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
};

let MONSTER_FRAMES = {
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
};

let ROCK_FRAMES = {
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
};

const SHARK_FRAMES = {
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
            FRAMES: [17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
                11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
                11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
                11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
                11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
            HEIGHT_OFFSET: 1
        },
        RIGHT: {
            FRAMES: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
            HEIGHT_OFFSET: 0
        }
    },
};

const BARBARIAN_DEATH_FRAMES = {
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
};

let BARBARIAN_CHARACTER = new CharacterBuilder(BARBARIAN_FRAMES, BARBARIAN_CHARACTER_TYPE, $('.barbarian'))
    .withAction(STOP)
    .withName(BARBARIAN_SPRITE_NAME)
    .withDirection(RIGHT)
    .withCanHighlight(false)
    .withDeathSprite($('.barbarian'))
    .withPixelsPerSecond(ATTACK, 0)
    .withResetAction(STOP)
    .withResetDirection(RIGHT)
    .withResetLeft(0)
    .withResetStatus(ALIVE)
    .withDeathFrames(BARBARIAN_DEATH_FRAMES)
    .withResetBottom(2, 160)
    .withResetBottom(3, 600).build();

let DOG_CHARACTER = new CharacterBuilder(DOG_FRAMES, DOG_CHARACTER_TYPE, $('.dog'))
    .withAction(SIT)
    .withFps(ATTACK, 7.5)
    .withResetAction(SIT)
    .withResetBottom(1, 160)
    .withSound(GROWL_SOUND).build();

let MONSTER_INVINCIBLE_CHARACTER =
    new CharacterBuilder(MONSTER_FRAMES, MONSTER_CHARACTER_TYPE, $('.monster_invincible'))
        .withMinJumpThreshold(-25)
        .withMaxJumpThreshold(126)
        // Don't allow barbarian to kill the invincible monster
        .withMinBarbarianAttackThreshold(0)
        .withMaxBarbarianAttackThreshold(0)
        .withFps(ATTACK, 7.5)
        .withSound(MONSTER_SOUND).build();

let MONSTER_CHARACTER = new CharacterBuilder(MONSTER_FRAMES, MONSTER_CHARACTER_TYPE, $('.monster'))
    .withMinJumpThreshold(-10)
    .withMaxJumpThreshold(110)
    .withFps(ATTACK, 7.5)
    .withSound(MONSTER_SOUND).build();

let ROCK_CHARACTER = new CharacterBuilder(ROCK_FRAMES, ROCK_CHARACTER_TYPE, $('.rock'))
    .withAction(SIT)
    .withCanElevate(false)
    .withCanHighlight(false)
    .withFps(SIT, 10)
    .withFps(ATTACK, 10)
    .withFps(WALK, 10)
    .withPixelsPerSecond(WALK, 200)
    .withPixelsPerSecond(ATTACK, 200)
    .withMinAttackThreshold(getProperty(MONSTER_CHARACTER, ATTACK_THRESHOLDS, MIN) - 50)
    .withMaxAttackThreshold(getProperty(MONSTER_CHARACTER, ATTACK_THRESHOLDS, MAX) + 50)
    // Don't allow jump evade of rock
    .withMinJumpThreshold(0)
    .withMaxJumpThreshold(0)
    // Don't allow barbarian to kill rock
    .withMinBarbarianAttackThreshold(0)
    .withMaxBarbarianAttackThreshold(0)
    .withResetAction(SIT)
    .withResetLeft(1270)
    .withResetTurnaround(false).build();

let SHARK_CHARACTER1 = new CharacterBuilder(SHARK_FRAMES, SHARK_CHARACTER_TYPE, $('.shark1'))
    .withFps(ATTACK, 10)
    .withFps(WALK, 10)
    .withSound(SPLASH_SOUND)
    .withResetBottom(3, 0)
    .withResetLeft(0).build();

let SHARK_CHARACTER2 = new CharacterBuilder(SHARK_FRAMES, SHARK_CHARACTER_TYPE, $('.shark2'))
    .withFps(ATTACK, 10)
    .withFps(WALK, 10)
    .withSound(SPLASH_SOUND)
    .withResetBottom(3, 0)
    .withResetLeft(1400).build();

let SHARK_CHARACTER3 = new CharacterBuilder(SHARK_FRAMES, SHARK_CHARACTER_TYPE, $('.shark3'))
    .withFps(ATTACK, 10)
    .withFps(WALK, 10)
    .withSound(SPLASH_SOUND)
    .withResetBottom(3, 800)
    .withResetLeft(1400).build();

let SHARK_CHARACTER4 = new CharacterBuilder(SHARK_FRAMES, SHARK_CHARACTER_TYPE, $('.shark4'))
    .withFps(ATTACK, 10)
    .withFps(WALK, 10)
    .withSound(SPLASH_SOUND)
    .withResetBottom(3, 400)
    .withResetLeft(0).build();


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
