const pool = require("../config/db")
const sendWelcomeEmail = require("../mail/welcomeEmail");
const getUser = require("./getUser");


/**
 * Middleware to verify a user's email using a token.
 * 
 * This function checks the validity of the token provided in the request parameters,
 * updates the user's email verification status in the database, and sends a welcome email
 * upon successful verification. If the token is invalid or expired, or if the user is not found,
 * appropriate error responses are returned.
 * 
 * @async
 * @function verifyEmail
 * @param {Object} req - The Express request object.
 * @param {Object} req.params - The parameters of the request.
 * @param {string} req.params.token - The token used to verify the user's email.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} Sends an HTTP response with the appropriate status and message.
 * 
 * @throws {Error} Returns a 500 status code with an "Internal Server Error" message if an unexpected error occurs.
 */

const verifyEmail = (async (req,res) =>{
   try{
       const user_id = await getUser(req.params.token);

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
       console.log(error);
       res.status(500).json({message : "Internal Server Error"});
   }
})

module.exports = verifyEmail;