const ALLOWED_SCROLL_LABEL = 'allowedScroll';
class GameBoard {
    constructor(gameBoard) {
        this.gameBoard = gameBoard;
        this.isPaused = false;
    }

    getOpponents(screenNumber) {
        return this.gameBoard[screenNumber][OPPONENTS_LABEL];
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
        if (screenNumber === undefined) {
            throw new Error("isWater: screenNumber is a required parameter")
        }
        return this.gameBoard[screenNumber][WATER_LABEL];
    }

    isScreenDefined(screenNumber) {
        return this.gameBoard[screenNumber] !== undefined;
    }

    isScrollAllowed(screenNumber, direction) {
        return this.gameBoard[screenNumber][ALLOWED_SCROLL_LABEL][direction]
    }

    getIsPaused() {
        return this.isPaused;
    }

    setIsPaused(flag) {
        if (flag === undefined) {
            throw new Error("setIsPaused: flag is a required parameter");
        }
        this.isPaused = flag;
    }
}
