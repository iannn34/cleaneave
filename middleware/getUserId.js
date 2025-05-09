const jwt = require('jsonwebtoken');

/**
 * Decodes a JWT token and retrieves the user ID from its payload.
 *
 * @param {string} token - The JWT token to decode.
 * @returns {string|number} The user ID extracted from the token payload.
 */

function getUserId(token) {
    try{
        const payload = jwt.decode(token);

        return payload.user_id;
    }catch(error){
        throw error;
    }
}

module.exports = getUserId;