
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
 * Sleep for ms milliseconds.
 * @param ms the number of milliseconds to sleep
 * @returns {Promise<void>} a void promise
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

