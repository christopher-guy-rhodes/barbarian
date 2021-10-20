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
    constructor(game) {
        this.game = game;
        this.messages = new Messages();
        this.sounds = new Sounds();

        this.keypressTime = undefined;
        this.lastKeypressTime = undefined;
    }

    handleKeypress(keypress) {
        this.keypressTime = new Date().getTime();

        if (!this.shouldThrottle() && !this.game.getActionsLocked()) {
            this.lastKeypressTime = this.keypressTime;
            this.keypressTime = new Date().getTime();

            if (!this.game.getIsPaused() || KEYPRESS[KP_PAUSE] === keypress) {

                switch (keypress) {
                    case KEYPRESS[KP_CONTROLS]:
                        if(this.game.isBarbarianDead()) {
                            this.messages.showControlMessage();
                        }
                        break;
                    case KEYPRESS[KP_MAIN]:
                        if(this.game.isBarbarianDead()) {
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

    handleSpaceKeypress(event) {
        // Don't allow space keypress if the barbarian just died to avoid race conditions
        if (this.game.isBarbarianDead()) {
            this.game.resetGame();
            this.messages.hideAllMessages();
            this.game.startMonsterAttacks();
            this.game.performAction(this.game.getBarbarian(), STOP_LABEL);
            this.game.renderAtRestFrame(this.game.getBarbarian());
        }
    }

    handlePauseKeypress() {
        if (!this.game.isBarbarianDead()) {
            if (this.game.getIsPaused()) {
                this.game.hideAllMessages();
                this.game.setIsPaused(false);
                if (this.game.isBarbarianActionDefined()) {
                    let action = this.game.getBarbarian().getAction();
                    this.game.performAction(this.game.getBarbarian(), action, this.game.getPausedFrame());
                    this.game.setPauseFrame(0);
                }
                this.game.startMonsterAttacks(true);
                if (this.game.getIsSoundOn()) {
                    this.game.playThemeSong();
                }
            } else {
                this.game.showPauseMessage();
                this.game.stopAllSounds();
                this.game.setIsPaused(true);
            }
        }
    }

    handleSoundKeypress() {
        this.game.setIsSoundOn(!this.game.getIsSoundOn());

        this.game.showSoundToggleMessage();

        if (this.game.getIsSoundOn()) {
            this.game.playThemeSong();
        } else {
            this.game.stopAllSounds();
        }
    }

    handleAttackKeypress() {
        if (!this.game.isBarbarianSwimming() && !game.isBarbarianDead()) {
            this.game.stopBarbarianMovement();
            this.game.playGruntSound();
            this.game.performAction(this.game.getBarbarian(), ATTACK_LABEL);
        }
    }


    handleRunKeypress() {
        if (!this.game.isBarbarianSwimming() &&
            !this.game.isBarbarianRunning() &&
            !this.game.isBarbarianDead()) {
            this.game.performAction(this.game.getBarbarian(), RUN_LABEL);
        }
    }

    handleJumpKeypress() {
        if (!this.game.isBarbarianSwimming() && !this.game.isBarbarianJumping() && !this.game.isBarbarianDead()) {
            this.game.performAction(this.game.getBarbarian(), JUMP_LABEL);
        }
    }

    handleStopKeypress() {
        if (!this.game.isBarbarianSwimming() && !this.game.isBarbarianDead()) {
            this.game.performAction(this.game.getBarbarian(), STOP_LABEL);
            this.game.stopBarbarianMovement();
            this.game.renderAtRestFrame(this.game.getBarbarian());
            this.game.getBarbarian().setVerticalDirection(undefined);
        }
    }

    handleRightKeypress() {
        let action = this.game.isWater() ? SWIM_LABEL : WALK_LABEL;
        if ((this.game.getBarbarian().getAction() !== action ||
            (!this.game.isBarbarianMovingRight() || this.game.getBarbarian().isMovingVertically())) &&
                !this.game.isBarbarianDead()) {
            this.game.getBarbarian().setVerticalDirection(undefined);
            this.game.getBarbarian().setDirection(RIGHT_LABEL);
            this.game.performAction(this.game.getBarbarian(), action);
        }
    }

    handleLeftKeypress() {
        let action = this.game.isWater() ? SWIM_LABEL : WALK_LABEL;
        if ((this.game.getBarbarian().getAction() !== action ||
            (!this.game.isBarbarianMovingLeft() || this.game.getBarbarian().isMovingVertically())) &&
                !this.game.isBarbarianDead()) {
            this.game.getBarbarian().setVerticalDirection(undefined);
            this.game.getBarbarian().setDirection(LEFT_LABEL);
            this.game.performAction(this.game.getBarbarian(), action);
        }
    }

    handleUpKeypress() {
        if (!this.game.isBarbarianDead()) {
            if (!this.game.isBarbarianSwimming() || !this.game.isBarbarianMovingUp()) {
                if (this.game.isWater()) {
                    this.game.getBarbarian().setVerticalDirection(UP_LABEL);
                    this.game.performAction(this.game.getBarbarian(), SWIM_LABEL);
                }
            }
        }
    }

    handleDownKeypress() {
        if (!this.game.isBarbarianDead()) {
            if (!this.game.isBarbarianSwimming() || !this.game.isBarbarianMovingDown()) {
                if (this.game.isWater()) {
                    this.game.getBarbarian().setVerticalDirection(DOWN_LABEL);
                    this.game.performAction(this.game.getBarbarian(), SWIM_LABEL);
                }
            }
        }
    }

    tapHoldHandler(event) {
        events.handleKeypress(KEYPRESS[KP_PAUSE]);
    }

    swipeRightHandler(event){
        if (game.messages.isControlMessageDisplayed()) {
            events.handleKeypress(KEYPRESS[KP_MAIN])
        } else if (game.isBarbarianDead()) {
            events.handleKeypress(KEYPRESS[KP_CONTROLS])
        } else if (game.isBarbarianMovingLeft()) {
            events.handleKeypress(KEYPRESS[KP_STOP]);
        } else {
            events.handleKeypress(KEYPRESS[KP_ATTACK]);
        }
    }

    swipeLeftHandler(event){
        if (this.messages.isControlMessageDisplayed()) {
            events.handleKeypress(KEYPRESS[KP_MAIN])
        } else if (game.isBarbarianDead()) {
            events.handleKeypress(KEYPRESS[KP_CONTROLS])
        } else if (game.isBarbarianMovingRight()) {
            events.handleKeypress(KEYPRESS[KP_STOP]);
        } else {
            events.handleKeypress(KEYPRESS[KP_ATTACK]);
        }
    }


    clickHandler(event) {
        if (game.isBarbarianDead()) {
            events.handleKeypress(KEYPRESS[KP_SPACE]);
        }
        let bottomOfBarbarian = game.getBarbarian().getY();
        let topOfBarbarian = game.getBarbarian().getHeight()/2 + bottomOfBarbarian;
        let barbarianLeft =  game.getBarbarian().getWidth()/2 + game.getBarbarian().getX();
        let pageX = event.originalEvent.pageX;
        let clickY = SCREEN_HEIGHT - event.originalEvent.pageY;


        if (game.isWater()) {
            if (clickY > topOfBarbarian + 100) {
                events.handleKeypress(KEYPRESS[KP_UP]);
                return;
            } else if (clickY < bottomOfBarbarian - 100) {
                events.handleKeypress(KEYPRESS[KP_DOWN]);
                return;
            }
        }

        if (!game.isWater() &&  clickY > 600) {
            events.handleKeypress(KEYPRESS[KP_JUMP]);
        } else {
            let changingDirection = game.getBarbarian().isFacingRight() && pageX < barbarianLeft ||
                game.getBarbarian().isFacingLeft() && pageX > barbarianLeft;
            if (game.getBarbarian().isWalking() && !changingDirection) {
                events.handleKeypress(KEYPRESS[KP_RUN]);
            } else {
                events.handleKeypress(KEYPRESS[pageX > barbarianLeft ? KP_RIGHT : KP_LEFT]);
            }
        }
    }

    shouldThrottle() {
        let elapsed = KEYPRESS_THROTTLE_DELAY;
        if (typeof this.lastKeypressTime !== undefined) {
            elapsed = new Date().getTime() - this.lastKeypressTime;
        }
        return elapsed < KEYPRESS_THROTTLE_DELAY;
    }
}
