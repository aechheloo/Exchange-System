const pool = require("../config/database");

async function initDatabase() {

    await pool.query(`

        CREATE TABLE IF NOT EXISTS groups(

            id SERIAL PRIMARY KEY,

            telegram_group_id BIGINT UNIQUE NOT NULL,

            group_name TEXT NOT NULL,

            fee_percent NUMERIC(5,2) DEFAULT 0,

            balance BIGINT DEFAULT 0,

            created_at TIMESTAMP DEFAULT NOW()

        );

    `);

    console.log("✅ Groups table ready");

}

module.exports = initDatabase;