const pool = require("../config/database");

async function initDatabase() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS groups (
            id SERIAL PRIMARY KEY,
            telegram_group_id BIGINT UNIQUE NOT NULL,
            group_name TEXT NOT NULL,
            fee_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
            balance NUMERIC(18,2) NOT NULL DEFAULT 0,
            daily_in NUMERIC(18,2) NOT NULL DEFAULT 0,
            daily_out NUMERIC(18,2) NOT NULL DEFAULT 0,
            daily_fee NUMERIC(18,2) NOT NULL DEFAULT 0,
            daily_tx_count INTEGER NOT NULL DEFAULT 0,
            active BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            telegram_user_id BIGINT UNIQUE NOT NULL,
            display_name TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'staff'
                CHECK (role IN ('super_admin', 'staff')),
            active BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS permissions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            UNIQUE (user_id, group_id)
        );

        CREATE TABLE IF NOT EXISTS transactions (
            id BIGSERIAL PRIMARY KEY,
            group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
            type TEXT NOT NULL CHECK (type IN ('IN', 'OUT', 'ADJUSTMENT')),
            amount NUMERIC(18,2) NOT NULL,
            fee_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
            fee_amount NUMERIC(18,2) NOT NULL DEFAULT 0,
            net_amount NUMERIC(18,2) NOT NULL DEFAULT 0,
            balance_after NUMERIC(18,2) NOT NULL,
            telegram_user_id BIGINT NOT NULL,
            telegram_username TEXT,
            note TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS daily_closings (
            id BIGSERIAL PRIMARY KEY,
            group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
            total_in NUMERIC(18,2) NOT NULL DEFAULT 0,
            total_out NUMERIC(18,2) NOT NULL DEFAULT 0,
            total_fee NUMERIC(18,2) NOT NULL DEFAULT 0,
            closing_balance NUMERIC(18,2) NOT NULL DEFAULT 0,
            transaction_count INTEGER NOT NULL DEFAULT 0,
            closed_by_user_id BIGINT NOT NULL,
            closed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS audit_logs (
            id BIGSERIAL PRIMARY KEY,
            action TEXT NOT NULL,
            actor_telegram_user_id BIGINT,
            group_id INTEGER REFERENCES groups(id) ON DELETE SET NULL,
            details JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_transactions_group_created
            ON transactions(group_id, created_at DESC);

        CREATE INDEX IF NOT EXISTS idx_closings_group_closed
            ON daily_closings(group_id, closed_at DESC);

        CREATE INDEX IF NOT EXISTS idx_permissions_user
            ON permissions(user_id);
    `);

    console.log("DATABASE TABLES READY");
}

module.exports = initDatabase;
