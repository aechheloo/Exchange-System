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

    await pool.query(`

        CREATE TABLE IF NOT EXISTS transactions(

            id SERIAL PRIMARY KEY,

            group_id INTEGER NOT NULL,

            type VARCHAR(20) NOT NULL,

            amount BIGINT NOT NULL,

            fee BIGINT DEFAULT 0,

            note TEXT,

            created_at TIMESTAMP DEFAULT NOW(),

            CONSTRAINT fk_group
            FOREIGN KEY(group_id)
            REFERENCES groups(id)
            ON DELETE CASCADE

        );

    `);

    console.log("✅ Groups table ready");
    console.log("✅ Transactions table ready");

}

module.exports = initDatabase;