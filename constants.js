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
STOP_RIGHT = 'STOP_RIGHT';
var STOP_LEFT = 'STOP_LEFT';
var RUN_LEFT = 'RUN_LEFT';
var RUN_RIGHT = 'RUN_RIGHT';
var ATTACK_RIGHT = 'ATTACK_RIGHT';
var ATTACK_LEFT = 'ATTACK_LEFT';
var JUMP_RIGHT = 'JUMP_RIGHT';
var JUMP_LEFT = 'JUMP_LEFT';

// Keypresses
var LEFT = 'LEFT';
var RIGHT = 'RIGHT';
var RUN = 'RUN';
var JUMP = 'JUMP';
var STOP = 'STOP';
var ATTACK = 'ATTACK';
var UP = 'UP';
var DOWN = 'DOWN';
var PAUSE = 'PAUSE';

// Aggregated actions
var MOVING_RIGHT = ['RIGHT', 'RUN_RIGHT'];
var MOVING_LEFT = ['LEFT', 'RUN_LEFT'];
var FACING_RIGHT = ['RIGHT', 'RUN_RIGHT', 'ATTACK_RIGHT', 'STOP_RIGHT', 'JUMP_RIGHT'];
var FACING_LEFT = ['LEFT', 'RUN_LEFT', 'ATTACK_LEFT', 'STOP_LEFT', 'JUMP_LEFT'];
var ATTACKING = ['ATTACK_LEFT', 'ATTACK_RIGHT'];
var JUMPING = ['JUMP_LEFT', 'JUMP_RIGHT'];
var RUNNING = ['RUN_LEFT', 'RUN_RIGHT'];

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
    LEFT   : 37,
    UP     : 38,
    RIGHT  : 39,
    DOWN   : 40,
    ATTACK : 65,
    PAUSE  : 80, 
    RUN    : 82,
    STOP   : 83,
    JUMP   : 74
};


