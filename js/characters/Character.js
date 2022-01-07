const PASSING_MULTIPLIER = 1.5;
const PIT_JUMP_EVADE_FRAME = 4;
const CHASE_PROXIMITY = 200;
const MIN_AVOID_JUMP_FRAME = 3;
const MAX_AVOID_JUMP_FRAME = 7;

/**
 * Class that supports character actions
 */
class Character {
    /**
     * Construct a character
     * @param barbarian the Barbarian character, undefined if this is the Barbarian character
     * @param obstacles the obstacles the character will face
     * @param properties CharacterProperty object that represents the static properties of the character
     * @param action the action the character is taking
     * @param direction the direction vector the character is moving
     * @param status the status of the character
     * @param screenNumber the current screen number for the character
     * @param currentFrame the current frame that is rendering for the character's current action
     */
    constructor(barbarian,
                obstacles,
                properties,
                action,
                direction,
                status,
                screenNumber,
                currentFrameIndex) {
        validateRequiredParams(this.constructor, arguments, 'obstacles', 'properties', 'direction', 'status',
            'screenNumber');
        this.barbarian = barbarian === undefined ? this : barbarian;
        this.obstacles = obstacles;
        this.properties = properties;
        this.action = action;
        this.direction = direction;
        this.status = status;
        this.screenNumber = screenNumber;
        this.currentFrameIndex = currentFrameIndex;
        this.currentFrame = {};
        this.isSliding = false;
        this.pauseFrameIndex = undefined;

        this.animator = new Animator(this);
        this.sounds = new Sounds();
    }

    /**
     * Get the frame index the character was paused at.
     * @returns {undefined|number}
     */
    getPauseFrameIndex() {
        return this.pauseFrame;
    }

    /**
     * Set the frame index that the character was paused at.
     * @param frameIndex the frame index
     */
    setPauseFrameIndex(frameIndex) {
        this.pauseFrame = frameIndex;
    }

    /**
     * Determine if the character is sliding on ice.
     * @returns {boolean} true if the character is sliding, false otherwise
     */
    getIsSliding() {
        return this.isSliding;
    }

    /**
     * Set whether or not the character is sliding on ice.
     * @param flag true if the character is sliding, false otherwise
     */
    setIsSliding(flag) {
        this.isSliding = flag;
    }

    /**
     * Get the static character properties.
     * @returns {CharacterProperties} the character properties object for this character
     */
    getProperties() {
        return this.properties;
    }

    /**
     * Get the character animator.
     * @returns {Animator} the animator object for the character
     */
    getAnimator() {
        return this.animator;
    }

    /**
     * Get the character's obstacles object.
     * @returns {Obstacles} the obstacles object for the character
     */
    getObstacles() {
        return this.obstacles;
    }

    /**
     * Determines if the character is moving vertically.
     * @returns {boolean} returns true if the character is moving up or down, false otherwise.
     */
    isMovingVertically() {
        return this.getVerticalDirection() !== undefined;
    }

    /**
     * Determines if the character is facing left.
     * @returns {boolean} true if the character is facing left, false otherwise
     */
    isFacingLeft() {
        return this.getHorizontalDirection() === LEFT_LABEL;
    }

    /**
     * Determines if the character is facing right.
     * @returns {boolean} true if the character is facing left, false otherwise
     */
    isFacingRight() {
        return this.getHorizontalDirection() === RIGHT_LABEL;
    }

    /**
     * Get the x coordinate for this character.
     * @returns {number} the x coordinate
     */
    getX() {
        return parseInt(stripPxSuffix(this.getProperties().getSprite().css(CSS_LEFT_LABEL)));
    }

    /**
     * Get the y coordinate for this character.
     * @returns {number} the y coordinate
     */
    getY() {
        return parseInt(stripPxSuffix(this.getProperties().getSprite().css(CSS_BOTTOM_LABEL)));
    }

    /**
     * Get the height of the character.
     * @returns {number} the character height
     */
    getHeight() {
        return parseInt(stripPxSuffix(this.getProperties().getSprite().css(CSS_HEIGHT_LABEL)));
    }

    /**
     * Get the width of the character.
     * @returns {number} the character width
     */
    getWidth() {
        return parseInt(stripPxSuffix(this.getProperties().getSprite().css(CSS_WIDTH_LABEL)));
    }

    /**
     * Determine if this character is the Barbarian.
     * @returns {boolean} true if this character is the Barbarian, false otherwise
     */
    isBarbarian() {
        return this === this.getBarbarian();
    }

    /**
     * Hide this character.
     */
    hide() {
        this.getProperties().getSprite().css(CSS_DISPLAY_LABEL, CSS_NONE_LABEL);
    }

    /**
     * Show this character.
     */
    show() {
        this.getProperties().getSprite().css(CSS_DISPLAY_LABEL, CSS_BLOCK_LABEL);
    }

    /**
     * Determine if the character is dead.
     * @returns {boolean} true if the character is dead, false otherwise
     */
    isDead() {
        return this.getStatus() === DEAD_LABEL;
    }

    /**
     * Determine if the character is going up.
     * @returns {boolean} true if the character is facing up, false otherwise
     */
    isDirectionUp() {
        return this.getVerticalDirection() === UP_LABEL;
    }

    /**
     * Determine if the character is going down.
     * @returns {boolean} true if the character is facing down, false otherwise
     */
    isDirectionDown() {
        return this.getVerticalDirection() === DOWN_LABEL;
    }

    /**
     * Determine if the character is performing the action.
     * @param action the action to check
     */
    isAction(action) {
        validateRequiredParams(this.isAction, arguments, 'action');
        return this.getAction() === action;
    }

    /**
     * Determines if the action is infinite for the character.
     * @param action the action to check
     * @returns {boolean} true if the action is repeated indefinitely, false otherwise
     */
    isActionInfinite(action) {
        validateRequiredParams(this.isActionInfinite, arguments, 'action');
        return this.getProperties().getActionNumberOfTimes(action) === 0;
    }

    /**
     * Get the current character action.
     * @returns {string|undefined} the current action of the character
     */
    getAction() {
        return this.action;
    }

    /**
     * Get the current vertical direction of the character.
     * @returns {string|undefined} the current vertical direction of the character
     */
    getVerticalDirection() {
        return this.direction[VERTICAL_LABEL];
    }

    /**
     * Get the current direction of the character.
     * @returns {string} the direction of the character
     */
    getHorizontalDirection() {
        return this.direction[HORIZONTAL_LABEL];
    }

    /**
     * Gets the screen number that the character is on.
     * @returns {number} the screen number
     */
    getScreenNumber() {
        return this.screenNumber;
    }

    /**
     * Get the current frame index for a particular action for the character.
     * @param action the action to to get the frame for
     * @returns {number} the current frame for the action
     */
    getCurrentFrameIndex(action) {
        return action === undefined ? 0 : this.currentFrameIndex[action];
    }

    /**
     * Get the current frame for a particular action for the character.
     * @param action the action to to get the frame for
     * @returns {number} the current frame for the action
     */

    getCurrentFrame(action) {
        return action === undefined ? undefined
                                    : this.currentFrame[action];
    }

    /**
     * Set the action for the character.
     * @param action the action to set. Can be undefined.
     */
    setAction(action) {
        this.action = action;
    }

    /**
     * Set the direction of the character.
     * @param direction the direction of the character.
     */
    setDirection(direction) {
        validateRequiredParams(this.setDirection, arguments, 'direction');
        this.direction[HORIZONTAL_LABEL] = direction;
    }

    /**
     * Set the vertical direction of the character.
     * @param direction the vertical direction. Can be undefined.
     */
    setVerticalDirection(direction) {
        this.direction[VERTICAL_LABEL] = direction;
    }

    /**
     * Set the status for the character.
     * @param status the status
     */
    setStatus(status) {
        validateRequiredParams(this.setStatus, arguments, 'status');
        this.status = status;
    }

    /**
     * Set the screen number for the character.
     * @param screenNumber the screen number
     */
    setScreenNumber(screenNumber) {
        validateRequiredParams(this.setScreenNumber, arguments, 'screenNumber');
        this.screenNumber = screenNumber;
    }

    /**
     * Set the current frame index for the given action and frame.
     * @param action the action
     * @param frame the frame
     */
    setCurrentFrameIndex(action, frameIdx) {
        validateRequiredParams(this.setCurrentFrameIndex, arguments, 'action', 'frameIdx');
        this.currentFrameIndex[action] = frameIdx;
    }

    /**
     * Set the current frame for the given action and frame.
     * @param action the action
     * @param frame the frame
     */
    setCurrentFrame(action, frame) {
        this.currentFrame[action] = frame;
    }

    /**
     * Set the y coordinate for the character.
     * @param y the y coordinate
     */
    setY(y) {
        validateRequiredParams(this.setY, arguments, 'y');
        this.getProperties().getSprite().css(CSS_BOTTOM_LABEL, y + CSS_PX_LABEL)
    }

    /**
     * Set the x coordinate for the character.
     * @param x the x coordinate
     */
    setX(x) {
        validateRequiredParams(this.setX, arguments, 'x');
        this.getProperties().getSprite().css(CSS_LEFT_LABEL, x);
    }

    /**
     * Gets the Barbarian character.
     * @returns {Character|undefined} the Barbarian character
     */
    getBarbarian() {
        return this.barbarian;
    }

    /**
     * Determine if the character is dead but not in the process of dying (falling, sinking etc.).
     * @returns {boolean} true if the character is dying but not dead, false otherwise
     */
    isDeadButNotDying() {
        return this.isDead() && !this.isAction(FALL_LABEL) && !this.isAction(DEATH_LABEL) && !this.isAction(SINK_LABEL);
    }

    /**
     * Determine if the character is on the current screen.
     * @param gameBoard the game board
     * @returns {boolean} true if the character is on the current screen, false otherwise.
     */
    isOnScreen(gameBoard) {
        return gameBoard.getOpponents(this.barbarian.getScreenNumber()).includes(this);
    }

    /**
     * Render rest frame for a character. Used to make the character look natural when stopped.
     * @param character the character to render the at rest frame for
     */
    renderAtRestFrame(gameBoard) {
        let action = gameBoard.isWater(this.getScreenNumber()) ? SWIM_LABEL : STOP_LABEL;

        let heightOffset = this.getProperties().getFrameHeightOffset(action, this.getHorizontalDirection()) *
            this.getProperties().getSprite().height();

        let offset = this.getProperties().getFrames(action, this.getHorizontalDirection())[0];
        this.getProperties().getSprite().css(CSS_BACKGROUND_POSITION,
            -1 * offset * this.getWidth() + CSS_PX_LABEL + ' ' + -1 * heightOffset + CSS_PX_LABEL);
    }

    isActionDefined() {
        return this.getAction() !== undefined;
    }

    /* private */
    getStatus() {
        return this.status;
    }
}

