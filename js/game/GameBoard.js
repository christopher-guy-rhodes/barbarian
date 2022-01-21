const ALLOWED_SCROLL_LABEL = 'allowedScroll';
class GameBoard {
    constructor(gameBoard) {
        this.gameBoard = gameBoard;
        this.isPaused = false;
        this.actionsLocked = false;
        this.pauseFrame = 0;
    }

    /**
     * Get all the opponents for the screen number.
     * @param screenNumber the screen number
     * @returns {Character[]|undefined} all the characters on the screen
     */
    getOpponents(screenNumber) {
        validateRequiredParams(this.getOpponents, arguments, 'screenNumber');
        return this.gameBoard[screenNumber][OPPONENTS_LABEL];
    }

    /**
     * Get all opponents across all screens.
     * @returns {Character[]} all the characters on all the screens
     */
    getAllOpponents() {
        let opponents = [];

        for (let screenNumber of Object.keys(this.gameBoard)) {
            opponents = opponents.concat(this.getOpponents(screenNumber));
        }

        return opponents;
    }

    /**
     * Get all the monsters across all the screens.
     * @returns {Character[]} all the monsters across all of the screens.
     */
    getAllMonsters() {
        return this.getAllOpponents().filter(character => !character.isBarbarian());
    }

    /**
     * Get all the available screen numbers.
     * @returns {string[]}
     */
    getScreenNumbers() {
        return Object.keys(this.gameBoard);
    }

    /**
     * Determine if a particular screen is a water screen.
     * @param screenNumber the screen number
     * @returns {boolean} true if the screen is a water screen, false otherwise
     */
    isWater(screenNumber) {
        validateRequiredParams(this.isWater, arguments, 'screenNumber');
        return this.gameBoard[screenNumber][SURFACE_LABEL] === WATER_SURFACE;
    }

    /**
     * Determine if a particular screen is an ice screen.
     * @param screenNumber the screen number
     * @returns {boolean} true if the screen is an ice screen, false otherwise
     */
    isIce(screenNumber) {
        validateRequiredParams(this.isWater, arguments, 'screenNumber');
        return this.gameBoard[screenNumber][SURFACE_LABEL] === ICE_SURFACE;
    }

    /**
     * Determine a a screen number is defined.
     * @param screenNumber the screen number
     * @returns {boolean} true if the screen is defined, false otherwise
     */
    isScreenDefined(screenNumber) {
        validateRequiredParams(this.isScreenDefined, arguments, 'screenNumber');
        return this.gameBoard[screenNumber] !== undefined;
    }

    /**
     * Determine if scrolling in the specified direction is allowed on the screen number.
     * @param screenNumber the screen number
     * @param direction the direction
     * @returns {boolean} true if scrolling is allowed, false otherwise
     */
    isScrollAllowed(screenNumber, direction) {
        validateRequiredParams(this.isScrollAllowed, arguments, 'screenNumber', 'direction');
        return this.gameBoard[screenNumber][ALLOWED_SCROLL_LABEL][direction]
    }

    /**
     * Determine if the game is paused.
     * @returns {boolean} true if the game is paused, false otherwise
     */
    getIsPaused() {
        return this.isPaused;
    }

    /**
     * Sets the paused state of the game.
     * @param flag true to pause the game, false to unpause the game
     */
    setIsPaused(flag) {
        validateRequiredParams(this.setIsPaused, arguments, 'flag');
        this.isPaused = flag;
    }

    /**
     * Get the monsters (non Barbarians) on the screen
     * @param screenNumber
     * @returns {Character[]}
     */
    getMonstersOnScreen(screenNumber) {
        validateRequiredParams(this.getMonstersOnScreen, arguments, 'screenNumber');
        return this.getOpponentsOnScreen(screenNumber).filter(character => !character.isBarbarian());
    }

    /**
     * Set the Barbarian actions as being locked or not.
     * @param flag true if the action are to be locked, false otherwise
     */
    setActionsLocked(flag) {
        if (flag === undefined) {
            throw new Error("setActionsLocked: flag argument is required");
        }
        this.actionsLocked = flag;
    }

    /**
     * Determine if the Barbarian's actions are locked.
     * @returns {boolean} true if the Barbarian's actions are locked, false otherwise
     */
    getActionsLocked() {
        return this.actionsLocked;
    }

    /**
     * Advance the game board backdrop.
     * @param character the character
     * @param direction the direction to move the backdrop
     * @param screenNumber the current screen number
     * @param outOfWaterCallback callback for when the Barbarian exists the water
     * @returns {Promise<void>} void promise
     */
    async advanceBackdrop(character, direction, screenNumber, outOfWaterCallback) {
        if (character.isDead()) {
            return;
        }
        this.setActionsLocked(true);

        // Currently we only jump out of water moving right. Don't want to jump if the screen is scrolled in when
        // the Barbarian is going back to the screen. May need to generalize this in the future.
        if (screenNumber > 0 && this.isWater(screenNumber - 1)
            && character.getHorizontalDirection() === RIGHT_LABEL ) {
            await outOfWaterCallback();
            await this.moveBackdrop(character, direction, UP_LABEL);
        }
        await this.moveBackdrop(character, direction, undefined);
        if (this.isWater(screenNumber)) {
            // Scroll the water up
            await this.moveBackdrop(character, direction, DOWN_LABEL);
        }


        this.setActionsLocked(false);
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

    /**
     * Hide the monsters on a particular screen.
     * @param screenNumber the screen number
     */
    hideMonsters(screenNumber) {
        validateRequiredParams(this.hideMonsters, arguments, 'screenNumber');
        let opponents = this.getMonstersOnScreen(screenNumber);
        for (let opponent of opponents) {
            opponent.getProperties().getSprite().css('display', 'none');
            opponent.getProperties().getDeathSprite().css('display', 'none');
        }
    }

    /**
     * Initializes the current screen to ready it for playing.
     * @param screenNumber the screen number
     */
    initializeScreen(screenNumber) {
        validateRequiredParams(this.initializeScreen, arguments, 'screenNumber');
        let monsters = this.getMonstersOnScreen(screenNumber);

        for (let monster of monsters) {
            this.initializeMonster(monster, screenNumber);
        }
    }

    /**
     * Initialize a monster for a particular screen
     * @param monster the monster to initialize
     * @param screenNumber the screen number
     */
    initializeMonster(monster, screenNumber) {
        monster.getProperties().getSprite().css(CSS_LEFT_LABEL, monster.getProperties().getDefaultX() + 'px');
        monster.getProperties().getSprite().css(CSS_BOTTOM_LABEL,
            monster.getProperties().getDefaultY(screenNumber) + 'px');
        monster.getProperties().getSprite().css(CSS_FILTER_LABEL, "brightness(100%)");
        monster.setStatus(DEAD_LABEL);
    }

    /**
     * Reset sprite positions to the default.
     * @param barbarian the Barbarian character
     */
    resetSpritePositions(barbarian) {
        validateRequiredParams(this.resetSpritePositions, arguments, 'barbarian');
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
            character.getProperties().getSprite().css('display', isSpriteOnScreen && !character.getProperties().getIsSecondaryMonster() ? 'block' : 'none');
            character.getProperties().getSprite().css('left',  character.getProperties().getDefaultX() + 'px');
            character.getProperties().getSprite().css('bottom',
                character.getProperties().getDefaultY(barbarian.getScreenNumber()) + 'px');
        }
    }

    /**
     * Determine if the character is on the given screen.
     * @param character the character
     * @param screenNumber the screen number
     * @returns {boolean} true if the character is on the screen, false otherwise
     */
    doesScreenIncludeCharacter(character, screenNumber) {
        validateRequiredParams(this.doesScreenIncludeCharacter, arguments, 'character', 'screenNumber');
        return this.getOpponents(screenNumber).includes(character);
    }

    /**
     * Determine if the character and game board are in a state to let the screen scroll to the next or previous screen.
     * Intended for use when the Barbarian character hits the boundary.
     * @param character the character
     * @returns {boolean} true if the character is in a state to allow scrolling, false otherwise
     */
    canScroll(character) {
        validateRequiredParams(this.canScroll, arguments, 'character');
        return this.canScrollLeft(character) || this.canScrollRight(character);
    }

    /* private */
    canScrollRight(character) {
        return this.areAllMonstersDefeated(character.getScreenNumber()) &&
            character.isFacingRight() && this.isScrollAllowed(character.getScreenNumber(), RIGHT_LABEL) &&
            character.getScreenNumber() < this.getScreenNumbers().length;
    }

    /* private */
    canScrollLeft(character) {
        return character.isFacingLeft() && this.isScrollAllowed(character.getScreenNumber(), LEFT_LABEL)
    }

    /* private */
    areAllMonstersDefeated(screenNumber) {
        return this.getMonstersOnScreen(screenNumber).filter(m => !m.getProperties().getCanLeaveBehind() && !m.isDead()).length < 1;
    }

    /* private */
    getOpponentsOnScreen(screenNumber) {
        return this.getOpponents(screenNumber);
    }

    /* private */
    async moveBackdrop(character, direction , verticalDirection) {
        let pixelsPerSecond = verticalDirection !== undefined ? ADVANCE_SCREEN_VERTICAL_PIXELS_PER_SECOND
                                                              : ADVANCE_SCREEN_PIXELS_PER_SECOND;
        let screenDimension = verticalDirection !== undefined ? SCREEN_HEIGHT : SCREEN_WIDTH;

        let pixelsPerIteration = pixelsPerSecond / ADVANCE_SCREEN_PIXELS_PER_FRAME;
        let numberOfIterations = screenDimension / pixelsPerIteration;
        let sleepPerIteration = (ADVANCE_SCREEN_DURATION_SECONDS / numberOfIterations) * MILLISECONDS_PER_SECOND;

        let x, y, distance, screenOffset = undefined;
        let positionMultiplier = 1;
        if (verticalDirection === DOWN_LABEL) {
            y = SCREEN_HEIGHT - character.getProperties().getSprite().height() / 2;
            distance = Math.abs(y - stripPxSuffix(character.getProperties().getSprite().css(CSS_BOTTOM_LABEL)));
        } else if (verticalDirection === UP_LABEL) {
            positionMultiplier = -1;
            y = character.getProperties().getDefaultY(character.getScreenNumber());
            distance = Math.abs(y - stripPxSuffix(character.getProperties().getSprite().css(CSS_BOTTOM_LABEL)));
        } else {
            x = character.isFacingRight() ? 0 : SCREEN_WIDTH -
                character.getProperties().getSprite().width();
            distance = SCREEN_WIDTH - character.getProperties().getSprite().width();
        }
        let adjustedPixelsPerSecond = distance / ADVANCE_SCREEN_DURATION_SECONDS;

        character.getAnimator().moveElementToPosition(x, y, adjustedPixelsPerSecond);


        let backgroundPosition = verticalDirection !== undefined ? 'background-position-y' : 'background-position-x';
        let currentPosition = parseInt(stripPxSuffix(this.getBackdrop().css(backgroundPosition)));

        for (let i = 0; i < numberOfIterations; i++) {
            let offset = (i + 1) * pixelsPerIteration;
            let directionCompare = verticalDirection !== undefined ? UP_LABEL : RIGHT_LABEL;
            let position = direction === directionCompare ? (currentPosition + offset) : (currentPosition - offset);

            this.getBackdrop().css(backgroundPosition, (positionMultiplier * position) + 'px');
            await sleep(sleepPerIteration);
        }
    }
}
