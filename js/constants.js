// dimensions
const SCREEN_HEIGHT = 800;
const SCREEN_WIDTH = 1400;

const RUN_SPEED_INCREASE_FACTOR = 1.5;
const DEFAULT_DEATH_DELAY = 2000;

// How long does it take to advance the screen?
const ADVANCE_SCREEN_DURATION_SECONDS = 1;
const ADVANCE_SCREEN_PIXELS_PER_SECOND = SCREEN_WIDTH / ADVANCE_SCREEN_DURATION_SECONDS;
// How many pixels are moved in a single frame. Higher values make for a smoother scroll but if the value is too high
// the overhead of the animation and sleep in the loop will cause the screen scroll to be out of sync with the sprite
// that is scrolling simultaneously via jquery animation which is more efficient
const ADVANCE_SCREEN_PIXELS_PER_FRAME = 25;

// labels
const ELEMENT = 'ELEMENT';
const RESET = 'RESET';
const BOTTOM = 'BOTTOM';
const DISPLAY = 'DISPLAY';
const OBSTACLE_TYPE = 'OBSTACLE_TYPE';
const PIT = 'PIT';
const ELEVATION = 'ELEVATION';
const FAIL_ACTION = 'FAIL_ACTION';
const JUMP_RANGE = 'JUMP_RANGE';
const FALL = 'FALL';
const HEIGHT = 'HEIGHT';
const STOP_POSITION = 'STOP_POSITION';
const RIGHT_HEIGHT = 'RIGHT_HEIGHT';
const LEFT_HEIGHT = 'LEFT_HEIGHT';
const ACTION = 'ACTION';
const DIRECTION = 'DIRECTION';
const SPRITE = 'SPRITE';
const FRAMES = 'FRAMES';
const NAME = 'NAME';
const HEIGHT_OFFSET = 'HEIGHT_OFFSET';
const FPS = 'FPS';
const PIXELS_PER_SECOND = 'PIXELS_PER_SECOND';
const STATUS = 'STATUS';
const ALIVE = 'ALIVE';
const DEAD = 'DEAD';
const ATTACK_THRESHOLDS = 'ATTACK_THRESHOLDS';
const JUMP_THRESHOLDS = 'JUMP_THRESHOLDS';
const BARBARIAN_ATTACK_THRESHOLDS = 'BARBARIAN_ATTACK_THRESHOLDS';
const MIN = 'MIN';
const MAX = 'MAX';
const DELAY = 'DELAY';
const OBSTACLES = 'OBSTACLES';
const OPPONENTS = 'OPPONENTS';
const DEATH_TIME = 'DEATH_TIME';
const RESET_DISPLAY = 'RESET_DISPLAY';
const RESET_BOTTOM = 'RESET_BOTTOM';
const RESET_LEFT = 'RESET_LEFT';
const RESET_STATUS = 'RESET_STATUS';
const SOUND = 'SOUND';
const DEFAULT_ACTION = 'DEFAULT_ACTION';
const ARTIFACTS = 'ARTIFACTS';

const THEME_SONG = 'THEME_SONG';
const GROWL_SOUND = 'GROWL_SOUND';
const MONSTER_SOUND = 'MONSTER_SOUND';
const GRUNT_SOUND = 'GRUNT_SOUND';
const FIRE_SOUND = 'FIRE_SOUND';
const FALL_SOUND = 'FALL_SOUND';

const STOP = 'STOP';
const RUN = 'RUN';
const ATTACK = 'ATTACK';
const JUMP = 'JUMP';
const WALK = 'WALK';
const DEATH = 'DEATH';
const SIT = 'SIT';
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';

const BARBARIAN_SPRITE_NAME = 'BARBARIAN';
const MONSTER_SPRITE_NAME = 'MONSTER';
const DOG_SPRITE_NAME = 'DOG';

const KEYPRESS_THROTTLE_DELAY = 200;
const KP_LEFT = 'KP_LEFT';
const KP_RIGHT = 'KP_RIGHT';
const KP_RUN = 'KP_RUN';
const KP_JUMP = 'KP_JUMP';
const KP_STOP = 'KP_STOP';
const KP_ATTACK = 'KP_ATTACK';
const KP_PAUSE = 'KP_PAUSE';
const KP_SPACE = 'KP_SPACE';
const KP_CONTROLS = 'KP_CONTROLS';
const KP_MAIN = 'KP_MAIN';
const KP_HINTS = 'KP_HINTS';
const KP_SOUND = 'KP_SOUND';

// Keypress event names
const KEYPRESS = {
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
const GAME_OVER_MESSAGE = $('.game_over');
const DEMO_OVER_MESSAGE = $('.demo_over_message');
const START_MESSAGE = $('.start_message');
const CONTROL_MESSAGE = $('.controls_message');
const SOUND_ON_MESSAGE = $('.sound_message_on');
const SOUND_OFF_MESSAGE = $('.sound_message_off');
const HINTS_ON_MESSAGE = $('.hints_message_on');
const HINTS_OFF_MESSAGE = $('.hints_message_off');
const PAUSE_MESSAGE = $('.pause_message');
const MESSAGES = [CONTROL_MESSAGE, START_MESSAGE, GAME_OVER_MESSAGE, DEMO_OVER_MESSAGE];

// Elements
const BRIDGE = $('.bridge');
const BACKDROP = $('.backdrop');
const LIFE1 = $('.life1');
const LIFE2 = $('.life2');

const HIGHLIGHT_BUFFER = 150;
const MILLISECONDS_PER_SECOND = 1000;
const PASSING_MULTIPLIER = 1.5;
const JUST_DIED_THRESHOLD = 500;
const TOGGLE_MESSAGE_TIME = 3000;
const ATTACK_PROXIMITY = 320;

