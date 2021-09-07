// dimensions
const SCREEN_HEIGHT = 800;
const SCREEN_WIDTH = 1400;
const SCREEN_BOTTOM = 12;

const RUN_SPEED_INCREASE_FACTOR = 1.5;
const DEFAULT_DEATH_DELAY = 2000;

// How long does it take to advance the screen?
const ADVANCE_SCREEN_DURATION_SECONDS = 1;
const ADVANCE_SCREEN_PIXELS_PER_SECOND = SCREEN_WIDTH / ADVANCE_SCREEN_DURATION_SECONDS;
const ADVANCE_SCREEN_VERTICAL_PIXELS_PER_SECOND = SCREEN_HEIGHT / ADVANCE_SCREEN_DURATION_SECONDS;
// How many pixels are moved in a single frame. Higher values make for a smoother scroll but if the value is too high
// the overhead of the animation and sleep in the loop will cause the screen scroll to be out of sync with the sprite
// that is scrolling simultaneously via jquery animation which is more efficient
const ADVANCE_SCREEN_PIXELS_PER_FRAME = 25;

// labels
const ELEMENT = 'element';
const RESET = 'reset';
const BOTTOM = 'bottom';
const OBSTACLE_TYPE = 'obstacleType';
const PIT = 'PIT';
const ELEVATION = 'elevation';
const FAIL_ACTION = 'failAction';
const HEIGHT = 'height';
const ACTION = 'action';
const DIRECTION = 'direction';
const VERTICAL_DIRECTION = 'VERTICAL_DIRECTION';
const SPRITE = 'sprite';
const FRAMES = 'frames';
const NAME = 'NAME';
const HEIGHT_OFFSET = 'heightOffset';
const FPS = 'FPS';
const PIXELS_PER_SECOND = 'PIXELS_PER_SECOND';
const FRAMES_PER_SECOND = 'framesPerSecond';
const STATUS = 'status';
const ALIVE = 'ALIVE';
const DEAD = 'DEAD';
const ATTACK_THRESHOLDS = 'ATTACK_THRESHOLDS';
const JUMP_THRESHOLDS = 'jumpThresholds';
const BARBARIAN_ATTACK_THRESHOLDS = 'BARBARIAN_ATTACK_THRESHOLDS';
const MIN = 'min';
const MAX = 'max';
const DELAY = 'delay';
const FALL_DELAY = 'fallDelay';
const OBSTACLES = 'obstacles';
const OPPONENTS = 'opponents';
const SOUND = 'SOUND';
const TRAP_DOORS = 'trapDoors';
const TRIGGER = 'trigger';
const TIME = 'time';
const NUMBER_OF_TIMES = 'numberOfTimes';
const TURNAROUND = 'turnaround';
const CAN_ELEVATE = 'CAN_ELEVATE';
const CAN_HIGHLIGHT = 'CAN_HIGHLIGHT';
const WATER = 'water';
const ALLOWED_SCROLL_DIRECTIONS = 'allowedScrollDirections';

const THEME_SONG = 'THEME_SONG';
const GROWL_SOUND = 'GROWL_SOUND';
const MONSTER_SOUND = 'MONSTER_SOUND';
const GRUNT_SOUND = 'GRUNT_SOUND';
const SPLASH_SOUND = 'SPLASH_SOUND';
const FIRE_SOUND = 'FIRE_SOUND';
const FALL_SOUND = 'FALL_SOUND';

const STOP = 'stop';
const RUN = 'run';
const ATTACK = 'attack';
const JUMP = 'jump';
const WALK = 'walk';
const DEATH = 'death';
const SIT = 'sit';
const FALL = 'fall';
const SWIM = 'swim';

const LEFT = 'left';
const RIGHT = 'right';
const UP = 'up';
const DOWN = 'down';

const BARBARIAN_SPRITE_NAME = 'BARBARIAN';
const DOG_SPRITE_NAME = 'DOG';
const CHARACTER_TYPE = 'CHARACTER_TYPE';
const SHARK_CHARACTER_TYPE = 'SHARK';
const MONSTER_CHARACTER_TYPE = 'MONSTER';
const ROCK_CHARACTER_TYPE = 'ROCK';
const DOG_CHARACTER_TYPE = 'DOG';
const BARBARIAN_CHARACTER_TYPE = 'BARBARIAN';

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
const KP_UP = 'KP_UP';
const KP_DOWN = 'KP_DOWN';

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
    KP_SOUND    : 88,
    KP_UP       : 38,
    KP_DOWN     : 40,
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

const HIGHLIGHT_BUFFER = 250;
const MILLISECONDS_PER_SECOND = 1000;
const PASSING_MULTIPLIER = 1.5;
const JUST_DIED_THRESHOLD = 500;
const TOGGLE_MESSAGE_TIME = 3000;
const ATTACK_PROXIMITY = 320;
const ATTACK_PROXIMITY_WATER = 200;
const OBSTACLE_CLOSE_PROXIMITY = 50;

const SOUNDS = {
    THEME_SONG : isSoundOn ? new Audio('/sounds/theme.mp3') : undefined,
    FALL_SOUND : isSoundOn ? new Audio('/sounds/fall.mp3') : undefined,
    GRUNT_SOUND : isSoundOn ? new Audio('/sounds/grunt.mp3') : undefined,
    GROWL_SOUND : isSoundOn ? new Audio('/sounds/growl.mp3') : undefined,
    FIRE_SOUND : isSoundOn ? new Audio('/sounds/fire.mp3') : undefined,
    MONSTER_SOUND : isSoundOn ? new Audio('/sounds/monster.mp3') : undefined,
    SPLASH_SOUND : isSoundOn ? new Audio('/sounds/splash.mp3') : undefined
};

const SPRITE_FPS = 5;
const SWIM_FPS = 3;
const BOG_MONSTER_SPRITE_FPS = 5;
const DOG_SPRITE_FPS = 5;
const DOG_PIXELS_PER_SECOND = 150;
const DEFAULT_PIXELS_PER_SECOND = 150;
const STOP_RIGHT_POSITION = 0;
const STOP_LEFT_POSITION = 6;
const STOP_RIGHT_HEIGHT_OFFSET = 0;
const STOP_LEFT_HEIGHT_OFFSET = 1;
