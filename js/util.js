
/**
 * Handles an error from a promise.
 * @param error the error.
 */
function handlePromiseError(error) {
    alert('An error has occurred, please check the console log');
    console.log('error %o', error);
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

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

/**
 * Get the parameters for a given function.
 * @param func the function
 * @returns {RegExpMatchArray} the regex match array
 */
function getParamNames(func) {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if(result === null)
        result = [];
    return result;
}

/**
 * Validate the required parameters by making sure they are not undefined.
 * @param func the function to validate the parameters for
 * @param values the values that are expected to not be undefined.
 */
function validateRequiredParams(func, values) {
    if (func === undefined) {
        throw new Error("Cannot validate parameters if function is not passed in");
    }
    if (values === undefined || values.length < 1) {
        throw new Error("Cannot validate parameters if parameters to validate is empty or undefined");
    }

    let argumentNames = getParamNames(func);
    let argumentNameIndex = argumentNames.reduce(
        (hash, elem, index) => {
            hash[elem] = index;
            return hash;
        }, {});

    let requiredArgsNames = Array.from(arguments).slice(2);
    for (let requiredArgName of requiredArgsNames) {
        let index = argumentNameIndex[requiredArgName];
        if (values[index] === undefined) {
            throw new Error("function " + func.name + " is missing required parameter \"" + requiredArgName + "\"");
        }
    }
}
