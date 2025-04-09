const passwordResetEmail = require("../../mail/passwordResetEmail")
const pool = require("../../config/db")

/**
 * Handles a password reset request by verifying the user's email, 
 * sending a password reset email, and responding with appropriate status messages.
 *
 * @async
 * @function passwordResetRequest
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.email - The email address of the user requesting a password reset.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} Sends a JSON response with a success or error message.
 *
 * @throws {Error} Returns a 404 status if the email is not registered.
 * @throws {Error} Returns a 500 status if an internal server error occurs.
 */

const passwordResetRequest = (async (req,res) => {
    try{
        const { email } = req.body;

        const result = await pool.query("SELECT user_id, name FROM users WHERE email = $1", [email]);

        if(result.rows.length === 0){
            return res.status(404).json({message : "Unregistered email"})
        }

        await passwordResetEmail(result.rows[0].user_id, email, result.rows[0].name);

        res.status(200).json({message : `Link to reset password sent to ${email}`})
    }catch(error){
        res.status(500).json({message : "Internal server error"})
    }
})

module.exports = passwordResetRequest;