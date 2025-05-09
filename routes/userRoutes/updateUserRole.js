const pool = require("../../config/db")

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