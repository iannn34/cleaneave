const getUserId = require("../../middleware/getUserId");
const pool = require("../../config/db");

const order = async (req,res) => {
    const token = req.cookies.token;
    const userId = getUserId(token);
    const client = await pool.connect();

    try {
        const { items , totalPrice , pickUpTime , deliveryTime , location } = req.body;

        // Validate request body
        if (!items || !totalPrice || !pickUpTime || !deliveryTime || !location) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        await client.query("BEGIN")

        const result = await client.query(
            "INSERT INTO orders (user_id, total_price ,pickup_time,delivery_time,location) VALUES ($1,$2,$3,$4,$5) RETURNING order_id",
            [userId, totalPrice, pickUpTime, deliveryTime, location]);

        const orderId = result.rows[0].order_id;

        const orderItemQueries = items.map(item =>
            client.query(
                "INSERT INTO order_items (order_id, product_id, quantity, total_unit_price, service) VALUES ($1, $2, $3, $4, $5)",
                [orderId, item.productId, item.quantity, item.totalUnitPrice, item.service]
            )
        );

        await Promise.all(orderItemQueries);

        await client.query("COMMIT");

        res.status(201).json({ message: "Order placed successfully!" ,redirectURL : "/"});
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Order error:", error); // Log the error for debugging
        res.status(500).json({ message: "Internal server error" });
    } finally {
        client.release();
    }
}

module.exports = order;