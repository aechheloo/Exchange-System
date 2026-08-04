const pool = require("../config/database");

async function initDatabase() {

    /* ===========================
       GROUPS
    =========================== */

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

    /* ===========================
       TRANSACTIONS
    =========================== */

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

    /* ===========================
       EMPLOYEES
    =========================== */

    await pool.query(`

        CREATE TABLE IF NOT EXISTS employees(

            id SERIAL PRIMARY KEY,

            full_name TEXT NOT NULL,

            phone TEXT,

            telegram_id BIGINT,

            group_id INTEGER,

            created_at TIMESTAMP DEFAULT NOW()

        );

    `);

    /* ===========================
       SALARY
    =========================== */

    await pool.query(`

        CREATE TABLE IF NOT EXISTS salary_transactions(

            id SERIAL PRIMARY KEY,

            employee_id INTEGER NOT NULL,

            type VARCHAR(10) NOT NULL,

            amount BIGINT NOT NULL,

            note TEXT,

            created_at TIMESTAMP DEFAULT NOW()

        );

    `);

    /* ===========================
       NOTES
    =========================== */

    await pool.query(`

        CREATE TABLE IF NOT EXISTS notes(

            id SERIAL PRIMARY KEY,

            employee_id INTEGER,

            telegram_group_id BIGINT,

            content TEXT NOT NULL,

            created_at TIMESTAMP DEFAULT NOW()

        );

    `);

    /* ===========================
       DAILY REPORT
    =========================== */

    await pool.query(`

        CREATE TABLE IF NOT EXISTS daily_reports(

            id SERIAL PRIMARY KEY,

            group_id INTEGER,

            total_in BIGINT DEFAULT 0,

            total_out BIGINT DEFAULT 0,

            total_fee BIGINT DEFAULT 0,

            balance BIGINT DEFAULT 0,

            report_date DATE,

            created_at TIMESTAMP DEFAULT NOW()

        );

    `);

    /* ===========================
       MONTHLY REPORT
    =========================== */

    await pool.query(`

        CREATE TABLE IF NOT EXISTS monthly_reports(

            id SERIAL PRIMARY KEY,

            group_id INTEGER,

            total_in BIGINT DEFAULT 0,

            total_out BIGINT DEFAULT 0,

            total_fee BIGINT DEFAULT 0,

            balance BIGINT DEFAULT 0,

            report_month TEXT,

            created_at TIMESTAMP DEFAULT NOW()

        );

    `);

    console.log("✅ Database Ready");

}

module.exports = initDatabase;