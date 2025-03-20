const jwt = require('jsonwebtoken');

function getUserId(token) {
    const payload = jwt.decode(token);

    return payload.user_id;
}

module.exports = getUserId;