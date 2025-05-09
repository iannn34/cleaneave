const getUserId = require("../../middleware/getUserId");
const invoiceEmail = require("../../mail/invoiceEmail");
const pool = require("../../config/db");

/**
 * Handles the placement of an order by inserting order details and associated items into the database.
 * Validates the request body, processes the order, and sends a confirmation email.
 *
 * @async
 * @function order
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing order details.
 * @param {Array} req.body.items - Array of items in the order.
 * @param {number} req.body.totalPrice - Total price of the order.
 * @param {string} req.body.pickUpTime - Scheduled pickup time for the order.
 * @param {string} req.body.deliveryTime - Scheduled delivery time for the order.
 * @param {string} req.body.location - Delivery location for the order.
 * @param {Object} req.cookies - Cookies from the request, used to retrieve the user token.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} Sends a JSON response with a success message and redirect URL, or an error message.
 *
 * @throws {Error} Returns a 400 status if required fields are missing in the request body.
 * @throws {Error} Returns a 500 status if an internal server error occurs.
 */

const order = async (req,res) => {
    const userId = getUserId(req.cookies.token);
    const client = await pool.connect();

    try {
        const { items , totalPrice , pickUpTime , deliveryTime , location } = req.body;

        if (!totalPrice || !pickUpTime || !deliveryTime || !location) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        if(items.length === 0){
            return res.status(400).json({ message: "No items found" });
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

        await invoiceEmail(orderId);

        res.status(200).json({ message: "Order placed successfully!" ,redirectURL : `/order-details/${orderId}`});
    } catch (error) {
        await client.query("ROLLBACK");
        res.status(500).json({ message: "Internal server error" });
    } finally {
        client.release();
    }
}

module.exports = order;