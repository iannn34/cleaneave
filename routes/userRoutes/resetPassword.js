const bcrypt = require("bcrypt");
const pool = require("../../config/db")
const passwordSchema = require("../../schemas/passwordReset")
const getUser = require("../../middleware/getUser");


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

        //console.error("Registration error:", error);
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

module.exports = resetPassword;

