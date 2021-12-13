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

    /**
     * Set the opponents for the given screen number.
     * @param screenNumber the screen number
     * @param opponents the opponents
     * @returns {GameBoardBuilder} this game board builder
     */
    withOpponents(screenNumber, opponents) {
        validateRequiredParams(this.withOpponents, arguments, 'screenNumber', 'opponents');
        this.gameBoard[screenNumber][OPPONENTS_LABEL] = opponents;
        return this;
    }

    /**
     * Set whether the screen number is a water screen.
     * @param screenNumber the screen number
     * @returns {GameBoardBuilder} this game board builder
     */
    withWater(screenNumber) {
        this.gameBoard[screenNumber][WATER_LABEL] = true;
        return this;
    }

    /**
     * Build the GameBoard object.
     * @returns {GameBoard} the game board
     */
    build() {
        return new GameBoard(this.gameBoard);
    }
}
