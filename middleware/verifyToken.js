const jwt = require("jsonwebtoken");

/**
 * Middleware function to verify the JWT token from cookies.
 * If the token is not present or invalid, redirects to the login page.
 * If the token is valid, attaches the user information to the request object.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */


function verifyToken(req, res, next){
    const token = req.cookies.token;

    if(token == null) return res.redirect("/login");

    try {
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if(err) return res.redirect("/login");
            req.user = user;
            next();
        })
    } catch (error) {
        res.clearCookie("token");
        res.redirect("/login");
    }
} 

module.exports = verifyToken;