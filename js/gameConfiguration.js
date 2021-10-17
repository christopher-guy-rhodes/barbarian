const SHARK_CHARACTER_TYPE = 'SHARK';
const MONSTER_CHARACTER_TYPE = 'MONSTER';
const ROCK_CHARACTER_TYPE = 'ROCK';
const DOG_CHARACTER_TYPE = 'DOG';
const BARBARIAN_CHARACTER_TYPE = 'BARBARIAN';

const BARBARIAN_FRAMES = {
        sink : {
                right: {
                        frames: [100],
                        heightOffset: 12
                },
                left: {
                        frames: [104],
                        heightOffset: 13
                }
        },
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
                        frames :  [14],
                        heightOffset : 1},
                right : {
                        frames : [0],
                        heightOffset : 0}
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
        stop : {
                left : {
                        frames : [5],
                        heightOffset : 0
                },
                right : {
                        frames : [0],
                        heightOffset: 0
                }
        }
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

let sounds = new Sounds();

let barbarianCharacter = new CharacterBuilder(undefined, OBSTACLES, BARBARIAN_FRAMES)
    .withProperties(new CharacterPropertiesBuilder($('.barbarian'), BARBARIAN_CHARACTER_TYPE, 0)
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
    //.withScreenNumber(1)
    .withDirection(RIGHT_LABEL)
    .build();

const GAME_BOARD = new GameBoardBuilder()
    .withOpponents(0, [barbarianCharacter,
        new CharacterBuilder(barbarianCharacter, OBSTACLES, MONSTER_FRAMES)
            .withProperties(new CharacterPropertiesBuilder($('.monster'), MONSTER_CHARACTER_TYPE, 850)
                .withSound(sounds.getMonsterSound())
                .withFramesPerSecond(ATTACK_LABEL, 7.5)
                .build())
            .build()])
    .withOpponents(1, [barbarianCharacter,
        new CharacterBuilder(barbarianCharacter, OBSTACLES, DOG_FRAMES)
            .withProperties(new CharacterPropertiesBuilder($('.dog'), DOG_CHARACTER_TYPE, 1050)
                .withSound(sounds.getGrowlSound())
                .withDefaultAction(SIT_LABEL)
                .withDefaultBottom(1, 160)
                .withFramesPerSecond(ATTACK_LABEL, 7.5)
                .build())
            .withAction(SIT_LABEL)
            .withScreenNumber(1).build()])
    .withOpponents(2, [barbarianCharacter,
        new CharacterBuilder(barbarianCharacter, OBSTACLES, ROCK_FRAMES)
            .withProperties(new CharacterPropertiesBuilder($('.rock'), ROCK_CHARACTER_TYPE, 1270)
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
        new CharacterBuilder(barbarianCharacter, OBSTACLES, MONSTER_FRAMES)
            .withProperties(new CharacterPropertiesBuilder($('.red_monster'), MONSTER_CHARACTER_TYPE, 500)
                .withSound(sounds.getMonsterSound())
                .withFramesPerSecond(ATTACK_LABEL, 7.5)
                .build())
            // Don't allow barbarian to kill the invincible monster
            .withScreenNumber(2).build()])
    .withOpponents(3, [barbarianCharacter,
        new CharacterBuilder(barbarianCharacter, OBSTACLES, SHARK_FRAMES)
            .withProperties(new CharacterPropertiesBuilder($('.shark1'), SHARK_CHARACTER_TYPE, 0)
                .withSound(sounds.getSplashSound())
                .withCanLeaveBehind(true)
                .withIsInvincible(true)
                .withDefaultBottom(3, 0)
                .withFramesPerSecond(ATTACK_LABEL, 10)
                .withFramesPerSecond(WALK_LABEL, 10)
                .withPixelsPerSecond(ATTACK_LABEL, 1.2 * DEFAULT_PIXELS_PER_SECOND)
                .build())
            .withScreenNumber(3).build(),
        new CharacterBuilder(barbarianCharacter, OBSTACLES, SHARK_FRAMES)
            .withProperties(new CharacterPropertiesBuilder($('.shark2'), SHARK_CHARACTER_TYPE, 1400)
                .withCanLeaveBehind(true)
                .withIsInvincible(true)
                .withDefaultBottom(3, 700)
                .withFramesPerSecond(ATTACK_LABEL, 10)
                .withFramesPerSecond(WALK_LABEL, 10)
                .withPixelsPerSecond(ATTACK_LABEL, 1.2 * DEFAULT_PIXELS_PER_SECOND)
                .build())
            .withScreenNumber(3).build()])
    .withWater(3).build();

let game = new Game(barbarianCharacter, GAME_BOARD);
let events = new Events(game);

