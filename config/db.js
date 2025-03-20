// Connecting to the postgres db
const { Pool } = require("pg")

// Loading environment variables
require("dotenv").config()

// Connection details 
// Stored in .env file 
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
})

/*
// Checking the connection status
pool.connect((err) => {
    if (err) {
        return console.error('Error acquiring client \n', err.stack)
    }
    console.log('Connected to database')
})
*/

// Exporting the pool object
module.exports = pool;
