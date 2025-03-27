const pool = require("../config/db");

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