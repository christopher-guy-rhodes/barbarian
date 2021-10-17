class FramesBuilder {
    constructor() {
        this.frames = {};
    }

    withFrames(action, direction, frames, heightOffset) {
        validateRequiredParams(this.withFrames, arguments, 'action', 'direction', 'frames', 'heightOffset');
        //console.log("setting action:%s direction:%s, frames:%s to %o", action, direction, 'frames', frames);

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

    build() {
        return new Frames(this.frames);
    }
}
