const passwordResetEmail = require("../../mail/passwordResetEmail")
const pool = require("../../config/db")

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