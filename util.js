function showMessage(element) {
    element.css('display', 'block');

    for(let i = 0; i < MESSAGES.length; i++) {
        let e = MESSAGES[i];
        if (e[0].classList == element[0].classList) {
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

function handlePromiseError(error) {
    console.log('Error fulfilling promise: ' + error);
}

