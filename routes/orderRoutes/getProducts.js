const pool = require("../../config/db");

const getProducts = async (req,res) => {
    try {
        const product_data = await pool.query("SELECT * FROM products");
        res.json(product_data.rows);
    } catch (error) {
        res.sendStatus(500).json({message : "Internal server error"})
    }
}

module.exports = getProducts;