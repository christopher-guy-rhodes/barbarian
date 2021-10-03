// Dimensions
const SCREEN_HEIGHT = 800;
const SCREEN_WIDTH = 1400;

// How long does it take to advance the screen?
const ADVANCE_SCREEN_DURATION_SECONDS = 1;
const ADVANCE_SCREEN_PIXELS_PER_SECOND = SCREEN_WIDTH / ADVANCE_SCREEN_DURATION_SECONDS;
const ADVANCE_SCREEN_VERTICAL_PIXELS_PER_SECOND = SCREEN_HEIGHT / ADVANCE_SCREEN_DURATION_SECONDS;
// How many pixels are moved in a single frame. Higher values make for a smoother scroll but if the value is too high
// the overhead of the animation and sleep in the loop will cause the screen scroll to be out of sync with the sprite
// that is scrolling simultaneously via jquery animation which is more efficient
const ADVANCE_SCREEN_PIXELS_PER_FRAME = 25;

// labels
const PIT_LABEL = 'PIT';
const ELEVATION_LABEL = 'elevation';
const MIN_LABEL = 'min';
const MAX_LABEL = 'max';
const OPPONENTS_LABEL = 'opponents';
const WATER_LABEL = 'water';

// Sounds
const THEME_SONG = 'THEME_SONG';
const GROWL_SOUND = 'GROWL_SOUND';
const MONSTER_SOUND = 'MONSTER_SOUND';
const GRUNT_SOUND = 'GRUNT_SOUND';
const SPLASH_SOUND = 'SPLASH_SOUND';
const FIRE_SOUND = 'FIRE_SOUND';
const FALL_SOUND = 'FALL_SOUND';

// Actions
const STOP_LABEL = 'stop';
const RUN_LABEL = 'run';
const ATTACK_LABEL = 'attack';
const JUMP_LABEL = 'jump';
const WALK_LABEL = 'walk';
const SIT_LABEL = 'sit';
const FALL_LABEL = 'fall';
const SWIM_LABEL = 'swim';
const DEATH_LABEL = 'death';
const SINK_LABEL = 'sink';

// Actions that cannot be transitioned away from
const TERMINAL_ACTIONS = new Set([SINK_LABEL, DEATH_LABEL, FALL_LABEL]);

// Statuses
const ALIVE_LABEL = 'ALIVE';
const DEAD_LABEL = 'DEAD';

// Directions
const LEFT_LABEL = 'left';
const RIGHT_LABEL = 'right';
const UP_LABEL = 'up';
const DOWN_LABEL = 'down';

// CSS constants
const CSS_BLOCK_LABEL = 'block';
const CSS_NONE_LABEL = 'none';
const CSS_LEFT_LABEL = 'left';
const CSS_BOTTOM_LABEL = 'bottom';
const CSS_PX_LABEL = 'px';
const CSS_DISPLAY_LABEL = 'display';
const CSS_BACKGROUND_POSITION = 'background-position';

const CPU_ATTACK_RANGE_PIXELS = 500;
const FIGHTING_RANGE_PIXELS = 100;

const MILLISECONDS_PER_SECOND = 1000;

// Animation rates
const DEFAULT_PIXELS_PER_SECOND = 150;
const SPRITE_FPS = 5;
const SWIM_FPS = 3;
