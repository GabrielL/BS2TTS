/**
 * Replaces any troublesome characters with "sanitized" versions to not break scripting
 * @param {string} str The string to be sanitized
 * @returns {string} The sanitized string
 */
function sanitize(str) {
    const SANITIZATION_MAPPING = {
        " & ": " and ",
        ">": "\uff1e",
        "<": "\uff1c"
    };
    const SANITIZATION_REGEX = new RegExp(Object.keys(SANITIZATION_MAPPING).join("|"), "g");

    return str.replace(SANITIZATION_REGEX, match => SANITIZATION_MAPPING[match]);
}

module.exports.sanitize = sanitize