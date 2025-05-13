const pool = require("../../config/db")

/**
 * Updates the role of a user in the database based on the provided email.
 * 
 * @async
 * @function updateUserRole
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.name - The name of the user.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.role - The new role of the user ("admin", "staff", or other).
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Sends a JSON response with the status of the operation.
 * 
 * @throws {Error} Returns a 404 status if the user is not found or a 500 status if an error occurs during the update.
 */

const updateUserRole = async(req,res) => {
    try{
        const { name, email, role } = req.body;

        if(!name || !email || !role){
            return res.status(404).json({message:"User not found"});
        }
        const roleId = (role === "admin" ? 3 : (role === "staff" ? 1 : 2));

        const result = await pool.query("UPDATE users SET role_id = $1 WHERE email = $2",[roleId, email])

        if(result.rowCount === 0){
            return res.status(404).json({message:"User not found"});
        }
        
        res.status(200).json({message: "User role updated successfully", result: result});
    }catch(error){
        res.status(500).send({message: "Error updating user role. Please try again", error: error});
    }
}

module.exports = updateUserRole;