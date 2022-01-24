const SHARK_CHARACTER_TYPE = 'SHARK';
const MONSTER_CHARACTER_TYPE = 'MONSTER';
const ROCK_CHARACTER_TYPE = 'ROCK';
const AXE_CHARACTER_TYPE = 'AXE';
const DOG_CHARACTER_TYPE = 'DOG';
const BARBARIAN_CHARACTER_TYPE = 'BARBARIAN';
const GUARD_CHARACTER_TYPE = 'GUARD';
const BEAST_CHARACTER_TYPE = 'BEAST';
const DRAGON_CHARACTER_TYPE = 'DRAGON';
const FIREBALL_CHARACTER_TYPE = 'FIREBALL';

const AXE_HEIGHT_VERT = 68;
const AXE_HEIGHT_CORNER = 90;

const AXE_WIDTH_VERT = 86;
const AXE_WIDTH_CORNER = 90;

const AXE_HEIGHT_VERT_OFFSET = 13;
const AXE_HEIGHT_CORNER_OFFSET = 55;

const AXE_WIDTH_CORNER_OFFSET = 55 + 30;

const BARBARIAN_BODY_TARGET = {
    height: 150,
    width: 45,
    bottomOffset: 10,
    leftOffset: $('.barbarian').width() / 2
};

const BARBARIAN_WALK_TARGETS = {
    1: BARBARIAN_BODY_TARGET, 2: BARBARIAN_BODY_TARGET, 3: BARBARIAN_BODY_TARGET,
    4: BARBARIAN_BODY_TARGET, 5: BARBARIAN_BODY_TARGET, 6: BARBARIAN_BODY_TARGET,
    8: BARBARIAN_BODY_TARGET, 9: BARBARIAN_BODY_TARGET, 10: BARBARIAN_BODY_TARGET,
    11: BARBARIAN_BODY_TARGET, 12: BARBARIAN_BODY_TARGET, 13: BARBARIAN_BODY_TARGET,
};

const BARBARIAN_RUN_TARGETS = {
    16: BARBARIAN_BODY_TARGET, 17: BARBARIAN_BODY_TARGET, 18: BARBARIAN_BODY_TARGET,
    19: BARBARIAN_BODY_TARGET, 20: BARBARIAN_BODY_TARGET, 21: BARBARIAN_BODY_TARGET,
    24: BARBARIAN_BODY_TARGET, 25: BARBARIAN_BODY_TARGET, 26: BARBARIAN_BODY_TARGET,
    27: BARBARIAN_BODY_TARGET, 28: BARBARIAN_BODY_TARGET, 29: BARBARIAN_BODY_TARGET
};

const BARBARIAN_STOP_TARGETS = {
    0: BARBARIAN_BODY_TARGET, 14: BARBARIAN_BODY_TARGET
};

const BARBARIAN_JUMP_TARGETS = {
    48 : {
        height: 150,
        width: 45,
        bottomOffset: 10,
        leftOffset: 220
    },
    49 : {
        height: 150,
        width: 45,
        bottomOffset: 10,
        leftOffset: 220
    },
    50 : {
        height: 150,
        width: 45,
        bottomOffset: 35,
        leftOffset: 160
    },
    51 : {
        height: 150,
        width: 45,
        bottomOffset: 125,
        leftOffset: 200
    },
    52 : {
        height: 150,
        width: 45,
        bottomOffset: 35,
        leftOffset: 170
    },
    53 : {
        height: 150,
        width: 45,
        bottomOffset: 20,
        leftOffset: 165
    },
    54 : {
        height: 150,
        width: 45,
        bottomOffset: 10,
        leftOffset: 220
    },
    62 : {
        height: 150,
        width: 45,
        bottomOffset: 10,
        leftOffset: 160
    },
    61 : {
        height: 150,
        width: 45,
        bottomOffset: 10,
        leftOffset: 160
    },
    60 : {
        height: 150,
        width: 45,
        bottomOffset: 140,
        leftOffset: 20
    },
    59 : {
        height: 150,
        width: 45,
        bottomOffset: 10,
        leftOffset: 175
    },
    58 : {
        height: 150,
        width: 45,
        bottomOffset: 10,
        leftOffset: 205
    },
    57 : {
        height: 150,
        width: 45,
        bottomOffset: 10,
        leftOffset: 200
    },
    56 : {
        height: 150,
        width: 45,
        bottomOffset: 10,
        leftOffset: 160
    },
};

function getAxeFrameTargets(selector) {
    return {
        6 : {
            attack: {
                3: {
                    height: AXE_HEIGHT_CORNER,
                    width: AXE_WIDTH_CORNER,
                    bottomOffset: AXE_HEIGHT_CORNER_OFFSET,
                    leftOffset: AXE_WIDTH_CORNER_OFFSET,
                },
                4: {
                    height: AXE_HEIGHT_VERT,
                    width: AXE_WIDTH_VERT,
                    bottomOffset: AXE_HEIGHT_VERT_OFFSET,
                    leftOffset: selector.width() / 2 - AXE_WIDTH_VERT / 2
                },
                5: {
                    height: AXE_HEIGHT_CORNER,
                    width: AXE_WIDTH_CORNER,
                    bottomOffset: AXE_HEIGHT_CORNER_OFFSET,
                    leftOffset: selector.width() - AXE_WIDTH_CORNER - AXE_WIDTH_CORNER_OFFSET
                }
            }
        },
        7 : {
            attack: {
                0: {
                    height: AXE_HEIGHT_VERT,
                    width: AXE_WIDTH_VERT,
                    bottomOffset: selector.height() - AXE_HEIGHT_VERT_OFFSET - AXE_HEIGHT_VERT,
                    leftOffset: selector.width() / 2 - AXE_WIDTH_VERT / 2
                },
                1: {
                    height: AXE_HEIGHT_CORNER,
                    width: AXE_WIDTH_CORNER,
                    bottomOffset: selector.height() - AXE_HEIGHT_CORNER - AXE_HEIGHT_CORNER_OFFSET,
                    leftOffset: AXE_WIDTH_CORNER_OFFSET
                },
                7: {
                    height: AXE_HEIGHT_CORNER,
                    width: AXE_WIDTH_CORNER,
                    bottomOffset: selector.height() - AXE_HEIGHT_CORNER - AXE_HEIGHT_CORNER_OFFSET,
                    leftOffset: selector.width() - AXE_WIDTH_CORNER - AXE_WIDTH_CORNER_OFFSET
                }
            },
        }
    }
}

// TODO: the right x positions must be sorted in asc order and the left in desc, don't rely on the client to do the sorting
let obstacles = new ObstaclesBuilder()
    .withObstacle(1, RIGHT_LABEL,
        new Obstacle(50, 82, ELEVATION_LABEL, STOP_LABEL, -100, 200))
    .withObstacle(1, RIGHT_LABEL,
        new Obstacle(400, 160, ELEVATION_LABEL, STOP_LABEL, 350, 430))
    .withObstacle(1, RIGHT_LABEL,
        new Obstacle(800, 160, OBSTACLE_PIT_LABEL, FALL_LABEL, 710, 830))

    .withObstacle(1, LEFT_LABEL,
        new Obstacle(950, 160, OBSTACLE_PIT_LABEL, FALL_LABEL, 880, 1000))
    .withObstacle(1, LEFT_LABEL,
        new Obstacle(400, 82, ELEVATION_LABEL, STOP_LABEL))
    .withObstacle(1, LEFT_LABEL,
        new Obstacle(100, 12, ELEVATION_LABEL, STOP_LABEL))


    .withObstacle(2, RIGHT_LABEL,
        new Obstacle(125, 122, ELEVATION_LABEL, STOP_LABEL))
    .withObstacle(2, RIGHT_LABEL,
        new Obstacle(250, 74, ELEVATION_LABEL, STOP_LABEL))
    .withObstacle(2, RIGHT_LABEL,
        new Obstacle(365, 12, ELEVATION_LABEL, STOP_LABEL))

    .withObstacle(2, LEFT_LABEL,
        new Obstacle(390, 74, ELEVATION_LABEL, STOP_LABEL, 350, 390))
    .withObstacle(2, LEFT_LABEL,
        new Obstacle(290, 122, ELEVATION_LABEL, STOP_LABEL, 180, 330))
    .withObstacle(2, LEFT_LABEL,
        new Obstacle(165, 165, ELEVATION_LABEL, STOP_LABEL, 65, 215))
    .build();

let sounds = new Sounds();

const BARBARIAN_CHARACTER = new CharacterBuilder(undefined, obstacles)
    .withProperties(new CharacterPropertiesBuilder($('.barbarian'), BARBARIAN_CHARACTER_TYPE, 0)
        .withFrames(new FramesBuilder()
            .withFrames('sink', 'left', [104], 13)
            .withFrames('sink', 'right', [100], 12)
            .withFrames('attack', 'left', [7, 6, 5, 4, 3, 2, 1, 0], 5)
            .withFrames('attack', 'right', [0, 1, 2, 3, 4, 5, 6, 7], 4)
            .withFrames('jump', 'left', [62, 61, 60, 59, 58, 57, 56], 7)
            .withFrames('jump', 'right', [48, 49, 50, 51, 52, 53, 54], 6)
            .withFrames('run', 'left', [24, 25, 26, 27, 28, 29], 3)
            .withFrames('run', 'right', [16, 17, 18, 19, 20, 21], 2)
            .withFrames('walk', 'left', [13, 12, 11, 10, 9, 8], 1)
            .withFrames('walk', 'right', [1, 2, 3, 4, 5, 6], 0)
            .withFrames('swim', 'left', [3, 2, 1, 0], 17)
            .withFrames('swim', 'right', [0, 1, 2, 3], 16)
            .withFrames('fall', 'left', [3, 2, 1, 0], 15)
            .withFrames('fall', 'right', [0, 1, 2, 3], 14)
            .withFrames('stop', 'left', [14], 1)
            .withFrames('stop', 'right', [0], 0)
            .withFrames('death', 'left', [108, 107, 106, 105, 104], 13)
            .withFrames('death', 'right',[96, 97, 98, 99, 100], 12)
            .build())
        .withFrameTargets({
            6: {
                walk: BARBARIAN_WALK_TARGETS,
                run : BARBARIAN_RUN_TARGETS,
                stop : BARBARIAN_STOP_TARGETS,
                jump : BARBARIAN_JUMP_TARGETS
            },
            7: {
                walk: BARBARIAN_WALK_TARGETS,
                run : BARBARIAN_RUN_TARGETS,
                stop : BARBARIAN_STOP_TARGETS,
                jump : BARBARIAN_JUMP_TARGETS
            },
            9: {
                walk: BARBARIAN_WALK_TARGETS,
                run : BARBARIAN_RUN_TARGETS,
                stop : BARBARIAN_STOP_TARGETS,
                jump : BARBARIAN_JUMP_TARGETS
            }
        })
        .withCanHighlight(false)
        .withDefaultStatus(ALIVE_LABEL)
        .withDefaultAction(STOP_LABEL)
        .withDefaultDirection(RIGHT_LABEL)
        .withDefaultBottom(2, 160)
        .withDefaultBottom(3, 600)
        .withDefaultBottom(4, 62)
        .withDefaultBottom(5, 62)
        .withDefaultBottom(6, 62)
        .withDefaultBottom(7, 62)
        .withDefaultBottom(8, 62)
        .withDefaultBottom(9, 62)
        .withActionNumberOfTimes(ATTACK_LABEL, 1)
        .withDeathSprite($('.barbarian'))
        .withPixelsPerSecond(ATTACK_LABEL, 0)
        .build())
    .withAction(STOP_LABEL)
    //.withScreenNumber(7)
    .withHorizontalDirection(RIGHT_LABEL)
    .build();


const FIREBALL_FRAME_TARGET = {
    height: 30,
    width: 10,
    bottomOffset: 0,
    leftOffset: 0
};

const FIREBALL_CHARACTER =
    new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
        .withProperties(new CharacterPropertiesBuilder($('.fireball'), FIREBALL_CHARACTER_TYPE, 700)
            .withFrames(new FramesBuilder()
                //.withFrames('walk', 'left', [0, 1, 2], 0)
                //.withFrames('walk', 'right', [0, 1, 2], 0)
                .withFrames('attack', 'left', [0, 1, 2], 0)
                .withFrames('attack', 'right', [0, 1, 2], 0)
                .build())
            .withDefaultBottom(9, 125)
            .withDefaultAction(ATTACK_LABEL)
            .withFrameTargets({
                9 : {
                    attack : {
                        0: FIREBALL_FRAME_TARGET,
                        1: FIREBALL_FRAME_TARGET,
                        2: FIREBALL_FRAME_TARGET
                    }

                }
            })
            .withPixelsPerSecond(ATTACK_LABEL, 300)
            .withFramesPerSecond(ATTACK_LABEL, 10)
            .withCanTurnAround(false)
            .withIsInvincible(true)
            .build())
        .withScreenNumber(9).build();

const SHARK_FRAMES = new FramesBuilder()
    .withFrames('attack', 'left', [2, 1, 0], 3)
    .withFrames('attack', 'right', [0, 1, 2], 2)
    .withFrames('swim', 'left', [17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
        11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
        11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
        11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
        11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0], 1)
    .withFrames('swim', 'right', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
        6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
        6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
        6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
        6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 0)
    .build();

const DEFAULT_DEATH_RIGHT = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const DEFAULT_DEATH_LEFT =  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const MONSTER_FRAMES = new FramesBuilder()
    .withFrames('walk', 'left', [13, 12, 11, 10, 9, 8], 1)
    .withFrames('walk', 'right', [0, 1, 2, 3, 4, 5], 0)
    .withFrames('attack', 'left', [31, 30, 29, 28, 27, 26, 25, 24], 3)
    .withFrames('attack', 'right', [16, 17 , 18, 19, 20, 21, 23, 23], 2)
    .withFrames('death', 'left', DEFAULT_DEATH_LEFT, 0)
    .withFrames('death', 'right', DEFAULT_DEATH_RIGHT, 0)
    .build();

const DOG_FRAMES = new FramesBuilder()
    .withFrames('sit', 'left', [3, 2, 1, 0], 1)
    .withFrames('sit', 'right', [0, 1, 2, 3], 0)
    .withFrames('attack', 'left', [4, 3, 2, 1, 0], 3)
    .withFrames('attack', 'right', [0, 1, 2, 3, 4], 2)
    .withFrames('walk', 'left', [4, 3, 2, 1, 0], 3)
    .withFrames('walk', 'right', [0, 1, 2, 3, 4], 2)
    .withFrames('death', 'left', DEFAULT_DEATH_LEFT, 0)
    .withFrames('death', 'right', DEFAULT_DEATH_RIGHT, 0)
    .build();

const GUARD_FRAMES = new FramesBuilder()
    .withFrames('walk', 'right', [0, 1, 2, 3, 4, 5], 0)
    .withFrames('walk', 'left', [17, 16, 15, 14, 13, 12], 2)
    .withFrames('attack', 'right', [6, 7, 8], 1)
    .withFrames('attack', 'left', [20, 19, 18], 3)
    .withFrames('death', 'left', DEFAULT_DEATH_LEFT, 0)
    .withFrames('death', 'right', DEFAULT_DEATH_RIGHT, 0)
    .build();

const BEAST_FRAMES = new FramesBuilder()
    .withFrames('walk', 'right', [0, 1, 2, 3, 4], 0)
    .withFrames('walk', 'left', [14, 13, 12, 11, 10], 2)
    .withFrames('attack', 'right', [5, 6, 7], 1)
    .withFrames('attack', 'left', [17, 16, 15], 3)
    .withFrames('death', 'left', DEFAULT_DEATH_LEFT, 0)
    .withFrames('death', 'right', DEFAULT_DEATH_RIGHT, 0)
    .build();

const GAME_BOARD = new GameBoardBuilder()
    .withOpponents(0, [BARBARIAN_CHARACTER,
        new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.monster'), MONSTER_CHARACTER_TYPE, 850)
                .withFrames(MONSTER_FRAMES)
                .withSound(MONSTER_SOUND)
                .withFramesPerSecond(ATTACK_LABEL, 7.5)
                .withDeathSprite($('.death_monster'))
                .build())
            .build()])
    .withOpponents(1, [BARBARIAN_CHARACTER,
        new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.dog'), DOG_CHARACTER_TYPE, 1050)
                .withFrames(DOG_FRAMES)
                .withDeathSprite($('.death_dog'))
                .withSound(GROWL_SOUND)
                .withDefaultAction(SIT_LABEL)
                .withDefaultBottom(1, 160)
                .withFramesPerSecond(ATTACK_LABEL, 7.5)
                .build())
            .withAction(SIT_LABEL)
            .withScreenNumber(1).build()])
    .withOpponents(2, [BARBARIAN_CHARACTER,
        new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.rock'), ROCK_CHARACTER_TYPE, 1270)
                .withFrames(new FramesBuilder()
                    .withFrames('sit', 'left', [5, 4], 0)
                    .withFrames('sit', 'right', [0, 1], 0)
                    .withFrames('attack', 'left', [5, 4, 3, 2, 1, 0], 0)
                    .withFrames('attack', 'right', [0, 1, 2, 3, 4, 5], 0)
                    .withFrames('walk', 'left', [5, 4, 3, 2, 1, 0], 0)
                    .withFrames('walk', 'right', [0, 1, 2, 3, 4, 5], 0)
                    .withFrames('stop', 'left', [5], 0)
                    .withFrames('stop', 'right', [0], 0)
                    .build())
                .withSound(ROCK_SOUND)
                .withIsInvincible(true)
                .withCanHighlight(false)
                .withCanLeaveBehind(true)
                .withCanTurnAround(false)
                .withDefaultAction(SIT_LABEL)
                .withFramesPerSecond(SIT_LABEL, 10)
                .withFramesPerSecond(ATTACK_LABEL, 10)
                .withFramesPerSecond(WALK_LABEL, 10)
                .withPixelsPerSecond(WALK_LABEL, 250)
                .withPixelsPerSecond(ATTACK_LABEL, 250)
                .withCanElevate(false).build())
            .withAction(SIT_LABEL)
            .withScreenNumber(2).build(),
        new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.red_monster'), MONSTER_CHARACTER_TYPE, 500)
                .withFrames(MONSTER_FRAMES)
                .withSound(MONSTER_SOUND)
                .withFramesPerSecond(ATTACK_LABEL, 7.5)
                .withDeathSprite($('.death_red_monster'))
                .build())
            // Don't allow barbarian to kill the invincible monster
            .withScreenNumber(2).build()])
    .withOpponents(3, [BARBARIAN_CHARACTER,
        new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.shark1'), SHARK_CHARACTER_TYPE, 0)
                .withFrames(SHARK_FRAMES)
                //.withSound(SPLASH_SOUND)
                .withCanLeaveBehind(true)
                .withIsInvincible(true)
                .withDefaultAction(SWIM_LABEL)
                .withDefaultBottom(3, 0)
                .withFramesPerSecond(ATTACK_LABEL, 10)
                .withFramesPerSecond(SWIM_LABEL, 10)
                .withPixelsPerSecond(ATTACK_LABEL, 1.4 * DEFAULT_PIXELS_PER_SECOND)
                .build())
            .withScreenNumber(3).build(),
        new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.shark2'), SHARK_CHARACTER_TYPE, 1400)
                .withFrames(SHARK_FRAMES)
                .withCanLeaveBehind(true)
                .withIsInvincible(true)
                .withDefaultAction(SWIM_LABEL)
                .withDefaultBottom(3, 700)
                .withFramesPerSecond(ATTACK_LABEL, 10)
                .withFramesPerSecond(SWIM_LABEL, 10)
                .withPixelsPerSecond(ATTACK_LABEL, 1.3 * DEFAULT_PIXELS_PER_SECOND)
                .build())
            .withScreenNumber(3).build(),
        new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.shark3'), SHARK_CHARACTER_TYPE, 1400)
                .withFrames(SHARK_FRAMES)
                .withCanLeaveBehind(true)
                .withIsInvincible(true)
                .withDefaultAction(SWIM_LABEL)
                .withDefaultBottom(3, 0)
                .withFramesPerSecond(ATTACK_LABEL, 10)
                .withFramesPerSecond(SWIM_LABEL, 10)
                .withPixelsPerSecond(ATTACK_LABEL, 1.2 * DEFAULT_PIXELS_PER_SECOND)
                .build())
            .withScreenNumber(3).build()])
    .withSurface(3, WATER_SURFACE)
    .withOpponents(4, [BARBARIAN_CHARACTER,
            new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
                .withProperties(new CharacterPropertiesBuilder($('.monster'), MONSTER_CHARACTER_TYPE, 1000)
                    .withFrames(MONSTER_FRAMES)
                    .withSound(MONSTER_SOUND)
                    .withFramesPerSecond(ATTACK_LABEL, 7.5)
                    .withDefaultBottom(4, 62)
                    .withDeathSprite($('.death_monster'))
                    .build())
                .build(),
            new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
                .withProperties(new CharacterPropertiesBuilder($('.red_monster'), MONSTER_CHARACTER_TYPE, 600)
                    .withFrames(MONSTER_FRAMES)
                    .withSound(MONSTER_SOUND)
                    .withFramesPerSecond(ATTACK_LABEL, 7.5)
                    .withDefaultBottom(4, 62)
                    .withDeathSprite($('.death_red_monster'))
                    .build())
                .build(),
            new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
                .withProperties(new CharacterPropertiesBuilder($('.dog'), DOG_CHARACTER_TYPE, 400)
                    .withFrames(DOG_FRAMES)
                    .withSound(GROWL_SOUND)
                    .withDefaultAction(SIT_LABEL)
                    .withDefaultBottom(4, 62)
                    .withFramesPerSecond(ATTACK_LABEL, 7.5)
                    .withDeathSprite($('.death_dog'))
                    .build())
                .withAction(SIT_LABEL)
                .withScreenNumber(4).build()])
    .withOpponents(5, [BARBARIAN_CHARACTER,
        new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.beast'), BEAST_CHARACTER_TYPE, 700)
                .withFrames(BEAST_FRAMES)
                .withFramesPerSecond(WALK_LABEL, 3)
                .withPixelsPerSecond(WALK_LABEL, 0)
                .withFramesPerSecond(ATTACK_LABEL, 5)
                .withPixelsPerSecond(ATTACK_LABEL, 500)
                .withDeathSprite($('.death_beast'))
                .withDefaultBottom(5, 60)
                .withSound(MONSTER_SOUND)
                .build())
            .withScreenNumber(5)
            .build()])
    .withOpponents(6, [BARBARIAN_CHARACTER,
        new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.axe1'), AXE_CHARACTER_TYPE, 175)
                .withFrames(new FramesBuilder()
                    .withFrames('attack', 'left', [0, 1, 2, 3, 4, 5, 6, 7], 0)
                    .build())
                .withFrameIndexSound(3, '/sounds/swing.mp3')
                .withFrameTargets(getAxeFrameTargets($('.axe1')))
                .withIsInvincible(true)
                .withDeathSprite($('.axe1'))
                .withCanHighlight(false)
                .withCanLeaveBehind(true)
                .withCanTurnAround(false)
                .withDefaultAction(ATTACK_LABEL)
                .withFramesPerSecond(ATTACK_LABEL, 5)
                .withPixelsPerSecond(ATTACK_LABEL, 0)
                .withMaxAttackThreshold(5)
                .withCanElevate(false)
                .withDefaultBottom(6, 135)
                .build())
            .withAction(ATTACK_LABEL)
            .withScreenNumber(6).build(),
            new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
                .withProperties(new CharacterPropertiesBuilder($('.axe2'), AXE_CHARACTER_TYPE, 565)
                    .withFrames(new FramesBuilder()
                        .withFrames('attack', 'left', [2, 3, 4, 5, 6, 7, 0, 1], 0)
                        .build())
                    .withFrameIndexSound(1, '/sounds/swing.mp3')
                    .withFrameTargets(getAxeFrameTargets($('.axe2')))
                    .withIsInvincible(true)
                    .withDeathSprite($('.axe2'))
                    .withCanHighlight(false)
                    .withCanLeaveBehind(true)
                    .withCanTurnAround(false)
                    .withDefaultAction(ATTACK_LABEL)
                    .withFramesPerSecond(ATTACK_LABEL, 5)
                    .withPixelsPerSecond(ATTACK_LABEL, 0)
                    .withMaxAttackThreshold(5)
                    .withCanElevate(false)
                    .withDefaultBottom(6, 135)
                    .build())
                .withAction(ATTACK_LABEL)
                .withScreenNumber(6).build(),
            new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
                .withProperties(new CharacterPropertiesBuilder($('.axe3'), AXE_CHARACTER_TYPE, 955)
                    .withFrameIndexSound(7, '/sounds/swing.mp3')
                    .withFrames(new FramesBuilder()
                        .withFrames('attack', 'left', [4, 5, 6, 7, 0, 1, 2, 3], 0)
                        .build())
                    .withFrameTargets(getAxeFrameTargets($('.axe3')))
                    .withIsInvincible(true)
                    .withDeathSprite($('.axe3'))
                    .withCanHighlight(false)
                    .withCanLeaveBehind(true)
                    .withCanTurnAround(false)
                    .withDefaultAction(ATTACK_LABEL)
                    .withFramesPerSecond(ATTACK_LABEL, 5)
                    .withPixelsPerSecond(ATTACK_LABEL, 0)
                    .withMaxAttackThreshold(5)
                    .withCanElevate(false)
                    .withDefaultBottom(6, 135)
                    .build())
                .withAction(ATTACK_LABEL)
                .withScreenNumber(6).build()])
    .withSurface(6, ICE_SURFACE)
    .withOpponents(7, [BARBARIAN_CHARACTER,
        new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.guard1'), GUARD_CHARACTER_TYPE, 850)
                .withFrames(GUARD_FRAMES)
                .withFramesPerSecond(WALK_LABEL, 10)
                .withPixelsPerSecond(WALK_LABEL, 400)
                .withFramesPerSecond(ATTACK_LABEL, 5)
                .withPixelsPerSecond(ATTACK_LABEL, 300)
                .withDeathSprite($('.death_guard1'))
                .withDefaultBottom(7, 60)
                .build())
            .withScreenNumber(7)
            .build(),
        new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.guard2'), GUARD_CHARACTER_TYPE, 1150)
                .withFrames(GUARD_FRAMES)
                .withFramesPerSecond(WALK_LABEL, 5)
                .withPixelsPerSecond(WALK_LABEL, 150)
                .withFramesPerSecond(ATTACK_LABEL, 10)
                .withPixelsPerSecond(ATTACK_LABEL, 500)
                .withDeathSprite($('.death_guard2'))
                .withDefaultBottom(7, 60)
                .build())
            .withScreenNumber(7)
            .build(),
        new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.axe1'), AXE_CHARACTER_TYPE, 180)
                .withFrameIndexSound(0, '/sounds/swing.mp3')
                .withFrames(new FramesBuilder()
                    .withFrames('attack', 'left', [0, 1, 2, 3, 4, 5, 6, 7], 0)
                    .build())
                .withFrameTargets(getAxeFrameTargets($('.axe1')))
                .withIsInvincible(true)
                .withDeathSprite($('.axe1'))
                .withCanHighlight(false)
                .withCanLeaveBehind(true)
                .withCanTurnAround(false)
                .withDefaultAction(ATTACK_LABEL)
                .withFramesPerSecond(ATTACK_LABEL, 3)
                .withPixelsPerSecond(ATTACK_LABEL, 0)
                .withMaxAttackThreshold(5)
                .withCanElevate(false)
                .withDefaultBottom(7, -175)
                .build())
            .withAction(ATTACK_LABEL)
            .withScreenNumber(7).build()])
    .withSurface(7, ICE_SURFACE)
    .withOpponents(8, [BARBARIAN_CHARACTER,
        new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.monster'), MONSTER_CHARACTER_TYPE, 700)
                .withFrames(MONSTER_FRAMES)
                .withSound(MONSTER_SOUND)
                .withFramesPerSecond(ATTACK_LABEL, 12)
                .withPixelsPerSecond(WALK_LABEL, 200)
                .withPixelsPerSecond(ATTACK_LABEL, 250)
                .withDefaultBottom(8, 62)
                .withDeathSprite($('.death_monster'))
                .build())
            .build(),
        new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.red_monster'), MONSTER_CHARACTER_TYPE, 1000)
                .withFrames(MONSTER_FRAMES)
                .withSound(MONSTER_SOUND)
                .withFramesPerSecond(ATTACK_LABEL, 7.5)
                .withDefaultBottom(8, 62)
                .withDeathSprite($('.death_red_monster'))
                .build())
            .build(),
        new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.dog'), DOG_CHARACTER_TYPE, 1000)
                .withFrames(DOG_FRAMES)
                .withSound(GROWL_SOUND)
                .withDefaultAction(SIT_LABEL)
                .withDefaultBottom(8, 62)
                .withFramesPerSecond(ATTACK_LABEL, 7.5)
                .withPixelsPerSecond(ATTACK_LABEL, 250)
                .withDeathSprite($('.death_dog'))
                .build())
            .withAction(SIT_LABEL)
            .withScreenNumber(8).build(),
        new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.guard1'), GUARD_CHARACTER_TYPE, 850)
                .withFrames(GUARD_FRAMES)
                .withFramesPerSecond(WALK_LABEL, 10)
                .withPixelsPerSecond(WALK_LABEL, 200)
                .withFramesPerSecond(ATTACK_LABEL, 5)
                .withPixelsPerSecond(ATTACK_LABEL, 200)
                .withDeathSprite($('.death_guard1'))
                .withDefaultBottom(8, 60)
                .build())
            .withScreenNumber(8)
            .build(),
        new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.beast'), BEAST_CHARACTER_TYPE, 700)
                .withFrames(BEAST_FRAMES)
                .withFramesPerSecond(WALK_LABEL, 3)
                .withPixelsPerSecond(WALK_LABEL, 0)
                .withFramesPerSecond(ATTACK_LABEL, 5)
                .withPixelsPerSecond(ATTACK_LABEL, 500)
                .withDeathSprite($('.death_beast'))
                .withDefaultBottom(8, 60)
                .build())
            .withScreenNumber(8)
            .build()])
    .withOpponents(9, [BARBARIAN_CHARACTER, FIREBALL_CHARACTER,
        new CharacterBuilder(BARBARIAN_CHARACTER, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.dragon'), DRAGON_CHARACTER_TYPE, 750)
                .withFrames(new FramesBuilder()
                    .withFrames('sit', 'left', [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, -1, 8, 7, 6], 1)
                    .withFrames('sit', 'right', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 1, 2, 3], 0)
                    .withFrames('walk', 'left', [23, 22, 21, 20, 19, 18], 3)
                    .withFrames('walk', 'right', [12, 13, 14, 15, 16, 17], 2)
                    //.withFrames('attack', 'left', [23, 22, 21, 20, 19, 18], 3)
                    //.withFrames('attack', 'right', [12, 13, 14, 15, 16, 17], 2)
                    .withFrames('attack', 'left', [-1, 23, 22, 21, 20, 19, 18], 3)
                    .withFrames('attack', 'right', [-1, 12, 13, 14, 15, 16, 17], 2)
                    .withFrames('death', 'left', DEFAULT_DEATH_LEFT, 0)
                    .withFrames('death', 'right', DEFAULT_DEATH_RIGHT, 0)
                    .build())
                //.withPixelsPerSecond(ATTACK_LABEL, 100)
                //.withFramesPerSecond(ATTACK_LABEL, 15)
                .withPixelsPerSecond(ATTACK_LABEL, 300)
                .withCanHighlight(false)
                //.withIsInvincible(true)
                //.withSound(sounds.getGrowlSound())
                .withDefaultAction(SIT_LABEL)
                .withDefaultBottom(9, 62)
                .withDeathSprite($('.death_dragon'))
                .build())
            .withAction(SIT_LABEL)
            .withScreenNumber(9).build()])
    .build();

let game = new Game(BARBARIAN_CHARACTER, GAME_BOARD);
let events = new Events(game);

