const pool = require("../../config/db");

/**
 * Handles the retrieval of orders with optional filtering, pagination, and statistics.
 *
 * @async
 * @function getOrders
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.query - The query parameters from the request.
 * @param {string} [req.query.page=1] - The page number for pagination.
 * @param {string} [req.query.name] - The name of the user to filter orders by.
 * @param {string} [req.query.status] - The status of the orders to filter by.
 * @param {string} [req.query.from] - The start date to filter orders by (ISO format).
 * @param {string} [req.query.to] - The end date to filter orders by (ISO format).
 * @param {Object} res - The HTTP response object.
 * @returns {void} Responds with a JSON object containing:
 * - `processedToday`: Number of orders processed today.
 * - `receivedToday`: Number of orders received today.
 * - `dueToday`: Number of orders due today.
 * - `overdue`: Number of overdue orders.
 * - `page`: Current page number.
 * - `max`: Maximum number of pages.
 * - `orders`: List of orders matching the filters.
 * @throws {Object} Responds with a 500 status code and an error message if an internal server error occurs.
 */

const getOrders = async(req, res) => {
    try{
        const page = req.query.page || 1;
        const name = req.query.name;
        const status = req.query.status;
        const fromDate = req.query.from;
        const toDate = req.query.to;
        const limit = 30;
        const offset = (page - 1) * limit;

        let query = `SELECT orders.order_id, users.name, orders.status,
                       TO_CHAR(orders.pickup_time, 'DD-MM-YYYY') as pickup_time,
                       TO_CHAR(orders.delivery_time, 'DD-MM-YYYY') as delivery_time,
                       orders.total_price
                FROM orders
                    INNER JOIN users ON users.user_id = orders.user_id
                    WHERE 1=1
                `;

        const params = [];

        if(name){
            params.push(`%${name}%`);
            query += ` AND users.name ILIKE  $${params.length}`;
        }

        if(status){
            params.push(status);
            query += ` AND orders.status = $${params.length} `;
        }

        if(fromDate){
            params.push(fromDate);
            query += ` AND orders.created_at >= $${params.length} `;
        }

        if(toDate){
            params.push(toDate);
            query += ` AND orders.created_at <= $${params.length} `;
        }

        query += ` ORDER BY orders.order_id DESC `

        let counter = query;

        query += `LIMIT ${limit} OFFSET ${offset}`


        const result = await pool.query(query,params);
        const count = await pool.query(counter,params);

        const queries = [
            pool.query(`SELECT COUNT(order_id) FROM orders 
                       WHERE completed_on < NOW() AND completed_on > NOW() - INTERVAL '1 day'`),
            pool.query(`SELECT COUNT(order_id) FROM orders
                       WHERE received_on < NOW() AND received_on > NOW() - INTERVAL '1 day'`),
            pool.query(`SELECT COUNT(order_id) FROM orders 
                       WHERE delivery_time > NOW() AND delivery_time < NOW() + INTERVAL '1 day'`),
            pool.query(`SELECT COUNT(order_id) FROM orders 
                       WHERE delivery_time < NOW() AND status NOT IN ('completed')`)
        ];

        const [processedToday, receivedToday, dueToday, overdue] = await Promise.all(queries);

        const maxPage = Math.ceil(count.rows.length / limit);

        res.status(200).json({processedToday: processedToday.rows[0].count, receivedToday: receivedToday.rows[0].count,
                                dueToday: dueToday.rows[0].count, overdue: overdue.rows[0].count, page: parseInt(page),max: maxPage,
                                orders: result.rows});
    }catch(error){
        res.status(500).json({message : "Internal server error",error: error});
    }
}

module.exports = getOrders;