const pool = require("../../config/db");

/**
 * Handles the generation of various report data for the application.
 * Fetches data from the database using multiple queries and returns a JSON response
 * containing aggregated statistics such as monthly revenue, customer acquisition,
 * order status counts, service usage, top customers, user count, average order value,
 * average turnaround time, average monthly revenue, and repeat customer rate.
 *
 * @async
 * @function reportData
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the HTTP request.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} Sends a JSON response with the aggregated report data or an error message.
 *
 * @throws {Error} Returns a 500 status code with an error message if an exception occurs.
 */

const reportData = async (req,res) => {
    try{
        const queries = [pool.query(`SELECT TO_CHAR(created_at, 'Month')AS month, EXTRACT(MONTH FROM created_at) AS month_part, 
                                                SUM(total_price) AS total 
                                                FROM orders 
                                                GROUP BY month,month_part 
                                                ORDER BY month_part 
                                                LIMIT 12`),
            pool.query(`SELECT TO_CHAR(created_at, 'Month') AS month, EXTRACT(MONTH FROM created_at) AS month_part, COUNT(user_id) AS users_joined FROM users GROUP BY month, month_part ORDER BY month_part LIMIT 12;`),
            pool.query(`SELECT status, COUNT(order_id) AS order_count FROM orders GROUP BY status ORDER BY CASE status WHEN 'pending' THEN 1 WHEN 'processing' THEN 2 WHEN 'completed' THEN 3 ELSE 4 END`),
            pool.query(`SELECT service, COUNT(item_id) AS service_count FROM order_items GROUP BY service;`),
            pool.query(`SELECT users.name,COUNT(orders.user_id) AS order_count,SUM(orders.total_price)
                 FROM orders
                          INNER JOIN users ON users.user_id=orders.user_id
                 GROUP BY users.name
                     HAVING COUNT(orders.user_id) > 1 
                     ORDER BY order_count DESC 
                     LIMIT 10;`),
            pool.query(`SELECT COUNT(user_id) AS customer_count FROM users WHERE verified = 't';`),
            pool.query(`SELECT CAST(AVG(total_price) AS INTEGER) FROM orders;`),
            pool.query(`SELECT CAST(AVG(delivery_time::DATE - pickup_time::DATE) AS INTEGER) AS avg_turnaround FROM orders;`),
            pool.query(`select cast(avg(total) as integer) from (SELECT TO_CHAR(created_at, 'Month')AS month, SUM(total_price) AS total FROM orders GROUP BY month);`)]

        const [monthlyRevenue, customerAcquisition, statusCount, serviceCount, topCustomers, userCount, avgOrder , avgTurnAround, avgMonthlyRevenue] = await Promise.all(queries)

        const repeatCustomerRate = (topCustomers.rows.length/parseInt(userCount.rows[0].customer_count)) * 100;

        res.status(200).json({monthlyRevenue: monthlyRevenue.rows, customerAcquisition: customerAcquisition.rows,
                                statusCount: statusCount.rows, serviceCount: serviceCount.rows, topCustomers: topCustomers.rows, userCount:
                                userCount.rows[0].customer_count, avgOrder: avgOrder.rows[0].avg,
                                avgMonthlyRevenue : avgMonthlyRevenue.rows[0].avg, avgTurnAround: avgTurnAround.rows[0].avg_turnaround, repeatCustomers: repeatCustomerRate.toFixed(2)})
    }catch(error){
        res.status(500).json({message: "Internal Server Error"});
    }
}

module.exports = reportData;
