class Messages {
    constructor() {
        this.controlMessage = $('.controls_message');
        this.gameOverMessage = $('.game_over');
        this.demoOverMessage = $('.demo_over_message');
        this.startMessage = $('.start_message');

        this.messages = [this.controlMessage, this.startMessage, this.gameOverMessage, this.demoOverMessage];
    }

    showMessage(message) {
        $.each(this.messages, function(idx, e) {
            e.css('display', e[0].classList !== message[0].classList ? 'none' : 'block');
        });
    }

    showStartMessage() {
        this.showMessage(this.startMessage);
    }

    showGameOverMessage() {
        this.showMessage(this.gameOverMessage);
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
