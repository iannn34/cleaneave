const getUserId = require("../../middleware/getUserId")
const profileUpdateSchema = require("../../schemas/profile-update");
const pool = require("../../config/db");

/**
 * Updates the profile of a user in the database.
 *
 * @async
 * @function updateProfile
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing user profile data.
 * @param {string} req.body.name - The new name of the user.
 * @param {string} req.body.email - The new email of the user.
 * @param {string} req.body.contact - The new contact information of the user.
 * @param {Object} req.cookies - The cookies from the request.
 * @param {string} req.cookies.token - The authentication token to identify the user.
 * @param {Object} res - The HTTP response object.
 * @returns {void} Sends a JSON response with a success message or an error message.
 *
 * @throws {Object} 422 - Validation error if the input data is invalid.
 * @throws {Object} 500 - Internal server error if an unexpected error occurs.
 */

const updateProfile = (async (req,res) =>{
    try {
        await profileUpdateSchema.validateAsync(req.body,{abortEarly: false});

        const userId = getUserId(req.cookies.token);

        const { name , email , contact } = req.body;

        await pool.query("UPDATE users SET name = $1 , email = $2 , contact = $3 WHERE user_id = $4", [name , email , contact , userId]);

        res.status(200).json({message : "Profile updated successfully!"});
    } catch (error) {
        if(error.isJoi) {
            res.status(422).json({
                message: error.details.map(err => ({
                    fieldName: err.path.join('.'),
                    errorMessage: err.message
                }))
            });
            return;
        }

        res.status(500).json({message : "Internal server error"})
    }
})

module.exports = updateProfile;