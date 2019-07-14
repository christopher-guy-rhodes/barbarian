// The speed of the sprite movement in frames per second
var SPRITE_FPS = 5;
// The speed that a sprite moves
var SPRITE_PIXELS_PER_SECOND = 150;
// The number of grid columns for the sprite
var GRID_COLUMNS = 8;

// The multipler for the speed increase when running
var RUN_SPEED_INCREASE_FACTOR = 1.5;

// The amount of time to throttle rapid diretion changes
var DIRECTION_CHANGE_DELAY = 200;

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
var KP_UP = 'KP_UP';
var KP_DOWN = 'KP_DOWN';
var KP_PAUSE = 'KP_PAUSE';

// Animation sequences
var ATTACK_RIGHT_FRAMES = [32, 33, 34, 35, 36, 37, 38, 39];
var ATTACK_LEFT_FRAMES = [47, 46, 45, 44, 43, 42, 41, 40];
var JUMP_RIGHT_FRAMES = [48, 49, 50, 51, 52, 53, 54];
var JUMP_LEFT_FRAMES = [62, 61, 60, 59, 58, 57, 56 ];
var RUN_RIGHT_FRAMES = [16, 17, 18, 19, 20, 21];
var RUN_LEFT_FRAMES = [24, 25, 26, 27, 28, 29];

// vertical offsets
var RUN_RIGHT_OFFSET = 2;
var RUN_LEFT_OFFSET = 3;
var ATTACK_RIGHT_OFFSET = 4;
var ATTACK_LEFT_OFFSET = 5;
var JUMP_RIGHT_OFFSET = 6;
var JUMP_LEFT_OFFSET = 7;


// Keypress event names
var KEYPRESS = {
    KP_LEFT   : 37,
    KP_UP     : 38,
    KP_RIGHT  : 39,
    KP_DOWN   : 40,
    KP_ATTACK : 65,
    KP_PAUSE  : 80, 
    KP_RUN    : 82,
    KP_STOP   : 83,
    KP_JUMP   : 74
};


