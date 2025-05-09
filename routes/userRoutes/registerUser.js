const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const registerSchema = require("../../schemas/registration");
const sendVerificationEmail = require("../../mail/verificationEmail");

/**
 * Registers a new user in the system.
 *
 * @async
 * @function register
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing user details.
 * @param {string} req.body.name - The name of the user.
 * @param {string} req.body.email - The email address of the user.
 * @param {string} req.body.contact - The contact information of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The HTTP response object.
 * @returns {void}
 * @throws {Object} 400 - If the email is already registered.
 * @throws {Object} 422 - If the request body validation fails.
 * @throws {Object} 500 - If an internal server error occurs.
 */

const register = async (req, res) => {
    try {
        const { name, email, contact, password } = req.body;

        await registerSchema.validateAsync(req.body,{abortEarly: false});

        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "Email already registered!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query("INSERT INTO users (name, email, contact, password) VALUES ($1, $2, $3, $4) RETURNING user_id",
            [name, email, contact, hashedPassword]);

        const userID = result.rows[0].user_id;

        await sendVerificationEmail(userID,email,name);

        res.status(200).json({message:"User registered successfully"});
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

        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = register;