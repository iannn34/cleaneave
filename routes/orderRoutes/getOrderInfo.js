const pool = require("../../config/db")

const getOrderInfo = async (req,res) => {
    try{
        const orderId = req.params.id;

        const orderDetails = await pool.query("SELECT order_id,status,total_price, TO_CHAR(created_at,'Month DD, YYYY') AS date FROM orders WHERE order_id = $1", [orderId]);

        const orderItems = await pool.query("SELECT name, image_url,order_id, service, quantity, total_unit_price FROM order_items INNER JOIN products ON products.product_id = order_items.product_id WHERE order_id = $1", [orderId]);

        res.status(200).json({orderDetails: orderDetails.rows[0], orderItems: orderItems.rows});
    }catch(err){
        res.status(500).json({message : "Internal server error"});
    }
}

module.exports = getOrderInfo;