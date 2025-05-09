const pool = require("../../config/db");

/**
 * Retrieves all products from the database and sends them as a JSON response.
 *
 * @async
 * @function getProducts
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {void} Sends a JSON response containing product data or an error message.
 * @throws {Error} Returns a 500 status code with an error message if an exception occurs.
 */

const getProducts = async (req,res) => {
    try {
        const product_data = await pool.query("SELECT * FROM products");
        res.json({data: product_data.rows});
    } catch (error) {
        res.status(500).json({message : "Internal server error"})
    }
}

module.exports = getProducts;