const getUserId = require("../../middleware/getUserId")
const pool = require("../../config/db");

/**
 * Handles the retrieval of user information and their associated orders.
 * 
 * @async
 * @function getUserInfo
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.cookies - The cookies from the request.
 * @param {string} req.cookies.token - The authentication token used to identify the user.
 * @param {Object} res - The HTTP response object.
 * @returns {void} Sends a JSON response containing user data and order data, or an error message.
 * 
 * @throws {Error} Returns a 500 status code with an error message if an internal server error occurs.
 */

const getUserInfo = async (req,res) => {
    try{
        const userId = getUserId(req.cookies.token);

        const userData = await pool.query("SELECT * FROM users WHERE user_id = $1",[userId]);

        const orderData = await pool.query("SELECT * FROM orders WHERE user_id = $1 ORDER BY order_id DESC",[userId]);

        res.json({userData : userData.rows[0], orderData: orderData.rows})
    }catch(error){
        res.status(500).json({message : "Internal server error"})
    }
}

module.exports = getUserInfo;