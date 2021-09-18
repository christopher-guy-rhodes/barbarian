/**
 * Shows a particular message and hide all other messages.
 * @param message the message to show
 */
function showMessage(message) {
    $.each(MESSAGES, function(idx, e) {
        setCss(e, 'display', e[0].classList !== message[0].classList ? 'none' : 'block');
    });
}

/**
 * Hide all messages.
 */
function hideAllMessages() {
    $.each(MESSAGES, function(idx, e) {
        setCss(e, 'display','none');
    });
}

/**
 * Filters out the barbarian character from an array of characters
 * @param characters the characters to filter
 * @returns {*}
 */
function filterBarbarianCharacter(characters) {
    return characters.filter(character => character.getName() != BARBARIAN_SPRITE_NAME);
}

/**
 * Handles an error from a promise.
 * @param error the error.
 */
function handlePromiseError(error) {
    alert('An error has occurred, please check the console log');
    console.log("Error fulfilling promise: %o", error);
}

/**
 * Remove the "px" suffix from a string.
 * @param field the field that may contain the "px" suffix
 * @returns {string} the string with the "px" suffix removed
 */
function stripPxSuffix(field) {
    return field.substring(0, field.length - 2);
}

/**
 * Sets a css property for the element a character.
 * @param character the character to set the css property for
 * @param prop the css property to set
 * @param value the value to set the css property to
 */
function setCharacterCss(character, prop, value) {
    setCss(character.getSprite(), prop, value);
}

/**
 * Tests if the given element has a property with the specified value.
 * @param element the element to test
 * @param prop the prop of the element to test
 * @param testValue the value to compare the prop to
 * @returns {boolean} true if the property of the element is equal to the test, false otherwise
 */
function testCss(element, prop, testValue) {
    return element.css(prop) === testValue;
}

/**
 * Sets the css property of an element setCss($('.foo), 'a', 'b') is equivalent to for $('.foo').css('a', 'b').
 * @param element the element to set the css property of
 * @param prop the property to set
 * @param value the value to set the property to
 */
function setCss(element, prop, value) {
    element.css(prop, value);
}

/**
 * Gets the css property of element
 * @param element the element to get the css property of
 * @param prop the prop to get
 * @returns {*}
 */
function getCss(element, prop) {
    return element.css(prop);
}

/**
 * Gets a property from ann object. getProperty(A, B, C) is equivalent for A[B][C].
 */
function getProperty() {
    let value = arguments[0];

    $.each(Array.from(arguments).slice(1), function(idx, key) {
       value = value[key];
    });

    return value;
}

/**
 * Compares a property to a particular value a[b][c] === d is equivalent to compareProperty(a, b, c, d);
 * @returns {boolean} true if the property equals the test value, false otherwise
 */
function compareProperty() {
    let value = arguments[0];
    let testValue = arguments[arguments.length - 1];

    $.each(Array.from(arguments).slice(1, arguments.length -1), function(idx, key) {
       value = value[key] ;
    });

    return value === testValue;
}

/**
 * Sets a property. a[b] = c is equivalent to setProperty(a, b, c).
 */
function setProperty() {
    let obj = arguments[0];
    let value = arguments[arguments.length - 1];
    let path = Array.from(arguments).slice(1, arguments.length - 1);
    setNestedKey(obj, path, value);
}

/**
 * Recursively sets the keys dictated by path in object to value. setNextedKey(a, [b,c], d) is equivalent to
 * a[b][c] = d.
 * @param obj the object to set a property for
 * @param path the path that defines the nested keys to set
 * @param value the value to set the nexted object to
 * @returns {undefined}
 */
function setNestedKey(obj, path, value) {
    if (path.length === 1) {
        obj[path] = value;
        return;
    }
    return setNestedKey(obj[path[0]], path.slice(1), value);
}

/**
 * Sleep for ms milliseconds.
 * @param ms the number of milliseconds to sleep
 * @returns {Promise<void>} a void promise
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

