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
        this.numLives = 3;

        this.sounds = new Sounds();
        this.messages = new Messages();
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

        if (character.isDying()) {
            this.handleDeath(character);
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

    handleDeath(character) {
        if (character.isBarbarian()) {
            game.setActionsLocked(true);
            setTimeout(function () {
                game.setActionsLocked(false);
                //character.setAction(undefined);
            }, 1000);
        } else {
            character.getDeathSprite().hide();
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
            this.messages.showStartMessage();
            game.setNumLives(game.getNumLives() - 1);
            if (game.getNumLives() < 1) {
                this.messages.showGameOverMessage();
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
            character.getDeathSprite().css('background-position',
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

    showControlMessage() {
        this.messages.showControlMessage();
    }

    showStartMessage() {
        this.messages.showStartMessage();
    }

    hideAllMessages() {
        this.messages.hideAllMessages();
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
            e.css('display', e[0].classList !== message[0].classList ? 'none' : 'block');
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
                DEMO_OVER_MESSAGE.css('display', 'block');
                character.setStatus(DEAD);
                console.log('c setting screen number to 0');
                this.setScreenNumber(0);
                game.setNumLives(0);
            }
        }

        if (game.getNumLives() !== 0) {
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

        character.getSprite().css('background-position',
            -1*position*character.getSprite().width() + 'px ' + -1*heightOffset + 'px');
    }

    areAllMonstersDefeated() {
        return this.getMonstersOnScreen().filter(m => !m.getCanLeaveBehind() && !m.isDead()).length < 1;
    }

    async advanceBackdrop(character, direction) {
        if (character.isDead()) {
            return;
        }
        this.setActionsLocked(true);

        await this.moveBackdrop(character, direction, false);
        if (this.isWater(this.getScreenNumber())) {
            // Scroll the water up
            await this.moveBackdrop(character, direction, true);
        }

        this.initializeScreen();
        this.startMonsterAttacks();
        this.setActionsLocked(false);
    }

    hideOpponents() {
        let opponents = this.getMonstersOnScreen();
        for (let opponent of opponents) {
            opponent.getSprite().css('display', 'none');
            opponent.getDeathSprite().css('display', 'none');
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
        let currentPosition = parseInt(stripPxSuffix(BACKDROP.css(backgroundPosition)));

        for (let i = 0; i < numberOfIterations; i++) {
            let offset = (i + 1) * pixelsPerIteration;
            let directionCompare = isVertical ? UP : RIGHT;
            let position = direction === directionCompare ? (currentPosition + offset) : (currentPosition - offset);

            BACKDROP.css(backgroundPosition,position + 'px');
            await sleep(sleepPerIteration);
        }
    }

    resetBackdrop() {
        BACKDROP.css('background-position', '0px 0px');
    }

    resetGame() {
        this.renderAtRestFrame(this.getBarbarian());

        if (this.getNumLives() < 1) {
            this.resetGameOver();
        } else {
            $('.life' + this.getNumLives()).css('display', 'none');
            this.hideAllMessages();
        }
        this.resetSpritePositions();
        this.initializeScreen();
    }

    /**
     * Reset all the sprite positions.
     */
    resetSpritePositions() {
        let characters = new Array(this.getBarbarian());
        for (let scrNum of this.gameBoard.getScreenNumbers()) {
            //let screen = SCREENS[scrNum];
            for (let opponent of this.getMonstersOnScreen()) {
                characters.push(opponent);
            }
        }

        this.showBarbarian();


        let spritesOnScreen = this.getOpponentsOnScreen();
        for (const character of characters) {
            let isSpriteOnScreen = $.inArray(character, spritesOnScreen) !== -1;
            character.setAction(character.getResetAction());
            character.setDirection(character.getResetDirection());
            character.setStatus(character.getResetStatus());
            character.getSprite().css('display', isSpriteOnScreen ? 'block' : 'none');
            character.getSprite().css('left',  character.getResetLeft() + 'px');
            character.getSprite().css('bottom', character.getResetBottom(this.getBarbarian().getScreenNumber()) + 'px');
        }
    }

    initializeScreen() {

        if (this.isWater()) {
            this.performAction(this.getBarbarian(), SWIM);
        }

        let monsters = this.getMonstersOnScreen();

        for (let monster of monsters) {
            monster.getSprite().css('left', monster.getResetLeft() + 'px');
            monster.getSprite().css('bottom', monster.getResetBottom(this.getScreenNumber()) + 'px');
            monster.getSprite().css('filter', "brightness(100%)");
            monster.setStatus(DEAD);
        }
    }

    setBackdrop() {
        BACKDROP.css('background-position', -1* SCREEN_WIDTH * this.getScreenNumber() + 'px 0px');
    }

    setViewPort() {
        let viewportMeta = document.querySelector('meta[name="viewport"]');

        let width = $(window).width();
        let height = $(window).height();

        let scalingDimension = undefined;
        if (width > height) {
            scalingDimension = width;
        } else {
            scalingDimension = height - 50;
        }

        viewportMeta.content = viewportMeta.content.replace(/initial-scale=[^,]+/, 'initial-scale=' + (scalingDimension / 1400));

        $(window).orientationchange(function(event) {

            viewportMeta.content = viewportMeta.content.replace(/initial-scale=[^,]+/, 'initial-scale=' + (scalingDimension / 1400));
            viewportMeta.content = viewportMeta.content.replace(/width=[^,]+/, 'width=' + width);
            viewportMeta.content = viewportMeta.content.replace(/height=[^,]+/, 'height=' + height);
        });
    }


    resetGameOver() {
        console.log('resetting game over');
        this.setNumLives(3);
        this.getBarbarian().setScreenNumber(0);
        this.getBarbarian().setDirection(RIGHT);
        this.getBarbarian().setAction(undefined);
        this.getBarbarian().setVerticalDirection(undefined);
        this.renderAtRestFrame(this.getBarbarian());
        this.resetBackdrop();

        for (let opponent of this.getAllMonsters()) {
            console.log('==> hiding' + opponent.getCharacterType());
            opponent.hide();
        }

        for (let i = 1; i < this.getNumLives(); i++) {
            $('.life' + i).css('display', 'block');
        }
        this.hideAllMessages();
    }

    getActionsLocked() {
        return this.actionsLocked;
    }

    getNumLives() {
        return this.numLives;
    }

    getBarbarian() {
        return this.barbarian;
    }

    getGameBoard() {
        return this.gameBoard;
    }

    getMonstersOnScreen() {
        return this.getOpponentsOnScreen().filter(character => !character.isBarbarian());
    }

    getAllMonsters() {
        return this.gameBoard.getAllMonsters();
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

    setNumLives(number) {
        this.numLives = number;
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
