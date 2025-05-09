const pool = require("../config/db");

/**
 * Retrieves the user ID associated with a valid token from the database.
 *
 * @async
 * @function getUser
 * @param {string} request - The encoded token from the request.
 * @returns {Promise<?number>} The user ID if the token is valid, or `null` if no matching user is found.
 */

async function getUser(request){
    const token = decodeURIComponent(request);

    const results = await pool.query("SELECT token, user_id FROM tokens WHERE expires_at > NOW() ORDER BY expires_at DESC");

    let user_id = null;

    results.rows.forEach((row)=>{
        if(token === row.token){
            user_id = row.user_id;
        }
    })

    return user_id;
}

module.exports = getUser;