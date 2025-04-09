const bcrypt = require("bcrypt");
const getUser = require("../../middleware/getUser");
const passwordSchema = require("../../schemas/password-reset");
const pool = require("../../config/db");


/**
 * Handles the password reset process for a user.
 *
 * @async
 * @function resetPassword
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.token - The token used to identify the user.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.password - The new password provided by the user.
 * @param {Object} res - The HTTP response object.
 * @returns {void} Sends a JSON response with a redirect URL or an error message.
 *
 * @throws {Object} 303 - Redirects to the password reset page if the user is not found.
 * @throws {Object} 422 - Validation error if the password does not meet the schema requirements.
 * @throws {Object} 500 - Internal server error for unexpected issues.
 */

const resetPassword = (async (req, res) => {
    try{
        const user_id = await getUser(req.params.token);
        const { password } = req.body;


        if (user_id === null) {
            return res.status(303).json({redirectURL : "/password-reset"});
        }

        await passwordSchema.validateAsync(req.body,{abortEarly: false})

        const hashedPassword = await bcrypt.hash(password, 10)

        await pool.query(`UPDATE users SET password = $1 WHERE user_id = $2 RETURNING name, email` ,[hashedPassword ,user_id])

        res.status(200).json({redirectURL : "/login"});
    }catch(error){
        if(error.isJoi) {
            res.status(422).json({errorMessage: error.details[0].message});
            return;
        }
        res.status(500).json({ message: "Internal server error" });
    }
})

module.exports = resetPassword;

