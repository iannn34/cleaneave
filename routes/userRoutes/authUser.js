import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../config/db";

/**
 * Handles user login by verifying email and password, generating a JWT token, and storing it in a cookie.
 * 
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The response object.
 * 
 * @returns {Promise<void>} - Returns a promise that resolves to void.
 * 
 * @throws {Error} - Throws an error if there is an issue with the database query or token generation.
 */


const login = async (req,res) => {
    try {
        const { email , password } = req.body;

        let user;

        try {
            user = await pool.query(`SELECT user_id,password,role_id FROM users WHERE email = $1` ,[email]);
        } catch (dbError) {
            return res.status(500).json({ message: "Database query error" });
        }

        if (user.rows.length === 0) {
            return res.status(404).json({message : "Unregistered email"});
        }

        const hashedPassword = user.rows[0].password;

        const auth = await bcrypt.compare(password, hashedPassword);

        if(auth){
            const accessToken  = jwt.sign({user_id:user.rows[0].user_id, role: user.rows[0].role_id} , process.env.SECRET_KEY, {expiresIn: '1h'});

            res.cookie("token", accessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000
            })

            res.json({ message: "Login successful, token generated" })
        } else {
            return res.status(401).json({message : "Invalid password"});
        }
    } catch (error) {
        res.status(500).json({ message : "Internal server error"})
    }
}

module.exports = login;