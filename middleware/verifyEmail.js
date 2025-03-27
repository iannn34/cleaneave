const pool = require("../config/db")
const sendWelcomeEmail = require("../mail/welcomeEmail");
const getUserId = require("./getUserId");


const verifyEmail = (async (req,res) =>{
   try{
       const user_id = await getUserId(req.params.token);

       if (!user_id) {
           return res.status(400).json({ message: "Invalid or expired token." });
       }

       const emailDetails = await pool.query("UPDATE users SET verified = true WHERE user_id = $1 RETURNING name,email",[user_id]);

       if (emailDetails.rowCount === 0) {
           return res.status(404).json({ message: "User  not found." });
       }

       await sendWelcomeEmail(emailDetails.rows[0].name , emailDetails.rows[0].email)

       res.status(200).redirect("/login")
   }catch (error){
       res.status(500).json({message : "Internal Server Error"});
   }
})

module.exports = verifyEmail;