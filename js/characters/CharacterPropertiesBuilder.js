class CharacterPropertiesBuilder {

    /**
     * Construct a character properties builder object.
     * @param sprite the character sprite
     * @param characterType the type of character
     * @param defaultX the default x coordinate for the character
     */
    constructor(sprite, characterType, defaultX) {
        validateRequiredParams(this.constructor, arguments, 'sprite', 'characterType', 'defaultX');
        this.sprite = sprite;
        this.frames = {};
        this.deathSprite = $('.death');
        this.characterType = characterType;
        this.defaultX = defaultX;
        this.canElevate = true;
        this.canHighlight = true;
        this.canLeaveBehind = false;
        this.canTurnAround = true;
        this.sprite = sprite;
        this.isInvincible = false;
        this.sound = undefined;
        this.defaultStatus = DEAD_LABEL;
        this.defaultAction = WALK_LABEL;
        this.isSecondaryMonster = false;

        this.defaultDirection = {
            x : LEFT_LABEL,
            y : undefined
        };

        this.defaultBottom = {};

        this.actionNumberOfTimes = {
            run : 0,
            walk: 0,
            swim : 0,
            attack: 0,
            sink: 0,
            sit: 0,
            jump: 1,
            stop: 0,
            fall: 1,
            death: 1
        };

        this.pixelsPerSecond = {
            walk: DEFAULT_PIXELS_PER_SECOND,
            swim : DEFAULT_PIXELS_PER_SECOND,
            run : DEFAULT_PIXELS_PER_SECOND * RUN_SPEED_INCREASE_FACTOR,
            jump: DEFAULT_PIXELS_PER_SECOND,
            attack: DEFAULT_PIXELS_PER_SECOND,
            stop: DEFAULT_PIXELS_PER_SECOND,
            fall: DEFAULT_PIXELS_PER_SECOND,
            sink: DEFAULT_PIXELS_PER_SECOND,
            sit: 0,
            death: 0,
        };

        this.framesPerSecond = {
            walk: SPRITE_FPS,
            swim: SWIM_FPS,
            run: SPRITE_FPS * RUN_SPEED_INCREASE_FACTOR,
            jump: SPRITE_FPS,
            attack: SPRITE_FPS,
            stop: 0,
            fall: SPRITE_FPS,
            sit: SPRITE_FPS,
            death: SPRITE_FPS
        };

        this.attackThresholds = {
            min : 3,
            max : 4
        }

        this.frameTargets = {};

        this.frameIdxSounds = {};

    }

    /**
     * Set a sound to play at a particular frame index
     * @param frameIdx the frame index to play the sound at
     * @param sound
     * @returns {CharacterPropertiesBuilder}
     */
    withFrameIndexSound(frameIdx, sound) {
        this.frameIdxSounds[frameIdx] = sound;
        return this;
    }

    /**
     * Set specific rectangular targets for a frame. Used to specify specific attack regions for sprites used to
     * determine attack results for characters. Will override any targets set using withFrameTarget.
     *
     * @param frameTargets hash with keys height, width, bottomOffset, leftOffset
     */
    withFrameTargets(frameTargets) {
        this.frameTargets = frameTargets;
        return this;
    }

    /**
     * Set the minimum attack threshold.
     * @param threshold the min attack threshold
     */
    withMinAttackThreshold(threshold) {
        this.attackThresholds[MIN_LABEL] = threshold;
        return this;
    }

    /**
     * Set the maximum attack threshold.
     * @param threshold the max attack threshold
     */
    withMaxAttackThreshold(threshold) {
        this.attackThresholds[MAX_LABEL] = threshold;
        return this;
    }

    /**
     * Set the can elevate property.
     * @param flag true of the character can automatically traverse elevations, false otherwise.
     * @returns {CharacterPropertiesBuilder} this character properties builder
     */
    withCanElevate(flag) {
        validateRequiredParams(this.withCanElevate, arguments, 'flag');
        this.canElevate = flag;
        return this;
    }

    /**
     * Set the can highlight property.
     * @param flag true if the character can highlight when in attack proximity, false otherwise.
     * @returns {CharacterPropertiesBuilder} this character properties builder
     */
    withCanHighlight(flag) {
        validateRequiredParams(this.withCanHighlight, arguments, 'flag');
        this.canHighlight = flag;
        return this;
    }

    /**
     * Set the can leave behind property.
     * @param flag true if the character can be left behind without being defeated, false otherwise
     * @returns {CharacterPropertiesBuilder} this character properties builder
     */
    withCanLeaveBehind(flag) {
        validateRequiredParams(this.withCanLeaveBehind, arguments, 'flag');
        this.canLeaveBehind = flag;
        return this;
    }

    /**
     * Set the can turn around property.
     * @param flag true if the character can turn around (to chase the Barbarian) false otherwise
     * @returns {CharacterPropertiesBuilder} this character properties builder
     */
    withCanTurnAround(flag) {
        validateRequiredParams(this.withCanTurnAround, arguments, 'flag');
        this.canTurnAround = flag;
        return this;
    }

    /**
     * Set the sound object for the character.
     * @param sound the audio object for the character
     * @returns {CharacterPropertiesBuilder} this character properties builder
     */
    withSound(sound) {
        this.sound = sound;
        return this;
    }

    /**
     * Set the death sprite element.
     * @param sprite the sprite
     * @returns {CharacterPropertiesBuilder} this character properties builder
     */
    withDeathSprite(sprite) {
        validateRequiredParams(this.withDeathSprite, arguments, 'sprite');
        this.deathSprite = sprite;
        return this;
    }

    /**
     * Set whether the character is invincible.
     * @param flag true if the character is invincible, false otherwise
     * @returns {CharacterPropertiesBuilder} this character properties builder
     */
    withIsInvincible(flag) {
        validateRequiredParams(this.withIsInvincible, arguments, 'flag');
        this.isInvincible = flag;
        return this;
    }

    /**
     * Set the default status for the character.
     * @param status the status
     * @returns {CharacterPropertiesBuilder} this character properties builder
     */
    withDefaultStatus(status) {
        validateRequiredParams(this.withDefaultStatus, arguments, 'status');
        this.defaultStatus = status;
        return this;
    }

    /**
     * Set the default action for the character.
     * @param action the action
     * @returns {CharacterPropertiesBuilder} this character properties builder
     */
    withDefaultAction(action) {
        validateRequiredParams(this.withDefaultAction, arguments, 'action');
        this.defaultAction = action;
        return this;
    }

    /**
     * Set the default direction for the character.
     * @param direction the direction
     * @returns {CharacterPropertiesBuilder} this character properties builder
     */
    withDefaultDirection(direction) {
        validateRequiredParams(this.withDefaultDirection, arguments, 'direction');
        this.defaultDirection[HORIZONTAL_LABEL] = direction;
        return this;
    }

    /**
     * Set the default bottom position for the character.
     * @param screenNumber the screen number to set the bottom on
     * @param bottom the bottom in pixels
     * @returns {CharacterPropertiesBuilder} this character properties builder
     */
    withDefaultBottom(screenNumber, bottom) {
        validateRequiredParams(this.withDefaultBottom, arguments, 'screenNumber', 'bottom');
        this.defaultBottom[screenNumber] = bottom;
        return this;
    }

    /**
     * Set the number of times for a particular action for the character.
     * @param action the action to set the number of times for
     * @param numberOfTimes the number of times the action will be performed
     * @returns {CharacterPropertiesBuilder} this character properties builder
     */
    withActionNumberOfTimes(action, numberOfTimes) {
        validateRequiredParams(this.withActionNumberOfTimes, arguments, 'action', 'numberOfTimes');
        this.actionNumberOfTimes[action] = numberOfTimes;
        return this;
    }

    /**
     * Set the pixels per second for a particular action.
     * @param action the action
     * @param pixelsPerSecond the pixels per second
     * @returns {CharacterPropertiesBuilder} this character properties builder
     */
    withPixelsPerSecond(action, pixelsPerSecond) {
        if (action === undefined || pixelsPerSecond === undefined) {
            throw new Error("withPixelsPerSecond: Both action and pixelsPerSecond arguments must be set");
        }
        this.pixelsPerSecond[action] = pixelsPerSecond;
        return this;
    }

    /**
     * Set the frames per second for the particular action.
     * @param action the action
     * @param fps the frames per second
     * @returns {CharacterPropertiesBuilder} this character properties builder
     */
    withFramesPerSecond(action, fps) {
        if (action === undefined || fps === undefined) {
            throw new Error("withFps: Both action and fps arguments must be set");
        }
        this.framesPerSecond[action] = fps;
        return this;
    }

    /**
     * Set the frames object.
     * @param frames the frames object for the character
     * @returns {CharacterPropertiesBuilder}  this character properties builder
     */
    withFrames(frames) {
        this.frames = frames;
        return this;
    }

    withIsSecondaryMonster(flag) {
        this.isSecondaryMonster = flag;
        return this;
    }

    /**
     * Build the character properties object.
     * @returns {CharacterProperties} the character properties
     */
    build() {
        if (this.frames === undefined) {
            throw new Error("CharacterPropertiesBuilder: frames is required although not a part of the constructor " +
                "for readability, please use 'withFrames'");
        }
        return new CharacterProperties(this.sprite, this.frames, this.deathSprite, this.characterType, this.defaultX,
            this.canElevate, this.canHighlight, this.canLeaveBehind, this.canTurnAround, this.isInvincible, this.sound,
            this.actionNumberOfTimes, this.pixelsPerSecond, this.framesPerSecond, this.defaultStatus,
            this.defaultAction, this.defaultDirection, this.defaultBottom,  this.attackThresholds, this.frameTargets,
            this.isSecondaryMonster, this.frameIdxSounds);
    }
}
