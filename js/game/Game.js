const MIN_ATTACK_THRESHOLD = 3;
const MAX_ATTACK_THRESHOLD = 4;
const JUST_DIED_THRESHOLD = 500;
const DEATH_DELAY = 2000;

/**
 * Main class to support playing the Barbarian game
 */
class Game {
    /**
     * Constructor for Game class
     * @param barbarian the main character
     * @param gameBoard the game board
     */
    constructor(barbarian, gameBoard) {
        validateRequiredParams(this.constructor, arguments, 'barbarian', 'gameBoard');

        this.barbarian = barbarian;
        this.gameBoard = gameBoard;
        this.pauseFrame = 0;
        this.actionsLocked = false;
        this.numLives = 3;

        this.sounds = new Sounds();
        this.messages = new Messages();
    }

    /**
     * Performs an action for the character. Actions include WALK, RUN, ATTACK, STOP, SWIM, DEATH, FALL, SIT etc.
     * @param character the character to perform the aciton for
     * @param action the action to perform
     * @param frame optional starting frame for the action used to resume an action that was stopped
     */
    performAction(character, action, frame = 0) {
        validateRequiredParams(this.performAction, arguments, 'character', 'action');

        character.getAnimator().stopMovement();

        if (this.isTransitionFromTerminalAction(character, action)) {
            action = character.getAction();
        }

        character.setAction(action);

        let self = this;

        character.getAnimator().animate(this.gameBoard, action,
            character.getHorizontalDirection(),
            character.getVerticalDirection(),
            character.getProperties().getActionNumberOfTimes(action),
            frame).then(function(frame) {
                self.handleActionInterruption(character, action, frame);
        }).catch(function(error) {
            handlePromiseError(error);
        });
    }

    /**
     * Get the messages object.
     * @returns {Messages} the messages object
     */
    getMessages() {
        return this.messages;
    }

    /**
     * Get the sounds object.
     * @returns {Sounds} the sounds object
     */
    getSounds() {
        return this.sounds;
    }

    /**
     * Get the game board.
     * @returns {GameBoard} the game board.
     */
    getGameBoard() {
        return this.gameBoard;
    }

    /**
     * Starts the monster attacks for the current screen.
     * @param unpausing true if the action is trigged from an un pause event
     */
    startMonsterAttacks(unpausing = false) {
        let monsters = this.getMonstersOnScreen()
            // Don't restart the monster if unpausing and the monster is already dead
            .filter(monster => !(monster.isDead() && unpausing));

        for (let monster of monsters) {
            monster.show();
            monster.setStatus(ALIVE_LABEL);
            this.sounds.playSound(monster.getProperties().getSound());
            monster.setVerticalDirection(Fighting.getCpuVerticalChaseDirection(monster));
            this.performAction(monster, monster.getProperties().getDefaultAction());
        }
    }

    /**
     * Initializes the current screen to ready it for playing.
     */
    initializeScreen() {

        if (this.gameBoard.isWater(this.getScreenNumber())) {
            this.performAction(this.getBarbarian(), SWIM_LABEL);
        }

        let monsters = this.getMonstersOnScreen();

        for (let monster of monsters) {
            monster.getProperties().getSprite().css('left', monster.getProperties().getDefaultX() + 'px');
            monster.getProperties().getSprite().css('bottom', monster.getProperties().getDefaultY(this.getScreenNumber()) + 'px');
            monster.getProperties().getSprite().css('filter', "brightness(100%)");
            monster.setStatus(DEAD_LABEL);
        }
    }

    /**
     * Gets the backdrop element.
     * @returns {jQuery|HTMLElement}
     */
    getBackdrop() {
        return $('.backdrop');
    }

    /**
     * Sets the backdrop offset to the current screen.
     */
    setBackdrop() {
        this.getBackdrop().css('background-position', -1* SCREEN_WIDTH * this.getScreenNumber() + 'px 0px');
    }

    /**
     * Resets the game and readies it for play.
     */
    resetGame() {
        this.getBarbarian().renderAtRestFrame(this.gameBoard);

        if (this.getNumLives() < 1) {
            this.resetGameOver();
        } else {
            $('.life' + this.getNumLives()).css('display', 'none');
            this.messages.hideAllMessages();
        }
        this.resetSpritePositions();
        this.initializeScreen();
    }

    /**
     * Sets the viewport to support mobile viewing.
     */
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

        viewportMeta.content = viewportMeta.content.replace(/initial-scale=[^,]+/,
            'initial-scale=' + (scalingDimension / 1400));

        $(window).orientationchange(function(event) {

            viewportMeta.content = viewportMeta.content.replace(/initial-scale=[^,]+/,
                'initial-scale=' + (scalingDimension / 1400));
            viewportMeta.content = viewportMeta.content.replace(/width=[^,]+/,
                'width=' + width);
            viewportMeta.content = viewportMeta.content.replace(/height=[^,]+/,
                'height=' + height);
        });
    }

    /* private */
    handleActionInterruption(character, requestedAction, frame) {

        if (this.getIsPaused() && character.isBarbarian()) {
            this.handlePause(character, frame);
        }
        if ((!character.isActionInfinite(requestedAction) && character.getAction() === requestedAction)
            || this.getIsPaused()) {
            this.handleFiniteAnimations(character, requestedAction);
        }
        if (character.isAction(DEATH_LABEL)) {
            this.handleDeath(character);
        }
        if (Obstacle.isAtBoundary(character, this.gameBoard)) {
            this.handleBoundary(character);
        }
        if (Fighting.shouldCpuChase(character, this.gameBoard)) {
            this.handleCpuChase(character);
        }
        if (Fighting.shouldCpuLaunchAttack(character, this.gameBoard)) {
            this.handleCpuAttack(character)
        }
        if (Fighting.shouldCpuFight(character, this.gameBoard)) {
            this.handleFightSequence(character);
        }
        if (character.getObstacles().didCharacterHitObstacle(character)) {
            this.handleObstacle(character, requestedAction);
        }
        if (this.barbarian.isDead()) {
            this.handleEndingSequence(character);
        }
    }

    /* private */
    handleEndingSequence(character) {
        // If the Barbarian has been defeated make the monster continue to move for a bit. Make sure the monster stops
        // moving before the death delay has expired so that it is not moving when when the game is reset to prevent
        // doubling up on the monster's movement
        if (!character.isBarbarian() && this.barbarian.isDead() && !(character.isAction(WALK_LABEL)
            || character.isAction(SIT_LABEL))) {
            if (character.getProperties().getDefaultAction() === WALK_LABEL) {
                this.performAction(character, WALK_LABEL);
            } else if (character.getProperties().getDefaultAction() === SIT_LABEL) {
                this.performAction(character, SIT_LABEL);
            }
            let self = this;
            setTimeout(function () {
                let monstersOnScreen = self.getMonstersOnScreen();
                for (let monster of monstersOnScreen) {
                    monster.setStatus(DEAD_LABEL);
                    monster.getAnimator().stopMovement();
                }
            }, DEATH_DELAY - 1000);
        }

    }

    /* private */
    isTransitionFromTerminalAction(character, action) {
        return character.isBarbarian() && character.getAction() !== action && TERMINAL_ACTIONS.has(character.getAction());
    }

    /* private */
    handlePause(character, frame) {
        // Save the frame if the game was paused so the animation can be resumed at the right place
        game.setPauseFrame(frame);
    }

    /* private */
    handleFiniteAnimations(character, requestedAction) {
        character.getProperties().getSprite().stop();
    }

    /* private */
    handleDeath(character) {
        if (character.isBarbarian()) {
            game.setActionsLocked(true);
            setTimeout(function () {
                game.setActionsLocked(false);
                //character.setAction(undefined);
            }, DEATH_DELAY);
        } else {
            character.getProperties().getDeathSprite().hide();
        }

    }

    /* private */
    handleObstacle(character, requestedAction) {
        let obstacle = character.getObstacles().getCharacterObstacle(character);
        if (obstacle !== undefined ) {
            character.getProperties().getSprite().stop();

            if (obstacle.getIsElevation()) {
                if (obstacle.isTraversableDownhillElevation(character)) {
                    character.setY(obstacle.getHeight());
                    // Continue whatever action the character was performing since they traversed the elevation
                    this.performAction(character, requestedAction, character.getCurrentFrame(requestedAction));
                } else if (obstacle.didCharacterJumpEvade(character)) {
                    character.setY(obstacle.getHeight());
                    // Transition to walking motion since the jump was successful
                    console.log('continuing walk after jump evading');
                    this.performAction(character, WALK_LABEL);
                } else if (character)  {
                    // reset action so character can jump again
                    character.setAction(undefined);
                    // Hit elevation and did not avoid, let the character remain stopped and render at rest frame
                    character.renderAtRestFrame(this.gameBoard);
                }
            } else if (obstacle.getIsPit() && character.isBarbarian()) {
                if (requestedAction !== FALL_LABEL) {
                    character.setAction(FALL_LABEL);
                    this.death(character);
                }
            }
        }
    }

    /* private */
    death(character) {
        character.setStatus(DEAD_LABEL);

        if (character.isBarbarian()) {
            game.setNumLives(game.getNumLives() - 1);
            game.getNumLives() < 1 ? this.messages.showGameOverMessage() : this.messages.showStartMessage();
            character.getAction() === FALL_LABEL ? this.sounds.playFallSound() : this.sounds.playGruntSound();
        } else {
            this.sounds.playFireSound();
        }

        let action = this.gameBoard.isWater(this.getScreenNumber()) ? SINK_LABEL
                                    : character.isAction(FALL_LABEL) ? FALL_LABEL : DEATH_LABEL;
        this.performAction(character, action);

        if (action === FALL_LABEL || action === SINK_LABEL && character.isBarbarian()) {
            // lock the Barbarians actions while it is falling or sinking. We also need the monsters to have an
            // opportunity to stop before the game is restarted so the minimum lock time will be a little more than the
            // death delay
            let lockActionsTime = Math.max(DEATH_DELAY + 500,
                character.getY() / character.getProperties().getPixelsPerSecond(FALL_LABEL) * MILLISECONDS_PER_SECOND);

            let self = this;
            this.setActionsLocked(true);
            setTimeout(function () {
                character.hide();
                self.setActionsLocked(false);
            },  lockActionsTime);
        }
    }

    /* private */
    handleFightSequence(character) {
        if (character.isBarbarian() || character.isDead() || !this.doesScreenIncludeCharacter(character)) {
            return;
        }
        let opponentsInProximity = Fighting.getOpponentsWithinX(character, this.gameBoard, FIGHTING_RANGE_PIXELS);

        for (let i = 0; i < opponentsInProximity.length; i++) {
            let opponent = opponentsInProximity[i];

            let opponentAction = opponent.getAction();
            let opponentCurrentFrame = opponent.getCurrentFrame(opponentAction);

            let didOpponentWin = Fighting.didOpponentWinFight(opponent, character);
            let winner = didOpponentWin ? opponent : character;
            let looser = didOpponentWin ? character : opponent;

            if (!looser.isDead() && !looser.getProperties().getIsInvincible()) {
                this.death(looser);
                winner.getProperties().getSprite().stop();
            }
        }
    }

    /* private */
    handleCpuAttack(character) {
        if (character.isBarbarian() || character.isDead() || !this.doesScreenIncludeCharacter(character)) {
            return;
        }
        let opponentsInProximity = Fighting.getOpponentsWithinX(character, this.gameBoard, CPU_ATTACK_RANGE_PIXELS);

        for (let opponent of opponentsInProximity) {
            if (!character.isBarbarian()) {
                if (character.getProperties().getCanHighlight()) {
                    character.getProperties().getSprite().css('filter', "brightness(300%)");
                }
                this.performAction(character, ATTACK_LABEL);
            }
        }
    }

    /* private */
    handleCpuChase(character) {
        if (!character.isBarbarian() && Fighting.shouldCpuChase(character, this.gameBoard)) {

            if (this.gameBoard.isWater(this.getScreenNumber()) && !character.isBarbarian()) {
                // Make water monsters chase the barbarian vertically
                character.setVerticalDirection(Fighting.getCpuVerticalChaseDirection(character));
            }

            let oppositeDirection = character.isFacingLeft() ? RIGHT_LABEL : LEFT_LABEL;
            character.setDirection(Obstacle.isPastCharacter(character, character.getBarbarian())
                ? oppositeDirection : character.getHorizontalDirection());
            if (character.getProperties().getCanHighlight()) {
                character.getProperties().getSprite().css('filter', "brightness(100%)");
            }
            this.performAction(character, game.gameBoard.isWater(this.getScreenNumber()) ? SWIM_LABEL
                                                                                                : WALK_LABEL);
        }
    }

    /* private */
    handleBoundary(character) {
        if(!character.isBarbarian()) {
            return;
        }

        if (this.gameBoard.canScroll(character, this.areAllMonstersDefeated())) {
            if (this.loadScreen(character)) {
                this.handleGameOver(character);
            }
        }

        if (this.getNumLives() > 0) {
            // Don't render at rest frame if the game is over. Barbarian might be in the water and an at rest frame
            // would look awkward.
            character.renderAtRestFrame(this.gameBoard);
        }

        character.setAction(STOP_LABEL);
    }

    /**
     * private. Returns true if it is the last screen
     */
    loadScreen(character) {
        this.hideOpponents();
        this.setScreenNumber(this.getScreenNumber() + (character.isFacingLeft() ? -1 : 1));
        if (this.isScreenDefined(this.getScreenNumber())) {
            this.advanceBackdrop(character, character.isFacingLeft() ? RIGHT_LABEL : LEFT_LABEL)
                .then(function() {}, error => handlePromiseError(error));
            return false;
        } else {
            return true;
        }
    }

    handleGameOver(character) {
        character.setStatus(DEAD_LABEL);
        //character.hide();
        this.messages.showGameWonMessage();
        this.setScreenNumber(0);
        this.setNumLives(0);
        this.setActionsLocked(true);
        let self = this;
        // Wait for the ending sequence to finish to all all the monsters to stop before starting over
        setTimeout(function () {
            self.setActionsLocked(false);
        }, DEATH_DELAY)
    }

    /* private */
    areAllMonstersDefeated() {
        return this.getMonstersOnScreen().filter(m => !m.getProperties().getCanLeaveBehind() && !m.isDead()).length < 1;
    }

    /* private */
    async advanceBackdrop(character, direction) {
        if (character.isDead()) {
            return;
        }
        this.setActionsLocked(true);

        await this.moveBackdrop(character, direction, false);
        if (this.gameBoard.isWater(this.getScreenNumber())) {
            // Scroll the water up
            await this.moveBackdrop(character, direction, true);
        }

        this.initializeScreen();
        this.startMonsterAttacks();
        this.setActionsLocked(false);
    }

    /* private */
    hideOpponents() {
        let opponents = this.getMonstersOnScreen();
        for (let opponent of opponents) {
            opponent.getProperties().getSprite().css('display', 'none');
            opponent.getProperties().getDeathSprite().css('display', 'none');
        }
    }

    /* private */
    async moveBackdrop(character, direction , isVertical) {
        let pixelsPerSecond = isVertical ? ADVANCE_SCREEN_VERTICAL_PIXELS_PER_SECOND : ADVANCE_SCREEN_PIXELS_PER_SECOND;
        let screenDimension = isVertical ? SCREEN_HEIGHT : SCREEN_WIDTH;

        let pixelsPerIteration = pixelsPerSecond / ADVANCE_SCREEN_PIXELS_PER_FRAME;
        let numberOfIterations = screenDimension / pixelsPerIteration;
        let sleepPerIteration = (ADVANCE_SCREEN_DURATION_SECONDS / numberOfIterations) * MILLISECONDS_PER_SECOND;

        let x, y, distance, screenOffset = undefined;
        if (isVertical) {
            y = SCREEN_HEIGHT - character.getProperties().getSprite().height() / 2;
            distance = Math.abs(y - stripPxSuffix(character.getProperties().getSprite().css('bottom')));
        } else {
            x = character.isFacingRight() ? 0 : SCREEN_WIDTH -
                character.getProperties().getSprite().width();
            distance = SCREEN_WIDTH - character.getProperties().getSprite().width();
        }
        let adjustedPixelsPerSecond = distance / ADVANCE_SCREEN_DURATION_SECONDS;
        character.getAnimator().moveElementToPosition(x, y, adjustedPixelsPerSecond);

        let backgroundPosition = isVertical ? 'background-position-y' : 'background-position-x';
        let currentPosition = parseInt(stripPxSuffix(this.getBackdrop().css(backgroundPosition)));

        for (let i = 0; i < numberOfIterations; i++) {
            let offset = (i + 1) * pixelsPerIteration;
            let directionCompare = isVertical ? UP_LABEL : RIGHT_LABEL;
            let position = direction === directionCompare ? (currentPosition + offset) : (currentPosition - offset);

            this.getBackdrop().css(backgroundPosition,position + 'px');
            await sleep(sleepPerIteration);
        }
    }

    /* private */
    resetBackdrop() {
        this.getBackdrop().css('background-position', '0px 0px');
    }

    /* private */
    resetSpritePositions() {
        let characters = new Array(this.getBarbarian());
        for (let scrNum of this.gameBoard.getScreenNumbers()) {
            //let screen = SCREENS[scrNum];
            for (let opponent of this.getMonstersOnScreen()) {
                characters.push(opponent);
            }
        }

        this.barbarian.show();

        let spritesOnScreen = this.getOpponentsOnScreen();
        for (const character of characters) {
            let isSpriteOnScreen = $.inArray(character, spritesOnScreen) !== -1;
            character.getProperties().getDeathSprite().hide();
            character.setAction(character.getProperties().getDefaultAction());
            character.setDirection(character.getProperties().getDefaultHorizontalDirection());
            character.setStatus(character.getProperties().getDefaultStatus());
            character.getProperties().getSprite().css('display', isSpriteOnScreen ? 'block' : 'none');
            character.getProperties().getSprite().css('left',  character.getProperties().getDefaultX() + 'px');
            character.getProperties().getSprite().css('bottom',
                character.getProperties().getDefaultY(this.getBarbarian().getScreenNumber()) + 'px');
        }
    }

    /* private */
    resetGameOver() {
        this.setNumLives(3);
        this.getBarbarian().setScreenNumber(0);
        this.getBarbarian().setDirection(RIGHT_LABEL);
        this.getBarbarian().setAction(undefined);
        this.getBarbarian().setVerticalDirection(undefined);
        this.getBarbarian().renderAtRestFrame(this.gameBoard);
        this.resetBackdrop();

        for (let opponent of this.getAllMonsters()) {
            opponent.hide();
        }

        for (let i = 1; i < this.getNumLives(); i++) {
            $('.life' + i).css('display', 'block');
        }
        this.messages.hideAllMessages();
    }

    /* private */
    getMonstersOnScreen() {
        return this.getOpponentsOnScreen().filter(character => !character.isBarbarian());
    }

    /* private */
    getAllMonsters() {
        return this.gameBoard.getAllMonsters();
    }

    /* private */
    getOpponentsOnScreen() {
        return this.gameBoard.getOpponents(this.getScreenNumber());
    }

    /* private */
    isScreenDefined(screenNumber) {
        if (screenNumber === undefined) {
            throw new Error("setScreenNumber: screenNumber argument is required");
        }
        return this.gameBoard.isScreenDefined(screenNumber);
    }

    /* private */
    doesScreenIncludeCharacter(character) {
        return this.gameBoard.getOpponents(this.barbarian.getScreenNumber()).includes(character);
    }

    /* private */
    getScreenNumber() {
        return this.barbarian.getScreenNumber();
    }

    /* private */
    setScreenNumber(screenNumber) {
        if (screenNumber === undefined) {
            throw new Error("setScreenNumber: screenNumber argument is required");
        }
        return this.barbarian.setScreenNumber(screenNumber);
    }

    /* Getters */
    getActionsLocked() {
        return this.actionsLocked;
    }

    getNumLives() {
        return this.numLives;
    }

    getBarbarian() {
        return this.barbarian;
    }

    getIsPaused() {
        return this.gameBoard.getIsPaused();
    }

    getPausedFrame() {
        return this.pauseFrame;
    }

    /* Setters */
    setPauseFrame(flag) {
        if (flag === undefined) {
            throw new Error("setPausedFrame: flag argument is required");
        }
        this.pauseFrame = flag;
    }

    setIsPaused(flag) {
        this.gameBoard.setIsPaused(flag);
    }

    setActionsLocked(flag) {
        if (flag === undefined) {
            throw new Error("setActionsLocked: flag argument is required");
        }
        this.actionsLocked = flag;
    }

    setNumLives(number) {
        if (number === undefined) {
            throw new Error("SetNumLives: the number argument is required")
        }
        this.numLives = number;
    }

    setIsSoundOn(flag) {
        if (flag === undefined) {
            throw new Error("setIsSoundOn: the flag argument is required");
        }
        this.sounds.setIsSoundOn(flag);
    }
}
