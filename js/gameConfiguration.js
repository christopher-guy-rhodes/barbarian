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
    .withObstacle(1, RIGHT,
        new Obstacle(50, 82, ELEVATION, STOP, -100, 200))
    .withObstacle(1, RIGHT,
        new Obstacle(400, 160, ELEVATION, STOP, 350, 430))
    .withObstacle(1, RIGHT,
        new Obstacle(800, 160, PIT, FALL, 710, 830))

    .withObstacle(1, LEFT,
        new Obstacle(950, 160, PIT, FALL, 880, 1000))
    .withObstacle(1, LEFT,
        new Obstacle(400, 82, ELEVATION, STOP))
    .withObstacle(1, LEFT,
        new Obstacle(100, 12, ELEVATION, STOP))


    .withObstacle(2, RIGHT,
        new Obstacle(125, 122, ELEVATION, STOP))
    .withObstacle(2, RIGHT,
        new Obstacle(250, 74, ELEVATION, STOP))
    .withObstacle(2, RIGHT,
        new Obstacle(365, 12, ELEVATION, STOP))

    .withObstacle(2, LEFT,
        new Obstacle(390, 74, ELEVATION, STOP, 350, 390))
    .withObstacle(2, LEFT,
        new Obstacle(290, 122, ELEVATION, STOP, 180, 330))
    .withObstacle(2, LEFT,
        new Obstacle(165, 165, ELEVATION, STOP, 65, 215))
    .build();

let barbarianCharacter = new CharacterBuilder(undefined, OBSTACLES, BARBARIAN_FRAMES, BARBARIAN_CHARACTER_TYPE, $('.barbarian'))
    .withAction(STOP)
    .withName(BARBARIAN_SPRITE_NAME)
    .withDirection(RIGHT)
    .withCanHighlight(false)
    .withDeathSprite($('.barbarian'))
    .withPixelsPerSecond(ATTACK, 0)
    .withResetAction(STOP)
    .withResetDirection(RIGHT)
    .withResetLeft(0)
    //.withScreenNumber(1)
    .withResetStatus(ALIVE)
    //.withDeathFrames(BARBARIAN_DEATH_FRAMES)
    .withActionNumberOfTimes(ATTACK, 1)
    .withResetBottom(2, 160)
    .withResetBottom(3, 600).build();

const GAME_BOARD = new GameBoardBuilder()
    .withOpponents(0, [barbarianCharacter,
        new CharacterBuilder(barbarianCharacter, OBSTACLES, MONSTER_FRAMES, MONSTER_CHARACTER_TYPE, $('.monster'))
            //.withResetLeft(1400)
            //.withPixelsPerSecond(ATTACK, 200)
            //.withPixelsPerSecond(WALK, 200)
            .withDeathSprite($('.death'))
            .withFramesPerSecond(ATTACK, 7.5)
            .withSound(MONSTER_SOUND).build()])
    .withOpponents(1, [barbarianCharacter,
        new CharacterBuilder(barbarianCharacter, OBSTACLES, DOG_FRAMES, DOG_CHARACTER_TYPE, $('.dog'))
            .withAction(SIT)
            .withFramesPerSecond(ATTACK, 7.5)
            .withResetAction(SIT)
            .withResetBottom(1, 160)
            .withResetLeft(1050)
            .withSound(GROWL_SOUND)
            .withScreenNumber(1).build()])
    .withOpponents(2, [barbarianCharacter,
        new CharacterBuilder(barbarianCharacter, OBSTACLES, ROCK_FRAMES, ROCK_CHARACTER_TYPE, $('.rock'))
            .withAction(SIT)
            .withCanElevate(false)
            .withCanHighlight(false)
            .withFramesPerSecond(SIT, 10)
            .withFramesPerSecond(ATTACK, 10)
            .withFramesPerSecond(WALK, 10)
            .withPixelsPerSecond(WALK, 250)
            .withPixelsPerSecond(ATTACK, 250)
            // Don't allow jump evade of rock
            // Don't allow barbarian to kill rock
            .withResetAction(SIT)
            .withResetLeft(1270)
            .withCanLeaveBehind(true)
            .withResetTurnaround(false)
            .withIsInvincible(true)
            .withScreenNumber(2).build(),
        new CharacterBuilder(barbarianCharacter, OBSTACLES, MONSTER_FRAMES, MONSTER_CHARACTER_TYPE, $('.monster_invincible'))
            // Don't allow barbarian to kill the invincible monster
            .withResetLeft(500)
            .withFramesPerSecond(ATTACK, 7.5)
            .withSound(MONSTER_SOUND)
            .withIsInvincible(false)
            .withScreenNumber(2).build()])
    .withOpponents(3, [barbarianCharacter,
        new CharacterBuilder(barbarianCharacter, OBSTACLES, SHARK_FRAMES, SHARK_CHARACTER_TYPE, $('.shark1'))
            .withFramesPerSecond(ATTACK, 10)
            .withFramesPerSecond(WALK, 10)
            .withSound(SPLASH_SOUND)
            .withResetBottom(3, 0)
            .withCanLeaveBehind(true)
            .withCanHighlight(false)
            .withIsInvincible(true)
            .withResetLeft(0)
            .withScreenNumber(3).build(),
        new CharacterBuilder(barbarianCharacter, OBSTACLES, SHARK_FRAMES, SHARK_CHARACTER_TYPE, $('.shark2'))
            .withFramesPerSecond(ATTACK, 10)
            .withFramesPerSecond(WALK, 10)
            .withSound(SPLASH_SOUND)
            .withResetBottom(3, 0)
            .withCanLeaveBehind(true)
            .withCanHighlight(false)
            .withIsInvincible(true)
            .withResetLeft(1400)
            .withScreenNumber(3).build(),
        new CharacterBuilder(barbarianCharacter, OBSTACLES, SHARK_FRAMES, SHARK_CHARACTER_TYPE, $('.shark3'))
            .withFramesPerSecond(ATTACK, 10)
            .withFramesPerSecond(WALK, 10)
            .withSound(SPLASH_SOUND)
            .withResetBottom(3, 800)
            .withCanLeaveBehind(true)
            .withCanHighlight(false)
            .withIsInvincible(true)
            .withResetLeft(1400)
            .withScreenNumber(3).build(),
        new CharacterBuilder(barbarianCharacter, OBSTACLES, SHARK_FRAMES, SHARK_CHARACTER_TYPE, $('.shark4'))
            .withFramesPerSecond(ATTACK, 10)
            .withFramesPerSecond(WALK, 10)
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

