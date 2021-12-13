const ALLOWED_SCROLL_LABEL = 'allowedScroll';
class GameBoard {
    constructor(gameBoard) {
        this.gameBoard = gameBoard;
        this.isPaused = false;
        this.actionsLocked = false;
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

    canScroll(character, areAllMonstersDefeated) {
        return this.canScrollLeft(character) || this.canScrollRight(character, areAllMonstersDefeated);
    }

    canScrollRight(character, areAllMonstersDefeated) {
        return areAllMonstersDefeated &&
            character.isFacingRight() && this.isScrollAllowed(character.getScreenNumber(), RIGHT_LABEL) &&
            character.getScreenNumber() < this.getScreenNumbers().length;
    }

    canScrollLeft(character) {
        return character.isFacingLeft() && this.isScrollAllowed(character.getScreenNumber(), LEFT_LABEL)
    }

    areAllMonstersDefeated(screenNumber) {
        return this.getMonstersOnScreen(screenNumber).filter(m => !m.getProperties().getCanLeaveBehind() && !m.isDead()).length < 1;
    }

    /* private */
    getMonstersOnScreen(screenNumber) {
        return this.getOpponentsOnScreen(screenNumber).filter(character => !character.isBarbarian());
    }

    /* private */
    getOpponentsOnScreen(screenNumber) {
        return this.getOpponents(screenNumber);
    }

    setActionsLocked(flag) {
        if (flag === undefined) {
            throw new Error("setActionsLocked: flag argument is required");
        }
        this.actionsLocked = flag;
    }

    getActionsLocked() {
        return this.actionsLocked;
    }

    /* private */
    async advanceBackdrop(character, direction, screenNumber) {
        if (character.isDead()) {
            return;
        }
        this.setActionsLocked(true);

        await this.moveBackdrop(character, direction, false);
        if (this.isWater(screenNumber)) {
            // Scroll the water up
            await this.moveBackdrop(character, direction, true);
        }

        this.setActionsLocked(false);
    }

    /* private */
    async moveBackdrop(character, direction , isVertical) {
        let pixelsPerSecond = isVertical ? ADVANCE_SCREEN_VERTICAL_PIXELS_PER_SECOND : ADVANCE_SCREEN_PIXELS_PER_SECOND;
        let screenDimension = isVertical ? SCREEN_HEIGHT : SCREEN_WIDTH;

        let pixelsPerIteration = pixelsPerSecond / ADVANCE_SCREEN_PIXELS_PER_FRAME;
        let numberOfIterations = screenDimension / pixelsPerIteration;
        let sleepPerIteration = (ADVANCE_SCREEN_DURATION_SECONDS / numberOfIterations) * MILLISECONDS_PER_SECOND;

        let x, y, distance, screenOffset = undefined;
        if (isVertical) {
            y = SCREEN_HEIGHT - character.getProperties().getSprite().height() / 2;
            distance = Math.abs(y - stripPxSuffix(character.getProperties().getSprite().css('bottom')));
        } else {
            x = character.isFacingRight() ? 0 : SCREEN_WIDTH -
                character.getProperties().getSprite().width();
            distance = SCREEN_WIDTH - character.getProperties().getSprite().width();
        }
        let adjustedPixelsPerSecond = distance / ADVANCE_SCREEN_DURATION_SECONDS;
        character.getAnimator().moveElementToPosition(x, y, adjustedPixelsPerSecond);

        let backgroundPosition = isVertical ? 'background-position-y' : 'background-position-x';
        let currentPosition = parseInt(stripPxSuffix(this.getBackdrop().css(backgroundPosition)));

        for (let i = 0; i < numberOfIterations; i++) {
            let offset = (i + 1) * pixelsPerIteration;
            let directionCompare = isVertical ? UP_LABEL : RIGHT_LABEL;
            let position = direction === directionCompare ? (currentPosition + offset) : (currentPosition - offset);

            this.getBackdrop().css(backgroundPosition,position + 'px');
            await sleep(sleepPerIteration);
        }
    }

    /**
     * Gets the backdrop element.
     * @returns {jQuery|HTMLElement}
     */
    getBackdrop() {
        return $('.backdrop');
    }

    /**
     * Sets the backdrop offset to the current screen.
     */
    setBackdrop(screenNumber) {
        this.getBackdrop().css('background-position', -1* SCREEN_WIDTH * screenNumber + 'px 0px');
    }

    resetBackdrop() {
        this.gameBoard.getBackdrop().css('background-position', '0px 0px');
    }

    hideOpponents(screenNumber) {
        let opponents = this.getMonstersOnScreen(screenNumber);
        for (let opponent of opponents) {
            opponent.getProperties().getSprite().css('display', 'none');
            opponent.getProperties().getDeathSprite().css('display', 'none');
        }
    }

    /**
     * Initializes the current screen to ready it for playing.
     */
    initializeScreen(screenNumber) {

        let monsters = this.getMonstersOnScreen(screenNumber);

        for (let monster of monsters) {
            monster.getProperties().getSprite().css('left', monster.getProperties().getDefaultX() + 'px');
            monster.getProperties().getSprite().css('bottom', monster.getProperties().getDefaultY(screenNumber) + 'px');
            monster.getProperties().getSprite().css('filter', "brightness(100%)");
            monster.setStatus(DEAD_LABEL);
        }
    }

    /* private */
    resetSpritePositions(barbarian) {
        let characters = new Array(barbarian);
        for (let scrNum of this.getScreenNumbers()) {
            for (let opponent of this.getMonstersOnScreen(barbarian.getScreenNumber())) {
                characters.push(opponent);
            }
        }

        barbarian.show();

        let spritesOnScreen = this.getOpponentsOnScreen(barbarian.getScreenNumber());
        for (const character of characters) {
            let isSpriteOnScreen = $.inArray(character, spritesOnScreen) !== -1;
            character.getProperties().getDeathSprite().hide();
            character.setAction(character.getProperties().getDefaultAction());
            character.setDirection(character.getProperties().getDefaultHorizontalDirection());
            character.setStatus(character.getProperties().getDefaultStatus());
            character.getProperties().getSprite().css('display', isSpriteOnScreen ? 'block' : 'none');
            character.getProperties().getSprite().css('left',  character.getProperties().getDefaultX() + 'px');
            character.getProperties().getSprite().css('bottom',
                character.getProperties().getDefaultY(barbarian.getScreenNumber()) + 'px');
        }
    }
}
