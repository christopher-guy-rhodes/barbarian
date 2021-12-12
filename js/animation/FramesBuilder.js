class FramesBuilder {
    constructor() {
        this.frames = {};
    }

    /**
     * Builds the frames and frame height offset for a particular action and direction
     * @param action the action associated with the frames
     * @param direction the direction associated with the frames
     * @param frames the frame indexes for the action and direction
     * @param heightOffset the height offset of the sprite
     * @returns {FramesBuilder}
     */
    withFrames(action, direction, frames, heightOffset) {
        validateRequiredParams(this.withFrames, arguments, 'action', 'direction', 'frames', 'heightOffset');

        if (this.frames[action] === undefined) {
            this.frames[action] = {};
        }
        if (this.frames[action][direction] === undefined) {
            this.frames[action][direction] = {};
        }

        this.frames[action][direction]['frames'] = frames;
        this.frames[action][direction]['heightOffset'] = heightOffset;
        return this;
    }

    /**
     * Build the Frames object.
     * @returns {Frames} the frames object
     */
    build() {
        return new Frames(this.frames);
    }
}
