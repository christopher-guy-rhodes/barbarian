class Animator {
    constructor(element) {
        this.element = element;
    }

    /**
     * Move the element to position x, y and make the animation take duration seconds.
     * @param element the element to animate
     * @param duration the duration of the animation
     * @param x the x coordinate
     * @param y the y coordinate
     */
    moveToPosition(duration, x, y) {
        this.element.animate({left: x + 'px', bottom: y + 'px'}, duration, 'linear')
    }

    /**
     * Moves an element from it's current position to the new x, y coordinate on the plane.
     * @param element the element to move to move
     * @param x the x coordinate to move to
     * @param y the y coordinate to move to
     * @param pixelsPerSecond the rate at which to move
     */
    moveElementToPosition(x, y, pixelsPerSecond) {
        let distanceX = x === undefined ? 0 : Math.abs(x - this.element.offset().left);
        let distanceY = y === undefined ? 0 : Math.abs(y - stripPxSuffix(this.element.css('bottom')));
        let distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
        let duration = distance / pixelsPerSecond * MILLISECONDS_PER_SECOND;

        this.moveToPosition(duration, x, y);
    }
}
