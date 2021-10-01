class Game {
    constructor(barbarian, gameBoard) {
        if (barbarian === undefined) {
            throw new Error("barbarian argument is required");
        }
        if (gameBoard === undefined) {
            throw new Error("gameBoard argument is required")
        }

        this.barbarian = barbarian;
        this.gameBoard = gameBoard;
        this.isPaused = false;
        this.pauseFrame = 0;
        this.actionsLocked = false;

        this.sounds = new Sounds();
    }

    performAction(character, action, frame = 0) {
        character.stopAnimation();
        character.setAction(action);

        let self = this;

        character.animate(this.gameBoard, action,
            character.getDirection(),
            character.getVerticalDirection(),
            character.getActionNumberOfTimes(action),
            frame).then(function(frame) {
                self.handleActionInterruption(character, action, frame);
        }).catch(function(error) {
            handlePromiseError(error);
        });
    }

    handleActionInterruption(character, requestedAction, frame) {

        if (this.getIsPaused() && character.isBarbarian()) {
            // Save the frame if the game was paused so the animation can be resumed at the right place
            game.setPauseFrame(frame);
        }

        // Stop any finite actions assuming they are still the requested action
        if ((!character.isActionInfinite(requestedAction) && character.getAction() === requestedAction)
            || this.getIsPaused()) {
                character.getSprite().stop();
        }

        if (character.getAction() === DEATH && character.isBarbarian()) {
            // Do not change action from DEATH right away because we don't want to barbarian to move while dying
            game.setActionsLocked(true);
            setTimeout(function () {
                game.setActionsLocked(false);
                //character.setAction(undefined);
            }, 1000);
        }
        if (character.getAction() === DEATH && !character.isBarbarian()) {
            character.getDeathSprite().hide();
        }
        if (character.isAtBoundary()) {
            this.handleBoundary(character);
        }
        if (character.shouldTurnaround()) {
            this.handleMonsterTurnaround(character);
        }
        if (character.shouldLaunchAttack(this.gameBoard)) {
            this.launchCpuAttack(character)
        }
        if (character.shouldCpuFight(this.gameBoard)) {
            this.executeFightSequence(character);
        }
        if (character.hitObstacle()) {
            this.handleObstacle(character, requestedAction);
        }

        // If the barbarian has been defeated make the monster continue to move
        if (!character.isBarbarian() && this.isBarbarianDead() && !character.isWalking()) {
            this.performAction(character, WALK);
        }
    }

    handleObstacle(character, requestedAction) {
        let obstacle = character.getObstacle();
        if (obstacle !== undefined ) {
            character.getSprite().stop();

            if (obstacle.getIsElevation()) {
                if (obstacle.isTraversableDownhillElevation(character)) {
                    character.setBottom(obstacle.getHeight());
                    // Continue whatever action the character was performing since they traversed the elevation
                    this.performAction(character, requestedAction, character.getCurrentFrame());
                } else if (obstacle.didCharacterJumpEvade(character)) {
                    character.setBottom(obstacle.getHeight());
                    // Continue the jumping motion since the character evaded the obstacle
                    this.performAction(character, JUMP, character.getCurrentFrame());
                } else {
                    // Hid elevation and did not avoid, let the character remain stopped and render at rest frame
                    this.renderAtRestFrame(character);
                }
            } else if (obstacle.getIsPit() && character.isBarbarian()) {
                if (requestedAction !== FALL) {
                    character.setAction(FALL);
                    this.death(character);
                }
            }
        }
    }

    death(character) {
        character.setDeathTime(new Date().getTime());
        character.setStatus(DEAD);

        if (character.isBarbarian()) {
            showMessage(START_MESSAGE);
            numLives = numLives - 1;
            if (numLives < 1) {
                this.showMessage(GAME_OVER_MESSAGE);
            }
            if (character.getAction() === FALL) {
                this.sounds.playSound(FALL_SOUND);
            } else {
                this.sounds.playSound(GRUNT_SOUND);
            }
        } else {
            this.playFireSound();
        }

        if (this.isWater()) {
            character.getSprite().stop();
            let timeToFall = character.getY() / DEFAULT_PIXELS_PER_SECOND * MILLISECONDS_PER_SECOND;

            console.log('getting death frame for ' + character.getCharacterType() + ' for direction ' + character.getDirection());
            let frame = character.getFrames(DEATH, character.getDirection())[4];
            let heightOffset = character.getHeightOffset(DEATH, character.getDirection()) * character.getDeathSprite().height();
            //character.getDirection()) * character.getSprite().height();
            setCss(character.getDeathSprite(), 'background-position',
                -1*frame*character.getDeathSprite().width() + 'px ' + -1*heightOffset + 'px');

            character.moveToPosition(character.getX(), 0, DEFAULT_PIXELS_PER_SECOND);
        } else {
            this.performAction(character,character.getAction() == FALL ? FALL : DEATH)
            if (character.getAction() === FALL) {
                setTimeout(function () {
                    character.hide();
                }, character.getDeathFallDelay());
            }
        }


    }


    startMonsterAttacks(unpausing = false) {
        let monsters = this.getMonstersOnScreen()
            // Don't restart the monster if unpausing and the monster is already dead
            .filter(monster => !(monster.isDead() && unpausing));

        for (let monster of monsters) {
            monster.show();
            monster.setStatus(ALIVE);
            this.sounds.playSound(monster.getSound());
            this.performAction(monster, monster.getResetAction());
        }
    }

    playThemeSong() {
        if (!this.getIsPaused()) {
            this.sounds.playSound(THEME_SONG);
        }
    }

    playGruntSound() {
        this.sounds.playSound(GRUNT_SOUND);
    }

    playFireSound() {
        this.sounds.playFireSound();
    }

    playFallSound() {
        this.sounds.playSound(FALL_SOUND);
    }

    stopAllSounds() {
        this.sounds.stopAllSounds();
    }

    setSoundsPauseState() {
        this.sounds.setSoundsPauseState(this.getIsPaused());
    }

    showMessage(message) {
        $.each(MESSAGES, function(idx, e) {
            setCss(e, 'display', e[0].classList !== message[0].classList ? 'none' : 'block');
        });
    }

    executeFightSequence(character) {
        if (character.isBarbarian() || character.isDead() || !this.doesScreenIncludeCharacter(character)) {
            return;
        }
        let opponentsInProximity = character.getOpponentsWithinX(this.gameBoard, FIGHTING_RANGE_PIXELS);

        for (let i = 0; i < opponentsInProximity.length; i++) {
            let opponent = opponentsInProximity[i];

            let monsterAction = character.getAction();
            // TODO: stop using barbarian as var name, could be two monster fighting
            let opponentAction = opponent.getAction();
            let opponentCurrentFrame = opponent.getCurrentFrame(opponentAction);


            let looser = undefined;
            let winner = undefined;
            // TODO: put attack frame configuration into the character objects
            if (opponentAction === ATTACK && (opponentCurrentFrame === 3 || opponentCurrentFrame === 4) && !(opponent.isBarbarian() && character.getIsInvincible())) {
                looser = character;
                winner = opponent;
            } else {
                looser = opponent;
                winner = character;
            }

            if (!looser.isDead() && !looser.getIsInvincible()) {
                this.death(looser);
                winner.getSprite().stop();
            }
        }
    }

    launchCpuAttack(character) {
        if (character.isBarbarian() || character.isDead() || !this.doesScreenIncludeCharacter(character)) {
            return;
        }
        let opponentsInProximity = character.getOpponentsWithinX(this.gameBoard, CPU_ATTACK_RANGE_PIXELS);

        for (let i = 0; i < opponentsInProximity.length; i++) {
            let opponent = opponentsInProximity[i];
            this.launchAttack(character, opponent);
        }
    }

    launchAttack(character, opponent) {
        if (!character.isBarbarian()) {
            this.performAction(character, ATTACK);
        }
    }

    handleMonsterTurnaround(character) {
        if (!character.isBarbarian() && character.shouldTurnaround()) {
            character.setDirection(character.isPastBarbarianLeft() ? RIGHT : LEFT);
            this.performAction(character, WALK);
        }
    }

    handleBoundary(character) {
        if(!character.isBarbarian() || !this.isBarbarianAtBoundary()) {
            return;
        }

        // TODO: come up with a better solution to prevent scroll left on the water screen
        if (this.getScreenNumber() === 3 && character.isAtLeftBoundary()) {
            return;
        }

        if (character.isAtLeftBoundary() && character.getScreenNumber() > 0) {
            this.hideOpponents();
            this.advanceBackdrop(character, RIGHT)
                .then(function() {}, error => handlePromiseError(error));
            this.setScreenNumber(this.getScreenNumber() - 1);
        } else if (character.isAtRightBoundary() &&
            character.getScreenNumber() < TOTAL_SCREENS &&
            this.areAllMonstersDefeated()) {
            this.hideOpponents();
            this.setScreenNumber(this.getScreenNumber() + 1);
            if (this.isScreenDefined(this.getScreenNumber())) {
                this.advanceBackdrop(character, LEFT)
                    .then(function() {}, error => handlePromiseError(error));
            } else {
                setCss(DEMO_OVER_MESSAGE, 'display', 'block');
                character.setStatus(DEAD);
                console.log('c setting screen number to 0');
                this.setScreenNumber(0);
                numLives = 0;
            }
        }

        if (numLives !== 0) {
            // Don't render at rest frame if the game has ended since the screen number context to set it appropriately
            // is no longer set. For example if the game ends while swimming we don't want to render a walking frame.
            this.renderAtRestFrame(character);
        }

        character.setAction(STOP);
    }

    renderAtRestFrame(character) {
        let action = this.isWater() ? SWIM : WALK;
        let position = character.getDirection() === LEFT
            ? character.getFrames(action, character.getDirection()).length
            : 0;

        this.renderSpriteFrame(character, action, character.getDirection(), position);
    }

    renderSpriteFrame(character, requestedAction, direction, position) {
        let heightOffset = character.getHeightOffset(requestedAction, direction) * character.getSprite().height();

        setCharacterCss(character, 'background-position',
            -1*position*character.getSprite().width() + 'px ' + -1*heightOffset + 'px');
    }

    areAllMonstersDefeated() {
        return this.getMonstersOnScreen().filter(m => !m.getCanLeaveBehind() && !m.isDead()).length < 1;
    }

    async advanceBackdrop(character, direction) {
        if (character.isDead()) {
            return;
        }
        game.setActionsLocked(true);

        await this.moveBackdrop(character, direction, false);
        if (this.isWater(this.getScreenNumber())) {
            // Scroll the water up
            await this.moveBackdrop(character, direction, true);
        }

        initializeScreen();
        this.startMonsterAttacks();
        game.setActionsLocked(false);
    }

    hideOpponents() {
        let opponents = this.getMonstersOnScreen();
        for (let opponent of opponents) {
            setCharacterCss(opponent, 'display', 'none');
            setCss(opponent.getDeathSprite(), 'display', 'none');
        }
    }

    async moveBackdrop(character, direction , isVertical) {
        let pixelsPerSecond = isVertical ? ADVANCE_SCREEN_VERTICAL_PIXELS_PER_SECOND : ADVANCE_SCREEN_PIXELS_PER_SECOND;
        let screenDimension = isVertical ? SCREEN_HEIGHT : SCREEN_WIDTH;

        let pixelsPerIteration = pixelsPerSecond / ADVANCE_SCREEN_PIXELS_PER_FRAME;
        let numberOfIterations = screenDimension / pixelsPerIteration;
        let sleepPerIteration = (ADVANCE_SCREEN_DURATION_SECONDS / numberOfIterations) * MILLISECONDS_PER_SECOND;

        let x, y, distance, screenOffset = undefined;
        if (isVertical) {
            y = SCREEN_HEIGHT - character.getSprite().height() / 2;
            distance = Math.abs(y - stripPxSuffix(character.getSprite().css('bottom')));
        } else {
            x = character.getDirection() === RIGHT ? 0 : windowWidth - character.getSprite().width();
            distance = SCREEN_WIDTH - character.getSprite().width();
        }
        let adjustedPixelsPerSecond = distance / ADVANCE_SCREEN_DURATION_SECONDS;
        character.moveToPosition(x, y, adjustedPixelsPerSecond);

        let backgroundPosition = isVertical ? 'background-position-y' : 'background-position-x';
        let currentPosition = parseInt(stripPxSuffix(getCss(BACKDROP, backgroundPosition)));

        for (let i = 0; i < numberOfIterations; i++) {
            let offset = (i + 1) * pixelsPerIteration;
            let directionCompare = isVertical ? UP : RIGHT;
            let position = direction === directionCompare ? (currentPosition + offset) : (currentPosition - offset);

            setCss(BACKDROP, backgroundPosition,position + 'px');
            await sleep(sleepPerIteration);
        }
    }

    getActionsLocked() {
        return this.actionsLocked;
    }

    getBarbarian() {
        return this.barbarian;
    }

    getGameBoard() {
        return this.gameBoard;
    }

    getMonstersOnScreen() {
        return filterBarbarianCharacter(this.getOpponentsOnScreen());
    }

    getOpponentsOnScreen() {
        return this.gameBoard.getOpponents(this.getScreenNumber());
    }

    isWater() {
        return this.gameBoard.isWater(this.getScreenNumber())
    }

    isScreenDefined(screenNumber) {
        if (screenNumber === undefined) {
            throw new Error("setScreenNumber: screenNumber argument is required");
        }
        return this.gameBoard.isScreenDefined(screenNumber);
    }

    doesScreenIncludeCharacter(character) {
        return this.gameBoard.getOpponents(this.barbarian.getScreenNumber()).includes(character);
    }

    getScreenNumber() {
        return this.barbarian.getScreenNumber();
    }

    setScreenNumber(screenNumber) {
        if (screenNumber === undefined) {
            throw new Error("setScreenNumber: screenNumber argument is required");
        }
        return this.barbarian.setScreenNumber(screenNumber);
    }

    showBarbarian() {
        this.barbarian.show();
    }

    hideBarbarian() {
        this.barbarian.hide();
    }

    stopBarbarianMovement() {
        this.barbarian.getSprite().stop();
    }

    getIsPaused() {
        return this.isPaused;
    }

    getIsSoundOn() {
        return this.sounds.getIsSoundOn();
    }

    getPausedFrame() {
        return this.pauseFrame;
    }

    setPauseFrame(flag) {
        if (flag === undefined) {
            throw new Error("setPausedFrame: flag argument is required");
        }
        this.pauseFrame = flag;
    }

    setIsPaused(flag) {
        if (flag === undefined) {
            throw new Error("setIsPaused: flag argument is required");
        }
        this.isPaused = flag;
    }

    setActionsLocked(flag) {
        this.actionsLocked = flag;
    }

    setIsSoundOn(flag) {
        this.sounds.setIsSoundOn(flag);
    }

    isBarbarianDead() {
        return this.barbarian.isDead();
    }

    isBarbarianActionDefined() {
        return this.barbarian.getAction() !== undefined;
    }

    isBarbarianMovingDown() {
        return this.barbarian.isDirectionDown();
    }

    isBarbarianMovingUp() {
        return this.barbarian.isDirectionUp();
    }

    isBarbarianMovingRight() {
        return this.barbarian.isDirectionRight();
    }

    isBarbarianMovingLeft() {
        return this.barbarian.isDirectionLeft();
    }

    isBarbarianFalling() {
        return this.barbarian.isFalling();
    }

    isBarbarianSwimming() {
        return this.barbarian.isSwimming();
    }

    isBarbarianJumping() {
        return this.barbarian.isJumping();
    }

    isBarbarianRunning() {
        return this.barbarian.isRunning();
    }

    isBarbarianAtBoundary() {
        return this.barbarian.isAtRightBoundary() || this.barbarian.isAtLeftBoundary();
    }
}
