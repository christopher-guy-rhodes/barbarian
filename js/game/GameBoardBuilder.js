class GameBoardBuilder {
    constructor() {
        this.gameBoard = {
            0: {
                opponents: [],
                surface: EARTH_SURFACE,
                allowedScroll: {
                    left: false,
                    right: true
                }
            },
            1: {
                opponents: [],
                surface: EARTH_SURFACE,
                allowedScroll: {
                    left: true,
                    right: true
                }
            },
            2: {
                opponents: [],
                surface: EARTH_SURFACE,
                allowedScroll : {
                    left: true,
                    right: true
                }
            },
            3: {
                opponents: [],
                surface: EARTH_SURFACE,
                allowedScroll : {
                    left: false,
                    right: true
                }
            },
            4: {
                opponents: [],
                surface: EARTH_SURFACE,
                allowedScroll : {
                    left: false,
                    right: true
                }
            },
            5: {
                opponents: [],
                surface: EARTH_SURFACE,
                allowedScroll : {
                    left: true,
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
     * Set the surface for the given screen number.
     * @param screenNumber the screen number
     * @param surface the surface (WATER, ICE, EARTH)
     * @returns {GameBoardBuilder} this game board builder
     */
    withSurface(screenNumber, surface) {
        this.gameBoard[screenNumber][SURFACE_LABEL] = surface;
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
