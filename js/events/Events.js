class Events {
    constructor(game) {
        this.game = game;
        this.messages = new Messages();
        this.sounds = new Sounds();

        this.keypressTime = undefined;
        this.lastKeypressTime = undefined;
    }

    handleKeypress(keypress) {
        this.sounds.playSound(THEME_SONG);

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
        if (this.game.isBarbarianDead()) {
            this.game.resetGame();
            this.messages.hideAllMessages();
            this.game.startMonsterAttacks();
            this.game.performAction(this.game.getBarbarian(), STOP);
            this.game.renderAtRestFrame(this.game.getBarbarian());
        }
    }

    handlePauseKeypress() {

        if (!this.game.isBarbarianDead()) {
            if (this.game.getIsPaused()) {
                PAUSE_MESSAGE.css('display', 'none');
                this.game.setIsPaused(false);
                if (this.game.isBarbarianActionDefined()) {
                    let action = this.game.getBarbarian().getAction();
                    this.game.performAction(this.game.getBarbarian(), action, this.game.getPausedFrame());
                    this.game.setPauseFrame(0);
                }
                this.game.startMonsterAttacks(true);
                this.sounds.setSoundsPauseState(false);
            } else {
                PAUSE_MESSAGE.css('display', 'block');
                this.game.setIsPaused(true);
                this.sounds.setSoundsPauseState(true);
            }
        }
    }

    handleSoundKeypress() {
        HINTS_ON_MESSAGE.css('display', 'none');
        HINTS_OFF_MESSAGE.css('display', 'none')

        (game.getIsSoundOn() ? SOUND_ON_MESSAGE : SOUND_OFF_MESSAGE).css('display', 'none');
        (game.getIsSoundOn() ? SOUND_ON_MESSAGE : SOUND_OFF_MESSAGE).css('display', 'block');
        this.game.setIsSoundOn(!this.game.getIsSoundOn());

        if (this.game.getIsSoundOn()) {
            this.sounds.playSound(THEME_SONG);
        } else {
            this.sounds.stopAllSounds();
        }


        setTimeout(function () {
            SOUND_OFF_MESSAGE.css('display', 'none');
            SOUND_ON_MESSAGE.css('display', 'none');
        }, TOGGLE_MESSAGE_TIME);
    }

    handleAttackKeypress() {
        if (!this.game.isBarbarianSwimming() && this.isBarbarianAliveOrJustDied()) {
            this.game.stopBarbarianMovement();
            this.sounds.playSound(GRUNT_SOUND);
            this.game.performAction(this.game.getBarbarian(), ATTACK);
        }
    }


    handleRunKeypress() {
        if (!this.game.isBarbarianSwimming() &&
            !this.game.isBarbarianRunning() &&
            this.isBarbarianAliveOrJustDied()) {
            this.game.performAction(this.game.getBarbarian(), RUN);
        }
    }

    handleJumpKeypress() {
        if (!this.game.isBarbarianSwimming() && !this.game.isBarbarianJumping() && this.isBarbarianAliveOrJustDied()) {
            this.game.performAction(this.game.getBarbarian(), JUMP);
        }
    }

    handleStopKeypress() {
        if (!this.game.isBarbarianSwimming() && this.isBarbarianAliveOrJustDied()) {
            this.game.performAction(this.game.getBarbarian(), STOP);
            this.game.stopBarbarianMovement();
            this.game.renderAtRestFrame(this.game.getBarbarian());
            this.game.getBarbarian().setVerticalDirection(undefined);
        }
    }

    handleRightKeypress() {
        let action = this.game.isWater() ? SWIM : WALK;
        if ((this.game.getBarbarian().getAction() !== action || !this.game.isBarbarianMovingRight())
            && this.isBarbarianAliveOrJustDied()) {
            this.game.getBarbarian().setDirection(RIGHT);
            this.game.performAction(this.game.getBarbarian(), action);
        }
    }

    handleLeftKeypress() {
        let action = this.game.isWater() ? SWIM : WALK;
        if ((this.game.getBarbarian().getAction() !== action || !this.game.isBarbarianMovingLeft())
            && this.isBarbarianAliveOrJustDied()) {
            this.game.getBarbarian().setDirection(LEFT);
            this.game.performAction(this.game.getBarbarian(), action);
        }
    }

    handleUpKeypress() {
        if (!this.game.isBarbarianDead()) {
            if (!this.game.isBarbarianSwimming() || !this.game.isBarbarianMovingUp()) {
                if (this.game.isWater()) {
                    this.game.getBarbarian().setVerticalDirection(UP);
                    this.game.performAction(this.game.getBarbarian(), SWIM);
                }
            }
        }
    }

    handleDownKeypress() {
        if (!this.game.isBarbarianDead()) {
            if (!this.game.isBarbarianSwimming() || !this.game.isBarbarianMovingDown()) {
                if (this.game.isWater()) {
                    this.game.getBarbarian().setVerticalDirection(DOWN);
                    this.game.performAction(this.game.getBarbarian(), SWIM);
                }
            }
        }
    }

    isBarbarianAliveOrJustDied() {
        return !this.game.isBarbarianDead() || this.isBarbarianJustDied();
    }

    isBarbarianJustDied() {
        return new Date().getTime() - this.game.getBarbarian().getDeathTime() < JUST_DIED_THRESHOLD;
    }

    tapHoldHandler(event) {
        events.handleKeypress(KEYPRESS[KP_PAUSE]);
    }

    swipeRightHandler(event){
        if (CONTROL_MESSAGE.css('display') === 'block') {
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
        if (CONTROL_MESSAGE.css('display') === 'block') {
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
            let changingDirection = game.getBarbarian().isDirectionRight() && pageX < barbarianLeft ||
                game.getBarbarian().isDirectionLeft() && pageX > barbarianLeft;
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
