function resetBarbarianPosition() {
    show(BARBARIAN_SPRITE[SPRITE]);
    setBottom(BARBARIAN_SPRITE[SPRITE], 12);
    setLeft(BARBARIAN_SPRITE[SPRITE], '-200');
}

function resetBridgePosition() {
    setBottom(BRIDGE, '116');
    hide(BRIDGE);
}

function resetDogPosition() {
    hide(DOG_SPRITE[SPRITE]);
    setLeft(DOG_SPRITE[SPRITE], '850');
    setBottom(DOG_SPRITE[SPRITE], 160);
}

function resetMonsterPosition() {
    show(MONSTER_SPRITE[SPRITE]);
    setLeft(MONSTER_SPRITE[SPRITE], '850');
}

function getLives() {
    return lives;
}

function isScrolling() {
    return scrolling;
}

function isBarbarianDying() {
    return barbarianDying;
}

function isHints() {
    return hints;
}

function setHints(status) {
    hints = status;
}

function isPaused() {
    return pause;
}

function setPaused(state) {
    pause = state;
}

function isSound() {
    return sound;
}

function setSound(status) {
    sound = status;
}

function setLives(number) {
    lives = number;
}

function setScreenNumber(number) {
    screenNumber = number;
}

function resetGame() {
    setStatus(MONSTER_SPRITE, DEAD);
    setStatus(DOG_SPRITE, DEAD);
    setLives(3);
    setScreenNumber(0);
    resetBarbarianPosition();
    resetBridgePosition();
    resetDogPosition();
    resetMonsterPosition();
    setBackgroundPosition(BACKDROP, 0);
    hide(GAME_OVER_MESSAGE);
    show(LIFE1);
    show(LIFE2);
    hide(GAME_OVER_MESSAGE);
}

function handleSpaceKeypress() {
    if (isDead(BARBARIAN_SPRITE)) {

        BARBARIAN_SPRITE[STATUS] = ALIVE;
        BARBARIAN_SPRITE[ACTION] = undefined;
        BARBARIAN_SPRITE[DIRECTION] = RIGHT;
        renderSpriteFrame(BARBARIAN_SPRITE, WALK, 0);

        // start monster attacks if there are no lives left
        if (getLives() < 1) {
            resetGame();
        } else {
            hide($('.life' + getLives()));
            hide(CONTROL_MESSAGE);
        }
        hide(START_MESSAGE);
        startMonsterAttacks();
        actionHelper(BARBARIAN_SPRITE, STOP, 0);
    }
}

function shouldThrottle(lastKeypressTime) {
    var elapsed = KEYPRESS_THROTTLE_DELAY;
    if (typeof lastKeypressTime !== undefined) {
        elapsed = new Date().getTime() - lastKeypressTime;
    }
    return elapsed < KEYPRESS_THROTTLE_DELAY;
}

function handlePauseKeypress() {
    if (!isDead(BARBARIAN_SPRITE)) {
        if (isPaused()) {
            hide(PAUSE_MESSAGE);
            setPaused(false);
            if (getAction(BARBARIAN_SPRITE) !== undefined) {
                actionHelper(BARBARIAN_SPRITE, BARBARIAN_SPRITE[ACTION], 0);
            }
            startMonsterAttacks(true);
            unpauseThemeSong();
        } else {
            $('.pause_message').css('display', 'block');
            show(PAUSE_MESSAGE);
            setPaused(true);
            pauseThemeSong();
        }
    }
}

function handleHintsKeypress() {
    hide(SOUND_ON_MESSAGE);
    hide(SOUND_OFF_MESSAGE);

    if (isHints()) {
        hide(HINTS_ON_MESSAGE);
        show(HINTS_OFF_MESSAGE);
        setHints(false);
    } else {
        show(HINTS_ON_MESSAGE);
        hide(HINTS_OFF_MESSAGE);
        setHints(true);
    }
    setTimeout(function () {
        hide(HINTS_ON_MESSAGE);
        hide(HINTS_OFF_MESSAGE);
    }, 3000);
}

function handleSoundKeypress() {
    hide(HINTS_ON_MESSAGE);
    hide(HINTS_OFF_MESSAGE);

    if (isSound()) {
        hide(SOUND_ON_MESSAGE);
        show(SOUND_OFF_MESSAGE);
        setSound(false);
        pauseThemeSong();
    } else {
        show(SOUND_ON_MESSAGE);
        hide(SOUND_OFF_MESSAGE);
        setSound(true);
        unpauseThemeSong();
    }
    setTimeout(function () {
        hide(SOUND_OFF_MESSAGE);
        hide(SOUND_ON_MESSAGE);
    }, 3000);
}

function handleRunKeypress() {
    getAction(BARBARIAN_SPRITE) !== RUN && isAliveOrJustDied() &&
    actionHelper(BARBARIAN_SPRITE, RUN, 0);
}

function handleJumpKeypress() {
    getAction(BARBARIAN_SPRITE) !== JUMP && isAliveOrJustDied() &&
    actionHelper(BARBARIAN_SPRITE, JUMP, 1);
}

function handleStopKeypress() {
    isAliveOrJustDied() && actionHelper(BARBARIAN_SPRITE, STOP, 1) &&
    setAction(BARBARIAN_SPRITE, STOP);
}

function handleRightKeypress() {
    if ((getAction(BARBARIAN_SPRITE) !== WALK || getDirection(BARBARIAN_SPRITE) !== RIGHT) && isAliveOrJustDied()) {
        setDirection(BARBARIAN_SPRITE, RIGHT);
        actionHelper(BARBARIAN_SPRITE, WALK, 0);
    }
}

function handleLeftKeypress() {
    if ((BARBARIAN_SPRITE[ACTION] != WALK || BARBARIAN_SPRITE[DIRECTION] !== LEFT) && isAliveOrJustDied()) {
        setDirection(BARBARIAN_SPRITE, LEFT);
        actionHelper(BARBARIAN_SPRITE, WALK, 0);
    }
}

function handleAttackKeypress() {
    if (getAction(BARBARIAN_SPRITE) !== ATTACK && isAliveOrJustDied()) {
        playGruntSound();
        actionHelper(BARBARIAN_SPRITE, ATTACK, 1);
    }
}
