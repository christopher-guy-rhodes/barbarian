let BARBARIAN_CHARACTER = new CharacterBuilder(BARBARIAN_FRAMES, BARBARIAN_CHARACTER_TYPE, $('.barbarian'))
    .withAction(STOP)
    .withName(BARBARIAN_SPRITE_NAME)
    .withDirection(RIGHT)
    .withCanHighlight(false)
    .withDeathSprite($('.barbarian'))
    .withPixelsPerSecond(ATTACK, 0)
    .withResetAction(STOP)
    .withResetDirection(RIGHT)
    .withResetLeft(0)
    .withResetStatus(ALIVE)
    .withDeathFrames(BARBARIAN_DEATH_FRAMES)
    .withActionNumberOfTimes(ATTACK, 1)
    .withResetBottom(2, 160)
    .withResetBottom(3, 600).build();

SCREENS = {
    0 : {
        obstacles : {
            left: [],
            right: [],
        },
        opponents: [BARBARIAN_CHARACTER,
            new CharacterBuilder(MONSTER_FRAMES, MONSTER_CHARACTER_TYPE, $('.monster'))
                .withMinJumpThreshold(-10)
                .withMaxJumpThreshold(110)
                .withFramesPerSecond(ATTACK, 7.5)
                .withSound(MONSTER_SOUND).build()],
        trapDoors: [],
        water: false,
        allowedScrollDirections: {
            left : false,
            right: true
        }
    },
    1 : {
        obstacles: {
            right: [
                {left: 50,  obstacleType: ELEVATION, failAction: STOP, height: 82,  jumpThresholds: {min: -100, max: 100}},
                {left: 400, obstacleType: ELEVATION, failAction: STOP, height: 160, jumpThresholds: {min: 350,  max: 430}},
                {left: 800, obstacleType: PIT,       failAction: FALL, height: 160, jumpThresholds: {min: 710,  max: 830}}
            ],
            left: [
                {left: 100, obstacleType: ELEVATION, failAction: STOP, height: 12},
                {left: 400, obstacleType: ELEVATION, failAction: STOP, height: 82},
                {left: 950, obstacleType: PIT,       failAction: FALL, height: 160, jumpThresholds: {min: 880, max: 1000}}
            ]
        },
        opponents: [
            new CharacterBuilder(DOG_FRAMES, DOG_CHARACTER_TYPE, $('.dog'))
                .withAction(SIT)
                .withFramesPerSecond(ATTACK, 7.5)
                .withResetAction(SIT)
                .withResetBottom(1, 160)
                .withSound(GROWL_SOUND).build(), BARBARIAN_CHARACTER],
        trapDoors: [{
            element: BRIDGE,
            reset : {
                bottom: 116
            },
            trigger : {
                left: 700,
                time: 300
            }}],
        water: false,
        allowedScrollDirections: {
            left : true,
            right: true
        }
    },
    2 : {
        obstacles : {
            right: [
                {left: 107, obstacleType : ELEVATION, failAction: STOP, height: 122},
                {left: 207, obstacleType : ELEVATION, failAction: STOP, height: 74},
                {left: 325, obstacleType : ELEVATION, failAction: STOP, height: 12},
            ],
            left: [
                {left: 410, obstacleType : ELEVATION, failAction: STOP, height: 74, jumpThresholds : {min: 310, max: 460}},
                {left: 165, obstacleType : ELEVATION, failAction: STOP, height: 165, jumpThresholds : {min: 65, max: 215}},
                {left: 280, obstacleType : ELEVATION, failAction: STOP, height: 122, jumpThresholds : {min: 180, max: 330}},
            ],
        },
        opponents: [BARBARIAN_CHARACTER,
            new CharacterBuilder(ROCK_FRAMES, ROCK_CHARACTER_TYPE, $('.rock'))
                .withAction(SIT)
                .withCanElevate(false)
                .withCanHighlight(false)
                .withFramesPerSecond(SIT, 10)
                .withFramesPerSecond(ATTACK, 10)
                .withFramesPerSecond(WALK, 10)
                .withPixelsPerSecond(WALK, 200)
                .withPixelsPerSecond(ATTACK, 200)
                .withMinAttackThreshold(-50)
                .withMaxAttackThreshold(150)
                // Don't allow jump evade of rock
                .withMinJumpThreshold(0)
                .withMaxJumpThreshold(0)
                // Don't allow barbarian to kill rock
                .withMinBarbarianAttackThreshold(0)
                .withMaxBarbarianAttackThreshold(0)
                .withResetAction(SIT)
                .withResetLeft(1270)
                .withCanLeaveBehind(true)
                .withResetTurnaround(false).build(),
            new CharacterBuilder(MONSTER_FRAMES, MONSTER_CHARACTER_TYPE, $('.monster_invincible'))
                .withMinJumpThreshold(-25)
                .withMaxJumpThreshold(126)
                // Don't allow barbarian to kill the invincible monster
                .withMinBarbarianAttackThreshold(0)
                .withMaxBarbarianAttackThreshold(0)
                .withFramesPerSecond(ATTACK, 7.5)
                .withSound(MONSTER_SOUND).build()],
        trapDoors: [],
        water: false,
        allowedScrollDirections: {
            left : true,
            right: true
        }
    },
    3 : {
        obstacles : {
            left: [],
            right: [],
        },
        opponents: [BARBARIAN_CHARACTER,
            new CharacterBuilder(SHARK_FRAMES, SHARK_CHARACTER_TYPE, $('.shark1'))
                .withFramesPerSecond(ATTACK, 10)
                .withFramesPerSecond(WALK, 10)
                .withSound(SPLASH_SOUND)
                .withResetBottom(3, 0)
                .withCanLeaveBehind(true)
                .withCanHighlight(false)
                .withResetLeft(0).build(),
            new CharacterBuilder(SHARK_FRAMES, SHARK_CHARACTER_TYPE, $('.shark2'))
                .withFramesPerSecond(ATTACK, 10)
                .withFramesPerSecond(WALK, 10)
                .withSound(SPLASH_SOUND)
                .withResetBottom(3, 0)
                .withCanLeaveBehind(true)
                .withCanHighlight(false)
                .withResetLeft(1400).build(),
            new CharacterBuilder(SHARK_FRAMES, SHARK_CHARACTER_TYPE, $('.shark3'))
                .withFramesPerSecond(ATTACK, 10)
                .withFramesPerSecond(WALK, 10)
                .withSound(SPLASH_SOUND)
                .withResetBottom(3, 800)
                .withCanLeaveBehind(true)
                .withCanHighlight(false)
                .withResetLeft(1400).build(),
            new CharacterBuilder(SHARK_FRAMES, SHARK_CHARACTER_TYPE, $('.shark4'))
                .withFramesPerSecond(ATTACK, 10)
                .withFramesPerSecond(WALK, 10)
                .withSound(SPLASH_SOUND)
                .withResetBottom(3, 400)
                .withCanLeaveBehind(true)
                .withCanHighlight(false)
                .withResetLeft(0).build()],
        trapDoors: [],
        water: true,
        allowedScrollDirections: {
            left : false,
            right: true
        }
    }
};
