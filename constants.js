// The speed of the sprite movement in frames per second
var SPRITE_FPS = 5;
var SPRITE_FPS_MONSTER = 10;
// The speed that a sprite moves
var SPRITE_PIXELS_PER_SECOND = 150;
var SPRITE_PIXELS_PER_SECOND_MONSTER = 300;
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

// Actions
var STOP = 'STOP';
var RUN = 'RUN';
var ATTACK = 'ATTACK';
var JUMP = 'JUMP';
var WALK = 'WALK';

// Directions
var LEFT = 'LEFT';
var RIGHT = 'RIGHT';

// Keypresses
var KP_LEFT = 'KP_LEFT';
var KP_RIGHT = 'KP_RIGHT';
var KP_RUN = 'KP_RUN';
var KP_JUMP = 'KP_JUMP';
var KP_STOP = 'KP_STOP';
var KP_ATTACK = 'KP_ATTACK';

// Sprites
var BARBARIAN_SPRITE_NAME = 'barbarian';
var MONSTER_SPRITE_NAME = 'monster';
var DEATH_SPRITE_NAME = 'death';

// Animation sequences
var DEATH_FRAMES = {
    'FRAMES' : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    'HEIGHT_OFFSET' : 0
};

var BOG_MONSTER_SPRITE_FPS = 5;

var BOG_MONSTER_WALK_FRAMES = {
    LEFT : {
        'FRAMES': [13, 12, 11, 10, 9, 8],
        'HEIGHT_OFFSET': 1
    }
}

var BOG_MONSTER_ATTACK_FRAMES = {
    LEFT : {
        'FRAMES': [31, 30, 29, 28, 27, 26, 25, 24],
        'HEIGHT_OFFSET': 3
    }
}

var BARBARIAN_ATTACK_FRAMES = {
    LEFT : {
        'FRAMES' : [47, 46, 45, 44, 43, 42, 41, 40],
        'HEIGHT_OFFSET' : 5},
    RIGHT : {
        'FRAMES' :  [32, 33, 34, 35, 36, 37, 38, 39],
        'HEIGHT_OFFSET' : 4}};

var BARBARIAN_JUMP_FRAMES = {
    LEFT : {
        'FRAMES' : [62, 61, 60, 59, 58, 57, 56 ],
        'HEIGHT_OFFSET' : 7},
    RIGHT : {
        'FRAMES' :  [48, 49, 50, 51, 52, 53, 54],
        'HEIGHT_OFFSET' : 6}};

var BARBARIAN_RUN_FRAMES = {
    LEFT : {
        'FRAMES' : [24, 25, 26, 27, 28, 29],
        'HEIGHT_OFFSET' : 3},
    RIGHT : {
        'FRAMES' : [16, 17, 18, 19, 20, 21],
        'HEIGHT_OFFSET' : 2}};

var BARBARIAN_WALK_FRAMES = {
    LEFT : {
        'FRAMES' :  [13, 12, 11, 10, 9, 8],
        'HEIGHT_OFFSET' : 1},
    RIGHT : {
        'FRAMES' : [1, 2, 3, 4, 5, 6],
        'HEIGHT_OFFSET' : 0}};

// Keypress event names
var KEYPRESS = {
    KP_LEFT   : 37,
    KP_RIGHT  : 39,
    KP_ATTACK : 65,
    KP_RUN    : 82,
    KP_STOP   : 83,
    KP_JUMP   : 74
};

BARBARIAN_SPRITE = {
    sprite : $(".barbarian"),
    name : BARBARIAN_SPRITE_NAME,
    action : STOP,
    direction : RIGHT,
    frames : {
        ATTACK : BARBARIAN_ATTACK_FRAMES,
        JUMP : BARBARIAN_JUMP_FRAMES,
        RUN : BARBARIAN_RUN_FRAMES,
        WALK : BARBARIAN_WALK_FRAMES
    }
};

MONSTER_SPRITE = {
    sprite : $(".monster"),
    name : MONSTER_SPRITE_NAME,
    action : WALK,
    direction : LEFT,
    frames : {
        WALK : BOG_MONSTER_WALK_FRAMES
    }
};

DEATH_SPRITE = {
    sprite : $(".death"),
    name : DEATH_SPRITE_NAME
}

