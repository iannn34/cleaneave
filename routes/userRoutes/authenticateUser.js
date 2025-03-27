const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../../config/db");
const loginSchema = require("../../schemas/login");
const sendVerificationMail = require("../../mail/verificationEmail")

const login = async (req,res) => {
    try {
        const { email , password } = req.body;

        await loginSchema.validateAsync(req.body);

        let user;

        try {
            user = await pool.query(`SELECT user_id, name , password , role_id , verified FROM users WHERE email = $1` ,[email]);
        } catch (dbError) {
            return res.status(500).json({ message: "Database query error" });
        }

        if (user.rows.length === 0) {
            return res.status(401).json({message : "Incorrect email and password combination. \nPlease try again or click Forgot password to reset your password"});
        }

        const hashedPassword = user.rows[0].password;

        const auth = await bcrypt.compare(password, hashedPassword);

        if(!user.rows[0].verified){
            await sendVerificationMail(user.rows[0].user_id , email , user.rows[0].name);

            return res.status(302).json({ redirectUrl: `/verify-email/email/${encodeURIComponent(email)}` });
        }

        if(auth){
            const accessToken  = jwt.sign({user_id:user.rows[0].user_id, role: user.rows[0].role_id} , process.env.SECRET_KEY, {expiresIn: '1h'});

            res.cookie("token", accessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000
            })

            res.json({ message: "Login successful, token generated" })
        } else {
            return res.status(401).json({message : "Incorrect email and password combination. \nPlease try again or click Forgot password to reset your password"});
        }
    } catch (error) {
        if(error.isJoi){
            res.status(422).json({message  : error.details.map(err => ({
                    fieldName : err.path.join('.'),
                    errorMessage : err.message
                }))});
            return;
        }

        res.status(500).json({ message : "Internal server error"})
    }
}

module.exports = login;