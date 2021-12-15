const KEYPRESS_THROTTLE_DELAY = 200;
const KP_LEFT = 'KP_LEFT';
const KP_RIGHT = 'KP_RIGHT';
const KP_RUN = 'KP_RUN';
const KP_JUMP = 'KP_JUMP';
const KP_STOP = 'KP_STOP';
const KP_ATTACK = 'KP_ATTACK';
const KP_PAUSE = 'KP_PAUSE';
const KP_SPACE = 'KP_SPACE';
const KP_CONTROLS = 'KP_CONTROLS';
const KP_MAIN = 'KP_MAIN';
const KP_SOUND = 'KP_SOUND';
const KP_UP = 'KP_UP';
const KP_DOWN = 'KP_DOWN';

// Keypress event names
const KEYPRESS = {
    KP_LEFT     : 37,
    KP_RIGHT    : 39,
    KP_ATTACK   : 65,
    KP_RUN      : 82,
    KP_STOP     : 83,
    KP_JUMP     : 74,
    KP_PAUSE    : 80,
    KP_SPACE    : 32,
    KP_CONTROLS : 67,
    KP_MAIN     : 77,
    KP_HINTS    : 72,
    KP_SOUND    : 88,
    KP_UP       : 38,
    KP_DOWN     : 40,
};

class Events {
    /**
     * Construct an events object.
     * @param game the game object
     */
    constructor(game) {
        validateRequiredParams(this.constructor, arguments, 'game');
        this.game = game;
        this.messages = new Messages();
        this.sounds = new Sounds();

        this.keypressTime = undefined;
        this.lastKeypressTime = undefined;
    }

    /**
     * Handle keydown event.
     * @param keypress the ascii value of the key that was pressed
     */
    handleKeypress(keypress) {
        this.keypressTime = new Date().getTime();

        if (!this.shouldThrottle() && !this.game.getGameBoard().getActionsLocked()) {
            this.lastKeypressTime = this.keypressTime;
            this.keypressTime = new Date().getTime();

            if (!this.game.getGameBoard().getIsPaused() || KEYPRESS[KP_PAUSE] === keypress) {

                switch (keypress) {
                    case KEYPRESS[KP_CONTROLS]:
                        if(this.game.getBarbarian().isDead()) {
                            this.messages.showControlMessage();
                        }
                        break;
                    case KEYPRESS[KP_MAIN]:
                        if(this.game.getBarbarian().isDead()) {
                            this.messages.showStartMessage();
                        }
                        break;
                    case KEYPRESS[KP_SPACE]:
                        this.handleSpaceKeypress();
                        break;
                    case KEYPRESS[KP_PAUSE]:
                        this.handlePauseKeypress();
                        break;
                    case KEYPRESS[KP_SOUND]:
                        this.handleSoundKeypress();
                        break;
                    case KEYPRESS[KP_RUN]:
                        this.handleRunKeypress();
                        break;
                    case KEYPRESS[KP_JUMP]:
                        this.handleJumpKeypress();
                        break;
                    case KEYPRESS[KP_STOP]:
                        this.handleStopKeypress();
                        break;
                    case KEYPRESS[KP_RIGHT]:
                        this.handleRightKeypress();
                        break;
                    case KEYPRESS[KP_LEFT]:
                        this.handleLeftKeypress();
                        break;
                    case KEYPRESS[KP_ATTACK]:
                        this.handleAttackKeypress();
                        break;
                    case KEYPRESS[KP_UP]:
                        this.handleUpKeypress();
                        break;
                    case KEYPRESS[KP_DOWN]:
                        this.handleDownKeypress();
                        break;
                    default:
                        return; // exit this handler for other keys
                }
            }
        }

    }

    /**
     * Handle a space keypress.
     */
    handleSpaceKeypress() {
        // Don't allow space keypress if the barbarian just died to avoid race conditions
        if (this.game.getBarbarian().isDead()) {
            this.game.resetGame();
            this.messages.hideAllMessages();
            this.game.startMonsterAttacks();
            this.game.performAction(this.game.getBarbarian(), STOP_LABEL);
            this.game.getBarbarian().renderAtRestFrame(this.game.gameBoard);
        }
    }

    /**
     * Handle a pause keypress.
     */
    handlePauseKeypress() {
        if (!this.game.getBarbarian().isDead()) {
            if (this.game.getGameBoard().getIsPaused()) {
                this.game.getMessages().hideAllMessages()
                this.game.getGameBoard().setIsPaused(false);
                if (this.game.getBarbarian().isActionDefined()) {
                    let action = this.game.getBarbarian().getAction();
                    this.game.performAction(this.game.getBarbarian(), action, this.game.getGameBoard().getPauseFrame());
                    this.game.getGameBoard().setPauseFrame(0);
                }
                this.game.startMonsterAttacks(true);
                if (this.game.getSounds().getIsSoundOn()) {
                    this.game.getSounds().playThemeSong();
                }
            } else {
                this.game.getMessages().showPauseMessage()
                this.game.getSounds().stopAllSounds();
                this.game.getGameBoard().setIsPaused(true);
            }
        }
    }

    /**
     * Handle a sound toggle keypress.
     */
    handleSoundKeypress() {
        this.game.getSounds().setIsSoundOn(!this.game.getSounds().getIsSoundOn());

        this.game.getMessages().showSoundToggleMessage(game.getSounds().getIsSoundOn());

        if (this.game.getSounds().getIsSoundOn()) {
            this.game.getSounds().playThemeSong();
        } else {
            this.game.getSounds().stopAllSounds();
        }
    }

    /**
     * Handle an attack keypress.
     */
    handleAttackKeypress() {
        if (!this.game.getBarbarian().isAction(SWIM_LABEL) && !game.getBarbarian().isDead()) {
            this.game.getBarbarian().getAnimator().stopMovement();
            this.game.getSounds().playGruntSound();
            this.game.performAction(this.game.getBarbarian(), ATTACK_LABEL);
        }
    }

    /**
     * Handle a run keypress.
     */
    handleRunKeypress() {
        if (!this.game.getBarbarian().isAction(SWIM_LABEL) &&
            !this.game.getBarbarian().isAction(RUN_LABEL) &&
            !this.game.getBarbarian().isDead()) {
            this.game.performAction(this.game.getBarbarian(), RUN_LABEL);
        }
    }

    /**s
     * Handle a jump keypress.
     */
    handleJumpKeypress() {
        if (!this.game.getBarbarian().isAction(SWIM_LABEL) && !this.game.getBarbarian().isAction(JUMP_LABEL)
            && !this.game.getBarbarian().isDead()) {
            this.game.performAction(this.game.getBarbarian(), JUMP_LABEL);
        }
    }

    /**
     * Handle a stop keypress.
     */
    handleStopKeypress() {
        if (!this.game.getBarbarian().isAction(SWIM_LABEL) && !this.game.getBarbarian().isDead()) {
            this.game.performAction(this.game.getBarbarian(), STOP_LABEL);
            this.game.getBarbarian().getAnimator().stopMovement();
            this.game.getBarbarian().renderAtRestFrame(this.game.gameBoard);
            this.game.getBarbarian().setVerticalDirection(undefined);
        }
    }

    /**
     * Handle a right arrow keypress.
     */
    handleRightKeypress() {
        let action = this.game.getGameBoard().isWater(game.getScreenNumber()) ? SWIM_LABEL : WALK_LABEL;
        if ((this.game.getBarbarian().getAction() !== action ||
            (!this.game.getBarbarian().isFacingRight() || this.game.getBarbarian().isMovingVertically())) &&
                !this.game.getBarbarian().isDead()) {
            this.game.getBarbarian().setVerticalDirection(undefined);
            this.game.getBarbarian().setDirection(RIGHT_LABEL);
            this.game.performAction(this.game.getBarbarian(), action);
        }
    }

    /**
     * Handle a left arrow keypress.
     */
    handleLeftKeypress() {
        let action = this.game.getGameBoard().isWater(game.getScreenNumber()) ? SWIM_LABEL : WALK_LABEL;
        if ((this.game.getBarbarian().getAction() !== action ||
            (!this.game.getBarbarian().isFacingLeft() || this.game.getBarbarian().isMovingVertically())) &&
                !this.game.getBarbarian().isDead()) {
            this.game.getBarbarian().setVerticalDirection(undefined);
            this.game.getBarbarian().setDirection(LEFT_LABEL);
            this.game.performAction(this.game.getBarbarian(), action);
        }
    }

    /**
     * Handle an up arrow keypress.
     */
    handleUpKeypress() {
        if (!this.game.getBarbarian().isDead()) {
            if (!this.game.getBarbarian().isAction(SWIM_LABEL) || !this.game.getBarbarian().isDirectionUp()) {
                if (this.game.getGameBoard().isWater(game.getScreenNumber())) {
                    this.game.getBarbarian().setVerticalDirection(UP_LABEL);
                    this.game.performAction(this.game.getBarbarian(), SWIM_LABEL);
                }
            }
        }
    }

    /**
     * Handle a down arrow keypress.
     */
    handleDownKeypress() {
        if (!this.game.getBarbarian().isDead()) {
            if (!this.game.getBarbarian().isAction(SWIM_LABEL) || !this.game.getBarbarian().isDirectionDown()) {
                if (this.game.getGameBoard().isWater(game.getScreenNumber())) {
                    this.game.getBarbarian().setVerticalDirection(DOWN_LABEL);
                    this.game.performAction(this.game.getBarbarian(), SWIM_LABEL);
                }
            }
        }
    }

    /**
     * Handle a tap hold event.
     * @param event the tap hold event
     */
    tapHoldHandler(event) {
        events.handleKeypress(KEYPRESS[KP_PAUSE]);
    }

    /**
     * Handle a swipe right event.
     * @param event the swipe right event
     */
    swipeRightHandler(event){
        if (game.messages.isControlMessageDisplayed()) {
            events.handleKeypress(KEYPRESS[KP_MAIN])
        } else if (game.getBarbarian().isDead()) {
            events.handleKeypress(KEYPRESS[KP_CONTROLS])
        } else if (game.getBarbarian().isFacingLeft()) {
            events.handleKeypress(KEYPRESS[KP_STOP]);
        } else {
            events.handleKeypress(KEYPRESS[KP_ATTACK]);
        }
    }

    /**
     * Handle a left swipe event.
     * @param event the swipe left event
     */
    swipeLeftHandler(event){
        if (this.messages.isControlMessageDisplayed()) {
            events.handleKeypress(KEYPRESS[KP_MAIN])
        } else if (game.getBarbarian().isDead()) {
            events.handleKeypress(KEYPRESS[KP_CONTROLS])
        } else if (game.getBarbarian().isFacingRight()) {
            events.handleKeypress(KEYPRESS[KP_STOP]);
        } else {
            events.handleKeypress(KEYPRESS[KP_ATTACK]);
        }
    }

    /**
     * Handle a mouse click event.
     * @param event the mouse click event
     */
    clickHandler(event) {
        if (game.getBarbarian().isDead()) {
            events.handleKeypress(KEYPRESS[KP_SPACE]);
        }
        let bottomOfBarbarian = game.getBarbarian().getY();
        let topOfBarbarian = game.getBarbarian().getHeight()/2 + bottomOfBarbarian;
        let barbarianLeft =  game.getBarbarian().getWidth()/2 + game.getBarbarian().getX();
        let pageX = event.originalEvent.pageX;
        let clickY = SCREEN_HEIGHT - event.originalEvent.pageY;


        if (game.getGameBoard().isWater(game.getScreenNumber())) {
            if (clickY > topOfBarbarian + 100) {
                events.handleKeypress(KEYPRESS[KP_UP]);
                return;
            } else if (clickY < bottomOfBarbarian - 100) {
                events.handleKeypress(KEYPRESS[KP_DOWN]);
                return;
            }
        }

        if (!game.getGameBoard().isWater(game.getScreenNumber()) &&  clickY > 600) {
            events.handleKeypress(KEYPRESS[KP_JUMP]);
        } else {
            let changingDirection = game.getBarbarian().isFacingRight() && pageX < barbarianLeft ||
                game.getBarbarian().isFacingLeft() && pageX > barbarianLeft;
            if (game.getBarbarian().isAction(WALK_LABEL) && !changingDirection) {
                events.handleKeypress(KEYPRESS[KP_RUN]);
            } else {
                events.handleKeypress(KEYPRESS[pageX > barbarianLeft ? KP_RIGHT : KP_LEFT]);
            }
        }
    }

    /**
     * Determine if throttling should take place on keypresses.
     * @returns {boolean} true if throttling should happen, false otherwise
     */
    shouldThrottle() {
        let elapsed = KEYPRESS_THROTTLE_DELAY;
        if (typeof this.lastKeypressTime !== undefined) {
            elapsed = new Date().getTime() - this.lastKeypressTime;
        }
        return elapsed < KEYPRESS_THROTTLE_DELAY;
    }
}
