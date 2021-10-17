class Frames {
    constructor(frames) {
        this.frames = frames;
    }

    getFrames(action, direction) {
        validateRequiredParams(this.getFrames, arguments, 'action', 'direction');
        return this.frames[action][direction][FRAMES_LABEL];
    }

    getFrameHeightOffset(action, direction) {
        validateRequiredParams(this.getFrameHeightOffset, arguments, 'action', 'direction');
        return this.frames[action][direction][HEIGHT_OFFSET_LABEL];
    }
}
