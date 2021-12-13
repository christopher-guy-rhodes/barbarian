const TOGGLE_MESSAGE_TIME = 2000;

class Messages {
    constructor() {
        this.controlMessage = $('.controls_message');
        this.gameOverMessage = $('.game_over');
        this.gameWonMessage = $('.game_won');
        this.startMessage = $('.start_message');
        this.soundOnMessage = $('.sound_message_on');
        this.soundOffMessage = $('.sound_message_off');
        this.pauseMessage = $('.pause_message');

        this.messages = [
            this.controlMessage,
            this.gameOverMessage,
            this.gameWonMessage,
            this.startMessage,
            this.soundOnMessage,
            this.soundOffMessage,
            this.pauseMessage
        ];
    }

    /**
     * Determine if the controls message is currently being displayed.
     * @returns {boolean} true if the control message is showing, false otherwise
     */
    isControlMessageDisplayed() {
        return this.controlMessage.css(CSS_DISPLAY_LABEL) === CSS_BLOCK_LABEL;
    }

    /**
     * Display the sound toggle message on the screen.
     * @param isSoundOn whether the sound is currently on or not
     */
    showSoundToggleMessage(isSoundOn) {
        this.hideAllMessages();
        (isSoundOn ? this.soundOnMessage : this.soundOffMessage).css('display', 'none');
        (isSoundOn ? this.soundOnMessage : this.soundOffMessage).css('display', 'block');
        let self = this;
        setTimeout(function () {
            self.hideAllMessages();
        }, TOGGLE_MESSAGE_TIME);

    }

    /**
     * Display the message. Hides all other messages.
     * @param message the element of the message to display
     */
    showMessage(message) {
        $.each(this.messages, function(idx, e) {
            e.css('display', e[0].classList !== message[0].classList ? 'none' : 'block');
        });
    }

    /**
     * Show the pause message.
     */
    showPauseMessage() {
        this.showMessage(this.pauseMessage);
    }

    /**
     * Show that start message.
     */
    showStartMessage() {
        this.showMessage(this.startMessage);
    }

    /**
     * Show the game over message.
     */
    showGameOverMessage() {
        this.showMessage(this.gameOverMessage);
    }

    /**
     * Show the game won message.
     */
    showGameWonMessage() {
        this.showMessage(this.gameWonMessage);
    }

    /**
     * Show the control message.
     */
    showControlMessage() {
        this.showMessage(this.controlMessage);
    }

    /**
     * Hide all messages.
     */
    hideAllMessages() {
        $.each(this.messages, function(idx, e) {
            e.css('display', 'none');
        });
    }
}
