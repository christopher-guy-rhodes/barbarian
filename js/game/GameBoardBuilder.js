class GameBoardBuilder {
    constructor() {
        this.gameBoard = {
            0: {
                opponents: [],
                water: false
            },
            1: {
                opponents: [],
                water: false
            },
            2: {
                opponents: [],
                water: false
            },
            3: {
                opponents: [],
                water: false
            }
        };
    }

    withOpponents(screenNumber, opponents) {
        this.gameBoard[screenNumber][OPPONENTS] = opponents;
        return this;
    }

    withWater(screenNumber) {
        this.gameBoard[screenNumber][WATER] = true;
        return this;
    }

    build() {
        return new GameBoard(this.gameBoard);
    }
}
