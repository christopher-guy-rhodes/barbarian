// dimensions
var SCREEN_HEIGHT = 800;
var SCREEN_WIDTH = 1400;

var RUN_SPEED_INCREASE_FACTOR = 1.5;
var DEFAULT_DEATH_DELAY = 2000;

var ADVANCE_SCREEN_SCROLL_DURATION = 1000;
var ADVANCE_SCREEN_PIXELS_PER_SECOND = 1500;
var ADVANCE_SCREEN_PIXELS_PER_FRAME = 10;

// labels
var OBSTACLE_TYPE = 'OBSTACLE_TYPE';
var PIT = 'PIT';
var ELEVATION = 'ELEVATION';
var FAIL_ACTION = 'FAIL_ACTION';
var JUMP_RANGE = 'JUMP_RANGE';
var TIMESTAMP = 'TIMESTAMP';
var STEP = 'STEP';
var FALL = 'FALL';
var HEIGHT = 'HEIGHT';
var CONSEQUENCE = 'CONSEQUENCE';
var STOP_POSITION = 'STOP_POSITION';
var RIGHT_HEIGHT = 'RIGHT_HEIGHT';
var LEFT_HEIGHT = 'LEFT_HEIGHT';
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
var BARBARIAN_ATTACK_THRESHOLDS = 'BARBARIAN_ATTACK_THRESHOLDS';
var TURNAROUND = 'TURNAROUND';
var MIN = 'MIN';
var MAX = 'MAX';
var DELAY = 'DELAY';
var OBSTACLES = 'OBSTACLES';
var OPPONENTS = 'OPPONENTS';
var DEATH_TIME = 'DEATH_TIME';

// Actions
var STOP = 'STOP';
var RUN = 'RUN';
var ATTACK = 'ATTACK';
var JUMP = 'JUMP';
var WALK = 'WALK';
var HAS_MOVING_ATTACK = 'HAS_MOVING_ATTACK';
var DEATH = 'DEATH';
var SIT = 'SIT';
var ATTACK_PROXIMITY = 320;

// Directions
var LEFT = 'LEFT';
var RIGHT = 'RIGHT';

// Sprites
var BARBARIAN_SPRITE_NAME = 'BARBARIAN';
var MONSTER_SPRITE_NAME = 'MONSTER';
var DOG_SPRITE_NAME = 'DOG';

// Keypress events
var KEYPRESS_THROTTLE_DELAY = 200;
var KP_LEFT = 'KP_LEFT';
var KP_RIGHT = 'KP_RIGHT';
var KP_RUN = 'KP_RUN';
var KP_JUMP = 'KP_JUMP';
var KP_STOP = 'KP_STOP';
var KP_ATTACK = 'KP_ATTACK';
var KP_PAUSE = 'KP_PAUSE';
var KP_SPACE = 'KP_SPACE';
var KP_CONTROLS = 'KP_CONTROLS';
var KP_MAIN = 'KP_MAIN';
var KP_HINTS = 'KP_HINTS';
var KP_SOUND = 'KP_SOUND';

// Keypress event names
var KEYPRESS = {
    KP_LEFT     : 37,
    KP_RIGHT    : 39,
    KP_ATTACK   : 65,
    KP_RUN      : 82,
    KP_STOP     : 83,
    KP_JUMP     : 74,
    KP_PAUSE    : 80,
    KP_SPACE    : 32,
    KP_CONTROLS : 67,
    KP_MAIN     : 77,
    KP_HINTS    : 72,
    KP_SOUND    : 88
};

// Messages
var CONTROL_MESSAGE = $('.controls_message');
var START_MESSAGE = $('.start_message');
var GAME_OVER_MESSAGE = $('.game_over');
var DEMO_OVER_MESSAGE = $('.demo_over_message');

var MESSAGES = [CONTROL_MESSAGE, START_MESSAGE, GAME_OVER_MESSAGE, DEMO_OVER_MESSAGE];

// Elements
var BRIDGE = $('.bridge');
var BACKDROP = $('.backdrop');
var GAME_OVER_MESSAGE = $('.game_over');
var DEMO_OVER_MESSAGE = $('.demo_over_message');
var START_MESSAGE = $('.start_message');
var CONTROL_MESSAGE = $('.controls_message');
var SOUND_ON_MESSAGE = $('.sound_message_on');
var SOUND_OFF_MESSAGE = $('.sound_message_off');
var HINTS_ON_MESSAGE = $('.hints_message_on');
var HINTS_OFF_MESSAGE = $('.hints_message_off');
var PAUSE_MESSAGE = $('.pause_message');
var LIFE1 = $('.life1');
var LIFE2 = $('.life2');
