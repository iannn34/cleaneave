const bcrypt = require("bcrypt")
const crypto = require("crypto")
const pool = require("../config/db")
require('dotenv').config();


function generateOTP() {
    const buffer = crypto.randomBytes(6);
    return Array.from(buffer, num => num % 10).join('').padStart(6, '0');
}

/**
 * Generates an email token for a given user ID, hashes it, and stores it in the database.
 *
 * @async
 * @function generateEmailToken
 * @param {number} user_id - The ID of the user for whom the token is being generated.
 * @returns {Promise<string>} The hashed token that was generated and stored.
 * @throws {Error} Logs and handles any errors that occur during token generation or database operations.
 */


async function generateEmailToken(user_id) {
    try{
        let OTP = generateOTP();

        let token = await bcrypt.hash(OTP, 10);

        await pool.query("INSERT INTO tokens (token, user_id) VALUES ($1 , $2)", [token, user_id])

        return token;
    }catch (error){
        console.log(error)
    }
}

module.exports = generateEmailToken;