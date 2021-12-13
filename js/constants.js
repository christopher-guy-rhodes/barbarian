// Dimensions
const SCREEN_HEIGHT = 800;
const SCREEN_WIDTH = 1400;
const SCREEN_BOTTOM = 12;


// How long does it take to advance the screen?
const ADVANCE_SCREEN_DURATION_SECONDS = 1;
const ADVANCE_SCREEN_PIXELS_PER_SECOND = SCREEN_WIDTH / ADVANCE_SCREEN_DURATION_SECONDS;
const ADVANCE_SCREEN_VERTICAL_PIXELS_PER_SECOND = SCREEN_HEIGHT / ADVANCE_SCREEN_DURATION_SECONDS;
// How many pixels are moved in a single frame. Higher values make for a smoother scroll but if the value is too high
// the overhead of the animation and sleep in the loop will cause the screen scroll to be out of sync with the sprite
// that is scrolling simultaneously via jquery animation which is more efficient
const ADVANCE_SCREEN_PIXELS_PER_FRAME = 25;

// labels
const OBSTACLE_PIT_LABEL = 'PIT';
const OBSTACLE_NONE_LABEL = 'NONE';
const ELEVATION_LABEL = 'elevation';
const MIN_LABEL = 'min';
const MAX_LABEL = 'max';
const OPPONENTS_LABEL = 'opponents';
const WATER_LABEL = 'water';
const BOTTOM_LABEL = 'bottom';
const ACTION_LABEL = 'action';
const DIRECTION_LABEL = 'direction';
const SPRITE_LABEL = 'sprite';
const FRAMES_LABEL = 'frames';
const HEIGHT_OFFSET_LABEL = 'heightOffset';
const FRAMES_PER_SECOND_LABEL = 'framesPerSecond';
const STATUS_LABEL = 'status';
const TIME_LABEL = 'time';
const TURNAROUND_LABEL = 'turnaround';
const VERTICAL_LABEL = 'y';
const HORIZONTAL_LABEL = 'x';

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
const CSS_HEIGHT_LABEL = 'height';
const CSS_WIDTH_LABEL = 'width';
const CSS_FILTER_LABEL = 'filter';
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
