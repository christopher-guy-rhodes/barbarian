
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

