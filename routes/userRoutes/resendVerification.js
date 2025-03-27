const pool = require("../../config/db")
const sendVerificationEmail = require("../../mail/verificationEmail");

const resendVerification = async (req, res) => {
    try{
        const { email }  = req.body;

        const result = await pool.query(`SELECT user_id, name FROM users WHERE email = $1`, [email]);

        if(result.rows.length === 0){
            res.status(400).json({message : "Unregistered email"})
        }

        await sendVerificationEmail(result.rows[0].user_id , email , result.rows[0].name);

        res.status(200).json({message : `Verification Email sent to ${email}`});
    }catch (error) {
        res.status(500).json({ message : "Internal server error"})
    }
}

module.exports = resendVerification;