const getUser = require("../../middleware/getUser");
const orderReceived = require("../../mail/orderReceivedEmail");
const orderCompleted = require("../../mail/orderCompletedEmail");
const pool = require("../../config/db");

/**
 * Updates the status of an order in the database and performs additional actions
 * based on the new status.
 *
 * @async
 * @function updateOrder
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.cookies - The cookies from the request.
 * @param {string} req.cookies.token - The authentication token of the user.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.id - The ID of the order to update.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.status - The new status of the order (e.g., "processing").
 * @param {Object} req.body.data - Additional data related to the order.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} Sends a JSON response indicating success or failure.
 * @throws {Error} Returns a 500 status code with an error message if an exception occurs.
 */

const updateOrder = async (req,res) => {
    try{
        const userId = await getUser(req.cookies.token);
        const orderId = req.params.id;
        const { status, data } = req.body;

        if(!status || !data){
            return res.status(400).json({message: "All fields are required"})
        }

        if(status === "processing"){
            await pool.query("UPDATE orders SET status = $1, received_on = CURRENT_TIMESTAMP, handled_by = $2 WHERE order_id = $3",[status,userId,orderId]);

            await orderReceived(data);
        }else{
            await pool.query("UPDATE orders SET status = $1, completed_on = CURRENT_TIMESTAMP, handled_by = $2 WHERE order_id = $3",[status,userId,orderId]);

            await orderCompleted(data.orderDetails);
        }

        res.status(200).json({message : "Order updated successfully"});
    }catch(error){
        res.status(500).json({message : "Internal server error", error: error.message});
    }
}

module.exports = updateOrder;