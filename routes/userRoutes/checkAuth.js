/**
 * Middleware function to check user authentication status.
 * 
 * This function verifies the presence of a token in the request cookies.
 * If the token is missing, it responds with a 401 status and an "Unauthenticated" message.
 * If the token is present, it responds with a 200 status and an "Authenticated user" message.
 * 
 * @async
 * @function checkAuth
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.cookies - The cookies object from the request.
 * @param {string} req.cookies.token - The authentication token.
 * @param {Object} res - The HTTP response object.
 * @returns {void} Sends a JSON response indicating authentication status.
 */

const checkAuth = async (req,res) => {
    try{
        const token = req.cookies.token;

        if(!token){
           return res.status(401).json({message:"Unauthenticated"});
        }

        res.status(200).json({message : "Authenticated user"});
    }catch(error){
        res.status(401).json({message: error});
    }
}

module.exports = checkAuth;