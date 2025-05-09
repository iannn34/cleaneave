const jwt = require('jsonwebtoken');
const path = require('path');

/**
 * Middleware function to verify if the user has an admin role.
 * Checks the token from the request cookies, decodes it, and verifies the user's role.
 * If the user has an admin role (role === 3), the request proceeds to the next middleware.
 * Otherwise, it responds with a 403 status and serves a "forbidden" HTML page.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.cookies - The cookies from the request.
 * @param {string} req.cookies.token - The JWT token used for authentication.
 * @param {Object} res - The HTTP response object.
 * @param {Function} res.status - Function to set the HTTP status code.
 * @param {Function} res.sendFile - Function to send a file as the response.
 * @param {Function} next - The callback to pass control to the next middleware.
 */

function verifyAdmin(req, res, next) {
    const token = req.cookies.token;
    const payload = jwt.decode(token);

    if(payload && payload.role === 3){
        next();
    }else{
        res.status(403).sendFile(path.join(__dirname,"..","public","html","forbidden.html"));
    }
}

module.exports = verifyAdmin;