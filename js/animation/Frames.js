class Frames {
    constructor(frames) {
        this.frames = frames;
    }

    /**
     * Get the frame indicies for a particular action and direction.
     * @param action the action being take
     * @param direction the direction
     * @returns {[number]|undefined}
     */
    getFrames(action, direction) {
        validateRequiredParams(this.getFrames, arguments, 'action', 'direction');
        return this.frames[action][direction][FRAMES_LABEL];
    }

    /**
     * Get the frame height offset for a particular action and direction
     * @param action the action being take
     * @param direction the direction
     * @returns {number|undefined}
     */
    getFrameHeightOffset(action, direction) {
        validateRequiredParams(this.getFrameHeightOffset, arguments, 'action', 'direction');
        return this.frames[action][direction][HEIGHT_OFFSET_LABEL];
    }
}
