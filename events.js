function resetBridgePosition() {
    setBottom(BRIDGE, '116');
    hide(BRIDGE);
}

function getLives() {
    return lives;
}

function isScrolling() {
    return scrolling;
}

function setScrolling(value) {
    scrolling = value;
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

function getScreenNumber() {
    return screenNumber;
}

function setScreenNumber(number) {
    screenNumber = number;
}

function resetGame() {
    renderSpriteFrame(BARBARIAN_SPRITE, WALK, 0);
    setAction(BARBARIAN_SPRITE, undefined);
    setDirection(BARBARIAN_SPRITE, RIGHT);
    if (getLives() < 1) {
        setLives(3);
        setScreenNumber(0);
        resetBridgePosition();

        for (const sprite of SPRITES) {
            setDisplay(sprite[SPRITE], getResetDisplay(sprite));
            setLeft(sprite[SPRITE], getResetLeft(sprite));
            setBottom(sprite[SPRITE], getResetBottom(sprite));
            setStatus(sprite, getResetStatus(sprite));
        }

        setBackgroundPosition(BACKDROP, 0);
        hide(GAME_OVER_MESSAGE);
        show(LIFE1);
        show(LIFE2);
        hide(DEMO_OVER_MESSAGE);
    } else {
        setStatus(BARBARIAN_SPRITE, ALIVE);
        hide($('.life' + getLives()));
        hide(CONTROL_MESSAGE);
    }
}

function handleSpaceKeypress() {
    if (isDead(BARBARIAN_SPRITE)) {
        resetGame();

        hide(START_MESSAGE);
        startMonsterAttacks();
        actionHelper(BARBARIAN_SPRITE, STOP, 0);
    }
}

function shouldThrottle(lastKeypressTime) {
    let elapsed = KEYPRESS_THROTTLE_DELAY;
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
                actionHelper(BARBARIAN_SPRITE, getAction(BARBARIAN_SPRITE), 0);
            }
            startMonsterAttacks(true);
            setThemeSongPauseState(false);
        } else {
            $('.pause_message').css('display', 'block');
            show(PAUSE_MESSAGE);
            setPaused(true);
            setThemeSongPauseState(true);
        }
    }
}

function handleHintsKeypress() {
    hide(SOUND_ON_MESSAGE);
    hide(SOUND_OFF_MESSAGE);

    hide(isHints() ? HINTS_ON_MESSAGE : HINTS_OFF_MESSAGE);
    show(isHints() ? HINTS_OFF_MESSAGE : HINTS_ON_MESSAGE);
    setHints(!isHints());

    setTimeout(function () {
        hide(isHints() ? HINTS_ON_MESSAGE : HINTS_OFF_MESSAGE);
    }, TOGGLE_MESSAGE_TIME);
}

function handleSoundKeypress() {
    hide(HINTS_ON_MESSAGE);
    hide(HINTS_OFF_MESSAGE);

    hide(isSound() ? SOUND_ON_MESSAGE : SOUND_OFF_MESSAGE);
    show(isSound() ? SOUND_OFF_MESSAGE : SOUND_ON_MESSAGE);
    setSound(!isSound());
    setThemeSongPauseState(isSound());

    setTimeout(function () {
        hide(isSound() ? SOUND_OFF_MESSAGE : SOUND_ON_MESSAGE);
    }, TOGGLE_MESSAGE_TIME);
}

function handleRunKeypress() {
    if (getAction(BARBARIAN_SPRITE) !== RUN && isAliveOrJustDied()) {
        actionHelper(BARBARIAN_SPRITE, RUN, 0);
    }
}

function handleJumpKeypress() {
    if (getAction(BARBARIAN_SPRITE) !== JUMP && isAliveOrJustDied()) {
        actionHelper(BARBARIAN_SPRITE, JUMP, 1);
    }
}

function handleStopKeypress() {
    if (isAliveOrJustDied()) {
        actionHelper(BARBARIAN_SPRITE, STOP, 1);
        setAction(BARBARIAN_SPRITE, STOP);
    }
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

function setBarbarianDying(value) {
    barbarianDying = value;
}

function isBarbarianDying() {
    return barbarianDying;
}


