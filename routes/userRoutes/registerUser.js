const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const joi = require("joi");
const registerSchema = require("../../schemas/registration");
const sendWelcome = require("../../mail/newMember")

const register = async (req, res) => {
    try {
        const { name, email, contact, password } = req.body;
       //
       // if (!name || !email || !contact || !password) {
       //     return res.status(400).json({ message: "All fields are required!" });
       // }
        await registerSchema.validateAsync(req.body,{abortEarly: false});


        // Check if email already exists
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "Email already registered!" });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into database
        await pool.query("INSERT INTO users (name, email, contact, password) VALUES ($1, $2, $3, $4)",
            [name, email, contact, hashedPassword]);

        // Send success message
        res.json({ message: "User registered successfully!" });


        await sendWelcome(name, email);
    } catch (error) {
        if(error.isJoi){
            res.status(422).json({message  : error.details.map(err => ({
                    fieldName : err.path.join('.'),
                    errorMessage : err.message
            }))});
            return;
        }

        //console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = register;