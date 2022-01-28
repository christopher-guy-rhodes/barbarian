const DEFAULT_BOTTOM = 12;
class CharacterProperties {
    /**
     * Construct a character properties object.
     * @param sprite the character sprite
     * @param frames the frames object for the various actions of the character
     * @param deathSprite the death sprite for the character
     * @param characterType the type of character
     * @param defaultX the default x coordinate for the character
     * @param canElevate whether or not the character can elevate without jumping
     * @param canHighlight whether or not the character highlights when within attack rante
     * @param canLeaveBehind whether or not the character can be left behind on a screen or has to be defeated first
     * @param canTurnAround whether or not the character can turn around
     * @param isInvincible whether or not the character is invincible
     * @param sound the sound that the character makes
     * @param actionNumberOfTimes the action number of times object
     * @param pixelsPerSecond the pixels per second object
     * @param framesPerSecond the frame per second object
     * @param defaultStatus the default status of the character
     * @param defaultAction the default action of the character
     * @param defaultDirection the default horizontal direction of the character
     * @param defaultBottom the default bottom position of the character
     * @param frameTargets the frame targets for the character
     * @param isSecondaryMonster true if it is a monster launched by another monster, false otherwise
     */
    constructor(sprite, frames, deathSprite, characterType, defaultX, canElevate, canHighlight, canLeaveBehind,
                canTurnAround, isInvincible, sound, actionNumberOfTimes, pixelsPerSecond, framesPerSecond,
                defaultStatus, defaultHorizontalAction, defaultDirection, defaultBottom, frameTargets,
                isSecondaryMonster, frameIdxSounds) {
        validateRequiredParams(this.constructor, arguments, 'sprite', 'deathSprite', 'characterType', 'canElevate',
            'canHighlight', 'canLeaveBehind', 'canTurnAround', 'isInvincible', 'actionNumberOfTimes', 'defaultStatus',
            'defaultHorizontalAction', 'defaultX', 'defaultDirection', 'defaultBottom', 'frameTargets',
            'isSecondaryMonster', 'frameIdxSounds');
        this.sprite = sprite;
        this.frames = frames;
        this.deathSprite = deathSprite;
        this.characterType = characterType;
        this.defaultX = defaultX;
        this.canElevate = canElevate;
        this.canHighlight = canHighlight;
        this.canLeaveBehind = canLeaveBehind;
        this.canTurnaround = canTurnAround;
        this.isInvincible = isInvincible;
        this.sound = sound;
        this.actionNumberOfTimes = actionNumberOfTimes;
        this.pixelsPerSecond = pixelsPerSecond;
        this.framesPerSecond = framesPerSecond;
        this.defaultStatus = defaultStatus;
        this.defaultHorizontalAction = defaultHorizontalAction;
        this.defaultX = defaultX;
        this.defaultDirection = defaultDirection;
        this.defaultBottom = defaultBottom;
        this.frameTargets = frameTargets;
        this.isSedondaryMonster = isSecondaryMonster;
        this.frameIdxSounds = frameIdxSounds;
    }

    /**
     * Get the sound to play at a particular frame index
     * @param frameIdx the frame index to play the sound at
     * @returns {String} the path to the sound file mp3 to play
     */
    getFrameIndexSound(frameIdx) {
        return this.frameIdxSounds[frameIdx];
    }

    /**
     * Get the specific rectangular target for a frame. Used to specify specific attack regions for sprites used to
     * determine attack results for characters.
     *
     * @param the action the frames are associated with
     * @param the screenNumber to get the frame target for
     * @param frame the frame to get the targeting for.
     * @returns {undefined|Object}
     */
    getFrameTarget(action, screenNumber, frame) {
        validateRequiredParams(this.getFrameTarget, arguments, 'action', 'screenNumber');
        if (frame === undefined || this.frameTargets[screenNumber] === undefined
            || this.frameTargets[screenNumber][action] === undefined) {
            return undefined;
        }
        return this.frameTargets[screenNumber][action][frame];
    }

    /**
     * Determine if the character is a secondary monster (a monster launched by another monster)
     * @returns {boolean} true if the character is a secondary monster, false otherwise
     */
    getIsSecondaryMonster() {
        return this.isSedondaryMonster;
    }

    /**
     * Get the frame indexes for a particular action and direction
     * @param action
     * @param direction
     * @returns {number[]|undefined} the frame indexes
     */

    getFrames(action, direction) {
        validateRequiredParams(this.getFrames, arguments, 'action', 'direction');
        return this.frames.getFrames(action, direction);
    }

    /**
     * Get the height offset for the sprite.
     * @param action the action the sprite is taking
     * @param direction the direction the sprite is going
     * @returns {number|undefined} the height offset
     */
    getFrameHeightOffset(action, direction) {
        validateRequiredParams(this.getFrameHeightOffset, arguments, 'action', 'direction');
        return this.frames.getFrameHeightOffset(action, direction);
    }

    /**
     * Get the character type.
     * @returns {string}
     */
    getType() {
        return this.characterType;
    }

    /**
     * Get whether or not the character can automatically traverse elevations.
     * @returns {boolean} true if the character elevate, false otherwise
     */
    getCanElevate() {
        return this.canElevate;
    }

    /**
     * Get whether or not the character can highlight when within attack range.
     * @returns {boolean} true if the character can highlight, false otherwise.
     */
    getCanHighlight() {
        return this.canHighlight;
    }

    /**
     * Get whether or not the character can be left behind on a screen without being defeated.
     * @returns {boolean} true if the character can be left behind, false otherwise.
     */
    getCanLeaveBehind() {
        return this.canLeaveBehind;
    }

    /**
     * Get whether or not the character can turn around (to chase the Barbarian)
     * @returns {boolean} true if the character can turn around, false otherwise
     */
    getCanTurnAround() {
        return this.canTurnaround;
    }

    /**
     * Get the sprite for the character.
     * @returns {jQuery|HTMLElement}
     */
    getSprite() {
        return this.sprite;
    }

    /**
     * Get the audio object for the character.
     * @returns {HTMLAudioElement|undefined}
     */
    getSound() {
        return this.sound;
    }

    /**
     * Get whether or not the character is invincible.
     * @returns {boolean} true if the character is invincible, false otherwise
     */
    getIsInvincible() {
        return this.isInvincible;
    }

    /**
     * Get the default status for the character.
     * @returns {string} the status
     */
    getDefaultStatus() {
        return this.defaultStatus;
    }

    /**
     * Get the default action for the character.
     * @returns {string|undefined} the action
     */
    getDefaultAction() {
        return this.defaultHorizontalAction;
    }

    /**
     * Get the default x coordinate for the character.
     * @returns {number} the x coordiante
     */
    getDefaultX() {
        return this.defaultX;
    }

    /**
     * Get the death sprite for the character.
     * @returns {jQuery|HTMLElement}
     */
    getDeathSprite() {
        return this.deathSprite;
    }

    /**
     * Get the default direction.
     * @returns {string|undefined}
     */
    getDefaultHorizontalDirection() {
        return this.defaultDirection[HORIZONTAL_LABEL];
    }

    /**
     * Get the number of times to perform the specified action for the character.
     * @param action the action
     * @returns {number|undefined}
     */
    getActionNumberOfTimes(action) {
        validateRequiredParams(this.getActionNumberOfTimes, arguments, 'action');
        if (this.actionNumberOfTimes[action] === undefined) {
            throw new Error("getActionNumberOfTimes: there are no number of times configured for \"" + action + "\"");
        }
        return this.actionNumberOfTimes[action];
    }

    /**
     * Get the pixels per second for the particular action.
     * @param action the action
     * @returns {number|undefined}
     */
    getPixelsPerSecond(action) {
        validateRequiredParams(this.getPixelsPerSecond, arguments, 'action');
        return this.pixelsPerSecond[action];
    }

    /**
     * Get the frames per second for the particular action.
     * @param action the action
     * @returns {number|undefined}
     */
    getFramesPerSecond(action) {
        validateRequiredParams(this.getFramesPerSecond, arguments, 'action');
        return this.framesPerSecond[action];
    }

    /**
     * Get the default y coordinate for the screen number.
     * @param screenNumber the screen number
     * @returns {number|undefined}
     */
    getDefaultY(screenNumber) {
        validateRequiredParams(this.getDefaultY, arguments, 'screenNumber');
        if (this.defaultBottom[screenNumber] === undefined) {
            return DEFAULT_BOTTOM;
        } else {
            return this.defaultBottom[screenNumber];
        }
    }
}
