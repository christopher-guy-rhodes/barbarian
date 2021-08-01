function showMessage(element) {
    element.css('display', 'block');

    // Hide the other messages that are not being displayed
    for (e of MESSAGES) {
        if (e == element) {
            continue;
        }
        e.css('display', 'none');
    }
}

function hideMessage(element) {
    element.css('display', 'none');
}

function filterBarbarianSprite(sprites) {
    let result = [];
    for (let sprite of sprites) {
        if (isMonster(sprite)) {
            result.push(sprite);
        }
    }
    return result;
}
