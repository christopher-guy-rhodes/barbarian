// The speed of the sprite movement in frames per second
var SPRITE_FPS = 5;
var BOG_MONSTER_SPRITE_FPS = 5;
// The speed that a sprite moves
var SPRITE_PIXELS_PER_SECOND = 150;
var BOG_MONSTER_PIXELS_PER_SECOND = 150;
// The number of grid columns for the sprite
var GRID_COLUMNS = 8;

// The multipler for the speed increase when running
var RUN_SPEED_INCREASE_FACTOR = 1.5;

// The amount of time to throttle rapid diretion changes
var KEYPRESS_THROTTLE_DELAY = 200;

// Stopping sprite horizontal and vertical offsets
var STOP_RIGHT_POSITION = 0;
var STOP_LEFT_POSITION = 6;
var STOP_RIGHT_HEIGHT_OFFSET = 0;
var STOP_LEFT_HEIGHT_OFFSET = 1;

// label names
var ACTION = 'ACTION';
var DIRECTION = 'DIRECTION';
var SPRITE = 'SPRITE';
var FRAMES = 'FRAMES';
var ANIMATION = 'ANIMATION';
var NAME = 'NAME';
var HEIGHT_OFFSET = 'HEIGHT_OFFSET';
var FPS = 'FPS';
var PIXELS_PER_SECOND = 'PIXELS_PER_SECOND';
var STATUS = 'STATUS';
var ALIVE = 'ALIVE';
var DEAD = 'DEAD';
var ATTACK_THRESHOLDS = 'ATTACK_THRESHOLDS';
var TURNAROUND = 'TURNAROUND';
var HEADON = 'HEADON';
var MIN = 'MIN';
var MAX = 'MAX';
var DELAY = 'DELAY';

// Actions
var STOP = 'STOP';
var RUN = 'RUN';
var ATTACK = 'ATTACK';
var JUMP = 'JUMP';
var WALK = 'WALK';
var HAS_MOVING_ATTACK = 'HAS_MOVING_ATTACK';
var DEATH = 'DEATH';
var ATTACK_PROXIMITY = 300;

// Directions
var LEFT = 'LEFT';
var RIGHT = 'RIGHT';
var UP = 'UP';

// Keypresses
var KP_LEFT = 'KP_LEFT';
var KP_RIGHT = 'KP_RIGHT';
var KP_RUN = 'KP_RUN';
var KP_JUMP = 'KP_JUMP';
var KP_STOP = 'KP_STOP';
var KP_ATTACK = 'KP_ATTACK';
var POSITIONS = 'POSITIONS';

// Sprites
var BARBARIAN_SPRITE_NAME = 'BARBARIAN';
var MONSTER_SPRITE_NAME = 'MONSTER';
var DEATH_SPRITE_NAME = 'DEATH';

// Animation sequences
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

var BARBARIAN_DEATH_FRAMES = {
    RIGHT : {
        FRAMES: [96, 97, 98, 99, 100],
        HEIGHT_OFFSET: 12
    },
    LEFT : {
        FRAMES : [108, 107, 106, 105, 104],
        HEIGHT_OFFSET: 13
    },
    FPS : SPRITE_FPS
}

var BOG_MONSTER_WALK_FRAMES = {
    LEFT : {
        FRAMES: [13, 12, 11, 10, 9, 8],
        HEIGHT_OFFSET: 1
    },
    RIGHT : {
        FRAMES: [0, 1, 2, 3, 4, 5],
        HEIGHT_OFFSET: 0
    }
};

var BOG_MONSTER_ATTACK_FRAMES = {
    LEFT : {
        FRAMES: [31, 30, 29, 28, 27, 26, 25, 24],
        HEIGHT_OFFSET: 3
    },
    RIGHT : {
        FRAMES: [16, 17 , 18, 19, 20, 21, 23, 23],
        HEIGHT_OFFSET: 2
    }
}

var BARBARIAN_ATTACK_FRAMES = {
    LEFT : {
        FRAMES : [47, 46, 45, 44, 43, 42, 41, 40],
        HEIGHT_OFFSET : 5},
    RIGHT : {
        FRAMES :  [32, 33, 34, 35, 36, 37, 38, 39],
        HEIGHT_OFFSET : 4}};

var BARBARIAN_JUMP_FRAMES = {
    LEFT : {
        FRAMES : [62, 61, 60, 59, 58, 57, 56 ],
        HEIGHT_OFFSET : 7},
    RIGHT : {
        FRAMES :  [48, 49, 50, 51, 52, 53, 54],
        HEIGHT_OFFSET : 6}};

var BARBARIAN_RUN_FRAMES = {
    LEFT : {
        FRAMES : [24, 25, 26, 27, 28, 29],
        HEIGHT_OFFSET : 3},
    RIGHT : {
        FRAMES : [16, 17, 18, 19, 20, 21],
        HEIGHT_OFFSET : 2}};

var BARBARIAN_WALK_FRAMES = {
    LEFT : {
        FRAMES :  [13, 12, 11, 10, 9, 8],
        HEIGHT_OFFSET : 1},
    RIGHT : {
        FRAMES : [1, 2, 3, 4, 5, 6],
        HEIGHT_OFFSET : 0}};

// Keypress event names
var KEYPRESS = {
    KP_LEFT   : 37,
    KP_RIGHT  : 39,
    KP_ATTACK : 65,
    KP_RUN    : 82,
    KP_STOP   : 83,
    KP_JUMP   : 74
};


