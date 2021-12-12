const SHARK_CHARACTER_TYPE = 'SHARK';
const MONSTER_CHARACTER_TYPE = 'MONSTER';
const ROCK_CHARACTER_TYPE = 'ROCK';
const DOG_CHARACTER_TYPE = 'DOG';
const BARBARIAN_CHARACTER_TYPE = 'BARBARIAN';


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

let barbarianCharacter = new CharacterBuilder(undefined, obstacles)
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
        .withCanHighlight(false)
        .withDefaultStatus(ALIVE_LABEL)
        .withDefaultAction(STOP_LABEL)
        .withDefaultDirection(RIGHT_LABEL)
        .withDefaultBottom(2, 160)
        .withDefaultBottom(3, 600)
        .withActionNumberOfTimes(ATTACK_LABEL, 1)
        .withDeathSprite($('.barbarian'))
        .withPixelsPerSecond(ATTACK_LABEL, 0)
        .build())
    .withAction(STOP_LABEL)
    //.withScreenNumber(3)
    .withHorizontalDirection(RIGHT_LABEL)
    .build();

let sharkFrames = new FramesBuilder()
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

let monsterFrames = new FramesBuilder()
    .withFrames('walk', 'left', [13, 12, 11, 10, 9, 8], 1)
    .withFrames('walk', 'right', [0, 1, 2, 3, 4, 5], 0)
    .withFrames('attack', 'left', [31, 30, 29, 28, 27, 26, 25, 24], 3)
    .withFrames('attack', 'right', [16, 17 , 18, 19, 20, 21, 23, 23], 2)
    .withFrames('death', 'left', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 0)
    .withFrames('death', 'right', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 0)
    .build();

const GAME_BOARD = new GameBoardBuilder()
    .withOpponents(0, [barbarianCharacter,
        new CharacterBuilder(barbarianCharacter, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.monster'), MONSTER_CHARACTER_TYPE, 850)
                .withFrames(monsterFrames)
                .withSound(sounds.getMonsterSound())
                .withFramesPerSecond(ATTACK_LABEL, 7.5)
                .build())
            .build()])
    .withOpponents(1, [barbarianCharacter,
        new CharacterBuilder(barbarianCharacter, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.dog'), DOG_CHARACTER_TYPE, 1050)
                .withFrames(new FramesBuilder()
                    .withFrames('sit', 'left', [3, 2, 1, 0], 1)
                    .withFrames('sit', 'right', [0, 1, 2, 3], 0)
                    .withFrames('attack', 'left', [4, 3, 2, 1, 0], 3)
                    .withFrames('attack', 'right', [0, 1, 2, 3, 4], 2)
                    .withFrames('walk', 'left', [4, 3, 2, 1, 0], 3)
                    .withFrames('walk', 'right', [0, 1, 2, 3, 4], 2)
                    .withFrames('death', 'left', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 0)
                    .withFrames('death', 'right', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 0)
                    .build())
                .withSound(sounds.getGrowlSound())
                .withDefaultAction(SIT_LABEL)
                .withDefaultBottom(1, 160)
                .withFramesPerSecond(ATTACK_LABEL, 7.5)
                .build())
            .withAction(SIT_LABEL)
            .withScreenNumber(1).build()])
    .withOpponents(2, [barbarianCharacter,
        new CharacterBuilder(barbarianCharacter, obstacles)
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
        new CharacterBuilder(barbarianCharacter, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.red_monster'), MONSTER_CHARACTER_TYPE, 500)
                .withFrames(monsterFrames)
                .withSound(sounds.getMonsterSound())
                .withFramesPerSecond(ATTACK_LABEL, 7.5)
                .build())
            // Don't allow barbarian to kill the invincible monster
            .withScreenNumber(2).build()])
    .withOpponents(3, [barbarianCharacter,
        new CharacterBuilder(barbarianCharacter, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.shark1'), SHARK_CHARACTER_TYPE, 0)
                .withFrames(sharkFrames)
                .withSound(sounds.getSplashSound())
                .withCanLeaveBehind(true)
                .withIsInvincible(true)
                .withDefaultAction(SWIM_LABEL)
                .withDefaultBottom(3, 0)
                .withFramesPerSecond(ATTACK_LABEL, 10)
                .withFramesPerSecond(SWIM_LABEL, 10)
                .withPixelsPerSecond(ATTACK_LABEL, 1.4 * DEFAULT_PIXELS_PER_SECOND)
                .build())
            .withScreenNumber(3).build(),
        new CharacterBuilder(barbarianCharacter, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.shark2'), SHARK_CHARACTER_TYPE, 1400)
                .withFrames(sharkFrames)
                .withCanLeaveBehind(true)
                .withIsInvincible(true)
                .withDefaultAction(SWIM_LABEL)
                .withDefaultBottom(3, 700)
                .withFramesPerSecond(ATTACK_LABEL, 10)
                .withFramesPerSecond(SWIM_LABEL, 10)
                .withPixelsPerSecond(ATTACK_LABEL, 1.3 * DEFAULT_PIXELS_PER_SECOND)
                .build())
            .withScreenNumber(3).build(),
        new CharacterBuilder(barbarianCharacter, obstacles)
            .withProperties(new CharacterPropertiesBuilder($('.shark3'), SHARK_CHARACTER_TYPE, 1400)
                .withFrames(sharkFrames)
                .withCanLeaveBehind(true)
                .withIsInvincible(true)
                .withDefaultAction(SWIM_LABEL)
                .withDefaultBottom(3, 0)
                .withFramesPerSecond(ATTACK_LABEL, 10)
                .withFramesPerSecond(SWIM_LABEL, 10)
                .withPixelsPerSecond(ATTACK_LABEL, 1.2 * DEFAULT_PIXELS_PER_SECOND)
                .build())
            .withScreenNumber(3).build()])
    .withWater(3).build();

let game = new Game(barbarianCharacter, GAME_BOARD);
let events = new Events(game);

