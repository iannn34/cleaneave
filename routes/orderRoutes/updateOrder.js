const getUser = require("../../middleware/getUser");
const orderReceived = require("../../mail/orderReceivedEmail");
const orderCompleted = require("../../mail/orderCompletedEmail");
const pool = require("../../config/db");

const updateOrder = async (req,res) => {
    try{
        const userId = await getUser(req.cookies.token);
        const orderId = req.params.id;
        const { status, data } = req.body;

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