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

function hideAllMessages() {
    for(let i = 0; i < MESSAGES.length; i++) {
        let e = MESSAGES[i];
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

function stripPxSuffix(field) {
    return field.substring(0, field.length - 2);
}

function setDisplay(sprite, display) {
    sprite.css('display', display);
}

function show(sprite) {
    sprite.css('display', 'block');
}

function hide(sprite) {
    sprite.css('display', 'none');
}

function setSpriteCss(element, prop, value) {
    setCss(getProperty(element, SPRITE), prop, value);
}

function testCss(element, prop, testValue) {
    return element.css(prop) === testValue;
}

function setCss(element, prop, value) {
    element.css(prop, value);
}

function getProperty() {
    let value = arguments[0];
    let sprite = arguments[0];
    for (let i = 1; i < arguments.length; i++) {
        value = value[arguments[i]];
    }
    return value;
}

function compareProperty() {
    let value = arguments[0];
    let testValue = arguments[arguments.length - 1];
    for (let i = 1; i < arguments.length - 1; i++) {
        value = value[arguments[i]];
    }
    return value === testValue;
}

function setProperty() {
    let obj = arguments[0];
    let value = arguments[arguments.length - 1];
    let path = Array.from(arguments).slice(1, arguments.length - 1);
    setNestedKey(obj, path, value);
}

function setNestedKey(obj, path, value) {
    if (path.length === 1) {
        obj[path] = value
        return
    }
    return setNestedKey(obj[path[0]], path.slice(1), value)
}
