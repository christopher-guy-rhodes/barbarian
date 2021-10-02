const ALLOWED_SCROLL_LABEL = 'allowedScroll';
class GameBoard {
    constructor(gameBoard) {
        this.gameBoard = gameBoard;
    }

    getOpponents(screenNumber) {
        return this.gameBoard[screenNumber][OPPONENTS];
    }

    getAllOpponents() {
        let opponents = [];

        for (let screenNumber of Object.keys(this.gameBoard)) {
            opponents = opponents.concat(this.getOpponents(screenNumber));
        }

        return opponents;
    }

    getAllMonsters() {
        return this.getAllOpponents().filter(character => !character.isBarbarian());
    }

    getScreenNumbers() {
        return Object.keys(this.gameBoard);
    }

    isWater(screenNumber) {
        return this.gameBoard[screenNumber][WATER];
    }

    isScreenDefined(screenNumber) {
        return this.gameBoard[screenNumber] !== undefined;
    }

    isScrollAllowed(screenNumber, direction) {
        return this.gameBoard[screenNumber][ALLOWED_SCROLL_LABEL][direction]
    }
}
