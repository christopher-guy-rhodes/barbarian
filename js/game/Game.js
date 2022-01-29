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

        this.numLives = 10;

        this.sounds = new Sounds();
        this.messages = new Messages();
    }

    /**
     * Performs an action for the character. Actions include WALK, RUN, ATTACK, STOP, SWIM, DEATH, FALL, SIT etc.
     * @param character the character to perform the aciton for
     * @param action the action to perform
     * @param frame optional starting frame for the action used to resume an action that was stopped
     * @param uninterruptable set to run thru the animation sequence without interruption
     */
    performAction(character, action, frame = 0, uninterruptable = false) {
        validateRequiredParams(this.performAction, arguments, 'character', 'action');

        this.handleSound(character, action);

        // Lock the Barbarian action immediately if he is dying to address the race condition of the game being
        // restarted while he is going thru the dying sequence.
        if (character.isBarbarian() && action === DEATH_LABEL) {
            let self = this;
            this.gameBoard.setActionsLocked(true);
            setTimeout(function () {
                if (self.gameBoard.getActionsLocked()) {
                    // Unlock action if they are still locked in case this ran before the death sequence
                    self.gameBoard.setActionsLocked(false);
                }
            }, DEATH_DELAY)
        }

        // Stop the movement, delayed if the character is on ice
        this.stopMovement(character, action);

        if (this.isTransitionFromTerminalAction(character, action)) {
            action = character.getAction();
        }

        character.setAction(action);

        let self = this;

        character.getAnimator().animate(this.gameBoard, this.sounds, action,
            character.getHorizontalDirection(),
            character.getVerticalDirection(),
            character.getProperties().getActionNumberOfTimes(action),
            frame, uninterruptable).then(function(frame) {
                self.handleActionInterruption(character, action, character.getHorizontalDirection(), frame);
        }).catch(function(error) {
            handlePromiseError(error);
        });
    }

    /**
     * Show or hide the sprites on the screen. Used for loading all the sprites before the game plays to prevent latency
     * of sprite loading while playing. Will not hide a sprite if it is set to appear on the current screen.
     * @param show show the sprites if set, hide otherwise.
     */
    screenWarmup(show) {
        let opponents = this.gameBoard.getAllOpponents();
        for (let opponent of opponents) {
            if (opponent.isBarbarian()) {
                continue;
            }
            if (show) {
                opponent.getProperties().getSprite().show();
                opponent.getProperties().getDeathSprite().show();
            } else if (!opponent.isOnScreen(this.gameBoard)) {
                opponent.getProperties().getSprite().hide();
                opponent.getProperties().getDeathSprite().hide();
            }
        }
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
     * Get the Barbarian character.
     * @returns {Character} the Barbarian character
     */
    getBarbarian() {
        return this.barbarian;
    }

    /**
     * Get the screen the Barbarian is currently on.
     * @returns {number} the screen the Barbarian is on.
     */
    getScreenNumber() {
        return this.barbarian.getScreenNumber();
    }

    /**
     * Starts the monster attacks for the current screen.
     * @param secondaryMonsters secondary monsters (monsters launched by monsters) to use instead of onscreen monsters
     * @param unpausing true if the action is triggered from an un pause event
     */
    startMonsterAttacks(secondaryMonsters, unpausing = false) {
        let monsters = secondaryMonsters !== undefined
            ? secondaryMonsters
            : this.gameBoard.getMonstersOnScreen(this.getScreenNumber())
                // Don't restart the monster if unpausing and the monster is already dead
                .filter(monster => !(monster.isDead() && unpausing));

        for (let monster of monsters) {
            if (secondaryMonsters === undefined && monster.getProperties().getIsSecondaryMonster()) {
                // Don't launch a secondary monster attack unless secondary monsters were passed in
                continue;
            }
            monster.show();
            monster.setStatus(ALIVE_LABEL);
            monster.setVerticalDirection(Fighting.getCpuVerticalChaseDirection(monster));
            let action = monster.getAction() === undefined || monster.getAction() === DEATH_LABEL
                ? monster.getProperties().getDefaultAction()
                : monster.getAction();
            this.performAction(monster, action, monster.getCurrentFrameIndex(action));
        }
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
        this.gameBoard.resetSpritePositions(this.getBarbarian());
        this.gameBoard.initializeScreen(this.getScreenNumber());
        // Perform a stop action for the Barbarian so that he has a frame target
        this.performAction(this.getBarbarian(), STOP_LABEL);
        this.getBarbarian().getAnimator().stopMovement();
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
    handleSound(character, action) {
        if (action === ATTACK_LABEL && character.getProperties().getSound() !== undefined &&
            !character.getBarbarian().isDead()) {
            this.sounds.playSound(character.getProperties().getSound());
        }
    }

    /* private */
    stopMovement(character, action) {
        if (this.gameBoard.isIce(character.getScreenNumber())) {
            // Delay the stop/change of direction for the Barbarian on the ice
            if (character.isBarbarian() && (character.isAction(WALK_LABEL) && action === WALK_LABEL ||
                character.isAction(RUN_LABEL) && action === RUN_LABEL ||
                !character.isAction(STOP_LABEL) && action === STOP_LABEL)) {
                let self = this;
                character.setIsSliding(true);
                // Delay the motion stop since we are on ice to produce a sliding effect
                setTimeout(function () {
                    if (character.getAnimator().getIsMovementComplete()) {
                        // The character movement completed, there is nothing to stop after the slide
                        character.getAnimator().setIsMovementComplete(false);
                    } else {
                        // Stop movement post slide unless the character is not stopping and have not requested a stop.
                        // This allows a character to "break out of a stop slide" to perform another.
                        if(character.isAction(STOP_LABEL) || action !== STOP_LABEL && !character.getAnimator().getIsMovementComplete()) {
                            character.getAnimator().stopMovement();
                        }
                    }
                    character.setIsSliding(false);
                }, 750);
            } else {
                character.getAnimator().stopMovement();
            }
        } else {
            character.getAnimator().stopMovement();
        }
    }

    /* private */
    handleActionInterruption(character, requestedAction, requestedDirection, frame) {
        if (Fighting.wasBarbarianTargetedByCharacter(character, character.getBarbarian(), requestedAction, requestedDirection, frame)) {
            this.handleTargetDefeat(character, frame);
        }
        if ((!character.isActionInfinite(requestedAction) && character.getAction() === requestedAction)
            || this.gameBoard.getIsPaused()) {
            this.handleFiniteAnimations(character, requestedAction);
        }
        if (character.isAction(DEATH_LABEL)) {
            this.handleDeath(character);
        }
        if (Obstacle.isStoppedByBoundary(character, this.gameBoard)) {
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
        if (Fighting.shouldDragonBreatheFire(character, frame)) {

            this.handleFireballAttack(character);
        }
    }

    /* private */
    handleFireballAttack(character) {
        if (character.isAction(ATTACK_LABEL)) {
            this.performAction(character, ATTACK_LABEL, 1);
        } else if (character.isAction(SIT_LABEL)) {
            this.performAction(character, SIT_LABEL, 22);
        } else {
            return;
        }

        if (FIREBALL_CHARACTER.isDead()) {
            FIREBALL_CHARACTER.setDirection(character.getHorizontalDirection());
            this.gameBoard.initializeMonster(FIREBALL_CHARACTER, this.getScreenNumber());
            FIREBALL_CHARACTER.setX((FIREBALL_CHARACTER.getHorizontalDirection() === LEFT_LABEL
                ? character.getX()
                : character.getX() + character.getWidth()) + 'px');
            this.startMonsterAttacks([FIREBALL_CHARACTER]);

        }
    }

    /* private */
    handleTargetDefeat(character, frame) {
        this.death(character.getBarbarian());
        this.performAction(character, character.getProperties().getDefaultAction(), frame);
    }

    /* private */
    handleEndingSequence(character) {
        // If the Barbarian has been defeated make the monster continue to move for a bit. Make sure the monster stops
        // moving before the death delay has expired so that it is not moving when when the game is reset to prevent
        // doubling up on the monster's movement
        if (!character.isBarbarian() && this.barbarian.isDead()) {
            let self = this;
            setTimeout(function () {
                let monstersOnScreen = self.gameBoard.getMonstersOnScreen(self.getScreenNumber());
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
    handlePause(character, frameIndex) {
        // Save the frame if the game was paused so the animation can be resumed at the right place
        character.setPauseFrameIndex(frameIndex)
    }

    /* private */
    handleFiniteAnimations(character, requestedAction) {
        character.getAnimator().stopMovement();
    }

    /* private */
    handleDeath(character) {
        let self = this;
        if (character.isBarbarian()) {
            this.getGameBoard().setActionsLocked(true);
            setTimeout(function () {
                self.getGameBoard().setActionsLocked(false);
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
            character.getAnimator().stopMovement();

            if (obstacle.getIsElevation()) {
                if (obstacle.isTraversableDownhillElevation(character)) {
                    character.setY(obstacle.getHeight());
                    // Continue whatever action the character was performing since they traversed the elevation
                    this.performAction(character, requestedAction, character.getCurrentFrameIndex(requestedAction));
                } else if (obstacle.didCharacterJumpEvade(character, requestedAction)) {
                    character.setY(obstacle.getHeight());
                    // Transition to walking motion since the jump was successful
                    this.performAction(character, WALK_LABEL);
                } else if (character)  {
                    // reset action so character can jump again
                    character.setAction(STOP_LABEL);
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
            character.getAction() === FALL_LABEL ? this.sounds.playSound(FALL_SOUND) : this.sounds.playSound(GRUNT_SOUND);
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
            this.getGameBoard().setActionsLocked(true);
            setTimeout(function () {
                character.hide();
                self.getGameBoard().setActionsLocked(false);
            },  lockActionsTime);
        }
    }

    /* private */
    handleFightSequence(character) {
        if (character.isBarbarian() || character.isDead() ||
            !this.gameBoard.doesScreenIncludeCharacter(character, this.getScreenNumber())) {
            return;
        }
        let opponentsInProximity = Fighting.getOpponentsWithinX(character, this.gameBoard, FIGHTING_RANGE_PIXELS);

        for (let i = 0; i < opponentsInProximity.length; i++) {
            let opponent = opponentsInProximity[i];

            let opponentAction = opponent.getAction();
            let opponentCurrentFrame = opponent.getCurrentFrameIndex(opponentAction);

            let didOpponentWin = Fighting.didOpponentWinFight(opponent, character);
            let winner = didOpponentWin ? opponent : character;
            let looser = didOpponentWin ? character : opponent;

            if (!looser.isDead() && !looser.getProperties().getIsInvincible()) {
                this.sounds.stopSound(winner.getProperties().getSound());
                this.sounds.stopSound(looser.getProperties().getSound());
                this.death(looser);
                if (!winner.isBarbarian()) {
                    this.performAction(winner, winner.getAction());
                }
            }
        }
    }

    /* private */
    handleCpuAttack(character) {
        if (character.isBarbarian() || character.isDead() ||
            !this.gameBoard.doesScreenIncludeCharacter(character, this.getScreenNumber())) {
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
        if (!character.isBarbarian()) {
            if (!character.getProperties().getCanTurnAround()) {
                character.setStatus(DEAD_LABEL);
                character.hide();
            }
        }
        if(!character.isBarbarian() || character.getBarbarian().isDead()) {
            return;
        }

        if (this.gameBoard.canScroll(character)) {
            if (this.loadScreen(character)) {
                this.handleGameOver(character);
            }
        }

        if (this.getNumLives() > 0) {
            // Don't render at rest frame if the game is over. Barbarian might be in the water and an at rest frame
            // would look awkward.
            character.renderAtRestFrame(this.gameBoard);
        }
    }

    /**
     * private. Returns true if it is the last screen
     */
    loadScreen(character) {
        let self = this;
        this.gameBoard.hideMonsters(this.getScreenNumber());

        let monsters = this.gameBoard.getMonstersOnScreen(this.getScreenNumber());
        for (let monster of monsters) {
            this.sounds.stopSound(monster.getProperties().getSound());
        }

        this.setScreenNumber(this.getScreenNumber() + (character.isFacingLeft() ? -1 : 1));


        if (this.gameBoard.isScreenDefined(this.getScreenNumber())) {
            if (this.gameBoard.isWater(this.getScreenNumber())) {
                this.sounds.playSound(SPLASH_SOUND);
            }
            this.gameBoard.advanceBackdrop(character, character.isFacingLeft() ? RIGHT_LABEL : LEFT_LABEL,
                this.getScreenNumber(), async function() {
                    self.performAction(character, JUMP_LABEL, character.getProperties().getActionNumberOfTimes(JUMP_LABEL), true);
                })
                .then(function() {
                    self.startScreenActions();
                }, error => handlePromiseError(error));
            return false;
        } else {
            return true;
        }
    }

    startScreenActions() {
        if (this.gameBoard.isWater(this.getScreenNumber())) {
            this.performAction(this.getBarbarian(), SWIM_LABEL);
        }
        this.getBarbarian().getAnimator().setIsMovementComplete(false);
        this.getBarbarian().setAction(STOP_LABEL);
        this.gameBoard.initializeScreen(this.getScreenNumber());
        this.startMonsterAttacks();
    }

    /* private */
    handleGameOver(character) {
        character.setStatus(DEAD_LABEL);
        this.messages.showGameWonMessage();
        this.setScreenNumber(0);
        this.setNumLives(0);
        this.getGameBoard().setActionsLocked(true);
        let self = this;
        // Wait for the ending sequence to finish to all all the monsters to stop before starting over
        setTimeout(function () {
            self.getGameBoard().setActionsLocked(false);
        }, DEATH_DELAY)
    }

    /* private */
    resetGameOver() {
        this.setNumLives(10);
        this.getBarbarian().setScreenNumber(0);
        this.getBarbarian().setDirection(RIGHT_LABEL);
        this.getBarbarian().setAction(undefined);
        this.getBarbarian().setVerticalDirection(undefined);
        this.getBarbarian().renderAtRestFrame(this.gameBoard);
        this.gameBoard.setBackdrop(0);

        for (let opponent of this.gameBoard.getAllMonsters()) {
            opponent.hide();
        }

        for (let i = 1; i < this.getNumLives(); i++) {
            $('.life' + i).css('display', 'block');
        }
        this.messages.hideAllMessages();
    }

    /* private */
    setScreenNumber(screenNumber) {
        validateRequiredParams(this.setScreenNumber, arguments, 'screenNumber');
        return this.barbarian.setScreenNumber(screenNumber);
    }

    /* private */
    getNumLives() {
        return this.numLives;
    }

    /* private */
    setNumLives(number) {
        validateRequiredParams(this.setNumLives, arguments, 'number');
        this.numLives = number;
    }
}
