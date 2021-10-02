const SHARK_CHARACTER_TYPE = 'SHARK';
const MONSTER_CHARACTER_TYPE = 'MONSTER';
const ROCK_CHARACTER_TYPE = 'ROCK';
const DOG_CHARACTER_TYPE = 'DOG';
const BARBARIAN_CHARACTER_TYPE = 'BARBARIAN';

const BARBARIAN_FRAMES = {
        attack : {
                left : {
                        frames : [7, 6, 5, 4, 3, 2, 1, 0],
                        heightOffset : 5},
                right : {
                        frames :  [0, 1, 2, 3, 4, 5, 6, 7],
                        heightOffset : 4}},
        jump : {
                left : {
                        frames : [62, 61, 60, 59, 58, 57, 56 ],
                        heightOffset : 7},
                right : {
                        frames :  [48, 49, 50, 51, 52, 53, 54],
                        heightOffset : 6}},
        run : {
                left : {
                        frames : [24, 25, 26, 27, 28, 29],
                        heightOffset : 3},
                right : {
                        frames : [16, 17, 18, 19, 20, 21],
                        heightOffset : 2}},
        walk : {
                left : {
                        frames :  [13, 12, 11, 10, 9, 8],
                        heightOffset : 1},
                right : {
                        frames : [1, 2, 3, 4, 5, 6],
                        heightOffset : 0}},
        swim : {
                left : {
                        frames :  [3, 2, 1, 0],
                        heightOffset : 17},
                right : {
                        frames : [0, 1, 2, 3],
                        heightOffset : 16}},
        fall : {
                left: {
                        frames : [3, 2, 1, 0],
                        heightOffset : 15},
                right: {
                        frames : [0, 1, 2, 3],
                        heightOffset: 14}},
        stop: {
                left : {
                        frames :  [3, 2, 1, 0],
                        heightOffset : 17},
                right : {
                        frames : [0, 1, 2, 3],
                        heightOffset : 16}
        },
        death: {
                right: {
                        frames: [96, 97, 98, 99, 100],
                        heightOffset: 12
                },
                left: {
                        frames: [108, 107, 106, 105, 104],
                        heightOffset: 13
                }
        }
};

const DOG_FRAMES = {
        sit : {
                left : {
                        frames: [3, 2, 1, 0],
                        heightOffset : 1
                },
                right : {
                        frames : [0, 1, 2, 3],
                        heightOffset : 0
                }
        },
        attack : {
                left : {
                        frames: [4, 3, 2, 1, 0],
                        heightOffset : 3
                },
                right : {
                        frames : [0, 1, 2, 3, 4],
                        heightOffset : 2
                }
        },
        walk : {
                left : {
                        frames: [4, 3, 2, 1, 0],
                        heightOffset : 3
                },
                right : {
                        frames : [0, 1, 2, 3, 4],
                        heightOffset : 2
                }
        },
        death : {
                right: {
                        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                        heightOffset: 0
                },
                left: {
                        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                        heightOffset: 0
                },
        }
};

const MONSTER_FRAMES = {
        walk : {
                left : {
                        frames: [13, 12, 11, 10, 9, 8],
                        heightOffset: 1
                },
                right : {
                        frames: [0, 1, 2, 3, 4, 5],
                        heightOffset: 0
                }
        },
        attack : {
                left : {
                        frames: [31, 30, 29, 28, 27, 26, 25, 24],
                        heightOffset: 3
                },
                right : {
                        frames: [16, 17 , 18, 19, 20, 21, 23, 23],
                        heightOffset: 2
                }
        },
        death : {
                right: {
                        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                        heightOffset: 0
                },
                left: {
                        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                        heightOffset: 0
                },
        }
};

const ROCK_FRAMES = {
        sit : {
                left : {
                        frames: [5, 4],
                        heightOffset : 0
                },
                right : {
                        frames : [0, 1],
                        heightOffset : 0
                }
        },
        attack : {
                left : {
                        frames: [5, 4, 3, 2, 1, 0],
                        heightOffset : 0
                },
                right : {
                        frames : [0, 1, 2, 3, 4, 5],
                        heightOffset : 0
                }
        },
        walk : {
                left : {
                        frames: [5, 4, 3, 2, 1, 0],
                        heightOffset : 0
                },
                right : {
                        frames : [0, 1, 2, 3, 4, 5],
                        heightOffset : 0
                }
        },
};

const SHARK_FRAMES = {
        attack: {
                left: {
                        frames: [2, 1, 0],
                        heightOffset: 3
                },
                right: {
                        frames: [0, 1, 2],
                        heightOffset: 2
                }
        },
        walk: {
                left: {
                        frames: [17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
                                11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
                                11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
                                11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
                                11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
                        heightOffset: 1
                },
                right: {
                        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                                6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                                6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                                6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                                6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
                        heightOffset: 0
                }
        },
};

const BARBARIAN_DEATH_FRAMES = {
        right: {
                frames: [96, 97, 98, 99, 100],
                heightOffset: 12
        },
        left: {
                frames: [108, 107, 106, 105, 104],
                heightOffset: 13
        }
};


// TODO: the right x positions must be sorted in asc order and the left in desc, don't rely on the client to do the sorting
const OBSTACLES = new ObstaclesBuilder()
    .withObstacle(1, RIGHT_LABEL,
        new Obstacle(50, 82, ELEVATION_LABEL, STOP_LABEL, -100, 200))
    .withObstacle(1, RIGHT_LABEL,
        new Obstacle(400, 160, ELEVATION_LABEL, STOP_LABEL, 350, 430))
    .withObstacle(1, RIGHT_LABEL,
        new Obstacle(800, 160, PIT_LABEL, FALL_LABEL, 710, 830))

    .withObstacle(1, LEFT_LABEL,
        new Obstacle(950, 160, PIT_LABEL, FALL_LABEL, 880, 1000))
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

let barbarianCharacter = new CharacterBuilder(undefined, OBSTACLES, BARBARIAN_FRAMES, BARBARIAN_CHARACTER_TYPE, $('.barbarian'))
    .withAction(STOP_LABEL)
    .withDirection(RIGHT_LABEL)
    .withCanHighlight(false)
    .withDeathSprite($('.barbarian'))
    .withPixelsPerSecond(ATTACK_LABEL, 0)
    .withResetAction(STOP_LABEL)
    .withResetDirection(RIGHT_LABEL)
    .withResetLeft(0)
    //.withScreenNumber(1)
    .withResetStatus(ALIVE_LABEL)
    //.withDeathFrames(BARBARIAN_DEATH_FRAMES)
    .withActionNumberOfTimes(ATTACK_LABEL, 1)
    .withResetBottom(2, 160)
    .withResetBottom(3, 600).build();

const GAME_BOARD = new GameBoardBuilder()
    .withOpponents(0, [barbarianCharacter,
        new CharacterBuilder(barbarianCharacter, OBSTACLES, MONSTER_FRAMES, MONSTER_CHARACTER_TYPE, $('.monster'))
            //.withResetLeft(1400)
            //.withPixelsPerSecond(ATTACK, 200)
            //.withPixelsPerSecond(WALK, 200)
            .withDeathSprite($('.death'))
            .withFramesPerSecond(ATTACK_LABEL, 7.5)
            .withSound(MONSTER_SOUND).build()])
    .withOpponents(1, [barbarianCharacter,
        new CharacterBuilder(barbarianCharacter, OBSTACLES, DOG_FRAMES, DOG_CHARACTER_TYPE, $('.dog'))
            .withAction(SIT_LABEL)
            .withFramesPerSecond(ATTACK_LABEL, 7.5)
            .withResetAction(SIT_LABEL)
            .withResetBottom(1, 160)
            .withResetLeft(1050)
            .withSound(GROWL_SOUND)
            .withScreenNumber(1).build()])
    .withOpponents(2, [barbarianCharacter,
        new CharacterBuilder(barbarianCharacter, OBSTACLES, ROCK_FRAMES, ROCK_CHARACTER_TYPE, $('.rock'))
            .withAction(SIT_LABEL)
            .withCanElevate(false)
            .withCanHighlight(false)
            .withFramesPerSecond(SIT_LABEL, 10)
            .withFramesPerSecond(ATTACK_LABEL, 10)
            .withFramesPerSecond(WALK_LABEL, 10)
            .withPixelsPerSecond(WALK_LABEL, 250)
            .withPixelsPerSecond(ATTACK_LABEL, 250)
            // Don't allow jump evade of rock
            // Don't allow barbarian to kill rock
            .withResetAction(SIT_LABEL)
            .withResetLeft(1270)
            .withCanLeaveBehind(true)
            .withResetTurnaround(false)
            .withIsInvincible(true)
            .withScreenNumber(2).build(),
        new CharacterBuilder(barbarianCharacter, OBSTACLES, MONSTER_FRAMES, MONSTER_CHARACTER_TYPE, $('.monster_invincible'))
            // Don't allow barbarian to kill the invincible monster
            .withResetLeft(500)
            .withFramesPerSecond(ATTACK_LABEL, 7.5)
            .withSound(MONSTER_SOUND)
            .withIsInvincible(false)
            .withScreenNumber(2).build()])
    .withOpponents(3, [barbarianCharacter,
        new CharacterBuilder(barbarianCharacter, OBSTACLES, SHARK_FRAMES, SHARK_CHARACTER_TYPE, $('.shark1'))
            .withFramesPerSecond(ATTACK_LABEL, 10)
            .withFramesPerSecond(WALK_LABEL, 10)
            .withSound(SPLASH_SOUND)
            .withResetBottom(3, 0)
            .withCanLeaveBehind(true)
            .withCanHighlight(false)
            .withIsInvincible(true)
            .withResetLeft(0)
            .withScreenNumber(3).build(),
        new CharacterBuilder(barbarianCharacter, OBSTACLES, SHARK_FRAMES, SHARK_CHARACTER_TYPE, $('.shark2'))
            .withFramesPerSecond(ATTACK_LABEL, 10)
            .withFramesPerSecond(WALK_LABEL, 10)
            .withSound(SPLASH_SOUND)
            .withResetBottom(3, 0)
            .withCanLeaveBehind(true)
            .withCanHighlight(false)
            .withIsInvincible(true)
            .withResetLeft(1400)
            .withScreenNumber(3).build(),
        new CharacterBuilder(barbarianCharacter, OBSTACLES, SHARK_FRAMES, SHARK_CHARACTER_TYPE, $('.shark3'))
            .withFramesPerSecond(ATTACK_LABEL, 10)
            .withFramesPerSecond(WALK_LABEL, 10)
            .withSound(SPLASH_SOUND)
            .withResetBottom(3, 800)
            .withCanLeaveBehind(true)
            .withCanHighlight(false)
            .withIsInvincible(true)
            .withResetLeft(1400)
            .withScreenNumber(3).build(),
        new CharacterBuilder(barbarianCharacter, OBSTACLES, SHARK_FRAMES, SHARK_CHARACTER_TYPE, $('.shark4'))
            .withFramesPerSecond(ATTACK_LABEL, 10)
            .withFramesPerSecond(WALK_LABEL, 10)
            .withSound(SPLASH_SOUND)
            .withResetBottom(3, 400)
            .withCanLeaveBehind(true)
            .withCanHighlight(false)
            .withIsInvincible(true)
            .withResetLeft(0)
            .withScreenNumber(3).build()])
    .withWater(3).build();

let game = new Game(barbarianCharacter, GAME_BOARD);
let events = new Events(game);

