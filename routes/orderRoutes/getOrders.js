const pool = require("../../config/db");

const getOrders = async(req, res) => {
    try{
        const page = req.query.page || 1;
        const name = req.query.name;
        const status = req.query.status;
        const fromDate = req.query.from;
        const toDate = req.query.to;
        const limit = 30;
        const offset = (page - 1) * limit;

        // let filter = ""

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

        query += ` ORDER BY orders.order_id DESC
                LIMIT ${limit} OFFSET ${offset}`

        console.log(query,params);

        const result = await pool.query(query,params);

        const queries = [
            pool.query(`SELECT COUNT(order_id) FROM orders 
                       WHERE completed_on < NOW() AND completed_on > NOW() - INTERVAL '1 day'`),
            pool.query(`SELECT COUNT(order_id) FROM orders
                       WHERE received_on < NOW() AND received_on > NOW() - INTERVAL '1 day'`),
            pool.query(`SELECT COUNT(order_id) FROM orders 
                       WHERE delivery_time > NOW() AND delivery_time < NOW() + INTERVAL '1 day'`),
            pool.query(`SELECT COUNT(order_id) FROM orders 
                       WHERE delivery_time < NOW() AND status NOT IN ('completed')`),
            pool.query(`SELECT COUNT(*) FROM orders`)
        ];

        const [processedToday, receivedToday, dueToday, overdue,count] = await Promise.all(queries);

        const maxPage = Math.ceil(count.rows[0].count / limit);

        res.status(200).json({processedToday: processedToday.rows[0].count, receivedToday: receivedToday.rows[0].count,
                                dueToday: dueToday.rows[0].count, overdue: overdue.rows[0].count, page: parseInt(page),max: maxPage,
                                orders: result.rows});
    }catch(error){
        res.status(500).json({message : "Internal server error",error: error});
    }
}

module.exports = getOrders;