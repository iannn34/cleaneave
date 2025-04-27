const pool = require("../../config/db")
const sendVerificationEmail = require("../../mail/verificationEmail");

/**
 * Handles the resending of a verification email to a user.
 *
 * @async
 * @function resendVerification
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.email - The email address of the user to resend the verification email to.
 * @param {Object} res - The response object.
 * @returns {void}
 * @throws {Error} Returns a 400 status if the email is not registered, or a 500 status for internal server errors.
 */

const resendVerification = async (req, res) => {
    try{
        const { email }  = req.body;

        const result = await pool.query(`SELECT user_id, name FROM users WHERE email = $1`, [email]);

        if(result.rows.length === 0){
            res.status(400).json({message : "Unregistered email"})
        }

        await sendVerificationEmail(result.rows[0].user_id , email , result.rows[0].name);

        res.status(200).json({message : `Verification email resent to ${email}`});
    }catch (error) {
        res.status(500).json({ message : "Internal server error"})
    }
}

module.exports = resendVerification;