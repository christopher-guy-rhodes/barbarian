const TOGGLE_MESSAGE_TIME = 2000;

class Messages {
    constructor() {
        this.controlMessage = $('.controls_message');
        this.gameOverMessage = $('.game_over');
        this.gameWonMessage = $('.game_won');
        this.startMessage = $('.start_message');
        this.demoOverMessage = $('.demo_over_message');
        this.soundOnMessage = $('.sound_message_on');
        this.soundOffMessage = $('.sound_message_off');
        this.pauseMessage = $('.pause_message');

        this.messages = [
            this.controlMessage,
            this.gameOverMessage,
            this.gameWonMessage,
            this.startMessage,
            this.demoOverMessage,
            this.soundOnMessage,
            this.soundOffMessage,
            this.pauseMessage
        ];
    }

    showSoundToggleMessage(isSoundOn) {
        this.hideAllMessages();
        (isSoundOn ? this.soundOnMessage : this.soundOffMessage).css('display', 'none');
        (isSoundOn ? this.soundOnMessage : this.soundOffMessage).css('display', 'block');
        let self = this;
        setTimeout(function () {
            self.hideAllMessages();
        }, TOGGLE_MESSAGE_TIME);

    }

    showMessage(message) {
        $.each(this.messages, function(idx, e) {
            e.css('display', e[0].classList !== message[0].classList ? 'none' : 'block');
        });
    }

    showPauseMessage() {
        console.log('showing pause message');
        this.showMessage(this.pauseMessage);
    }

    showStartMessage() {
        this.showMessage(this.startMessage);
    }

    showGameOverMessage() {
        this.showMessage(this.gameOverMessage);
    }

    showGameWonMessage() {
        this.showMessage(this.gameWonMessage);
    }

    showControlMessage() {
        this.showMessage(this.controlMessage);
    }

    hideAllMessages() {
        $.each(this.messages, function(idx, e) {
            e.css('display', 'none');
        });
    }
}
