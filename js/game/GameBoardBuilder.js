class GameBoardBuilder {
    constructor() {
        this.gameBoard = {
            0: {
                opponents: [],
                water: false,
                allowedScroll: {
                    left: false,
                    right: true
                }
            },
            1: {
                opponents: [],
                water: false,
                allowedScroll: {
                    left: true,
                    right: true
                }
            },
            2: {
                opponents: [],
                water: false,
                allowedScroll : {
                    left: true,
                    right: true
                }
            },
            3: {
                opponents: [],
                water: false,
                allowedScroll : {
                    left: false,
                    right: true
                }
            }
        };
    }

    withOpponents(screenNumber, opponents) {
        this.gameBoard[screenNumber][OPPONENTS_LABEL] = opponents;
        return this;
    }

    withWater(screenNumber) {
        this.gameBoard[screenNumber][WATER_LABEL] = true;
        return this;
    }

    build() {
        return new GameBoard(this.gameBoard);
    }
}
