const jwt = require('jsonwebtoken');
const path = require('path');

/**
 * Middleware function to verify if the user is a staff member.
 * 
 * This function decodes the JWT token from the request cookies and checks if the user's role is 1 (staff).
 * If the user is a staff member, the request is passed to the next middleware function.
 * Otherwise, a 403 Forbidden status is sent as the response.
 * 
 * @param {Object} req - The request object.
 * @param {Object} req.cookies - The cookie object from the request.
 * @param {string} req.cookies.token - The JWT token from the cookies.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */


function verifyStaff(req, res, next) {
    const token = req.cookies.token;
    const payload = jwt.decode(token);

    if(payload && payload.role === 1){
        next();
    }else{
        res.status(403).sendFile(path.join(__dirname,"..","public","html","forbidden.html"));
    }
}

module.exports = verifyStaff;