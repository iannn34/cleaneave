const pool = require("../../config/db");

const getProducts = async (req,res) => {
    try {
        const product_data = await pool.query("SELECT * FROM products");
        res.json({data: product_data.rows});
    } catch (error) {
        res.status(500).json({message : "Internal server error"})
    }
}

module.exports = getProducts;