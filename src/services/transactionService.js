const pool = require("../config/database");

async function addMoney({
    groupId,
    amount,
    telegramUserId,
    telegramUsername,
    note = null
}) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const groupResult = await client.query(
            `
            SELECT *
            FROM groups
            WHERE id = $1
            FOR UPDATE
            `,
            [groupId]
        );

        const group = groupResult.rows[0];
        if (!group) {
            throw new Error("Không tìm thấy nhóm");
        }

        const feePercent = Number(group.fee_percent);
        const feeAmount = Math.round((amount * feePercent) / 100);
        const netAmount = amount - feeAmount;
        const newBalance = Number(group.balance) + netAmount;

        const transactionResult = await client.query(
            `
            INSERT INTO transactions (
                group_id,
                type,
                amount,
                fee_percent,
                fee_amount,
                net_amount,
                balance_after,
                telegram_user_id,
                telegram_username,
                note
            )
            VALUES ($1, 'IN', $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
            `,
            [
                groupId,
                amount,
                feePercent,
                feeAmount,
                netAmount,
                newBalance,
                telegramUserId,
                telegramUsername,
                note
            ]
        );

        await client.query(
            `
            UPDATE groups
            SET balance = $1,
                daily_in = daily_in + $2,
                daily_fee = daily_fee + $3,
                daily_tx_count = daily_tx_count + 1,
                updated_at = NOW()
            WHERE id = $4
            `,
            [newBalance, amount, feeAmount, groupId]
        );

        await client.query("COMMIT");

        return {
            group,
            transaction: transactionResult.rows[0],
            amount,
            feePercent,
            feeAmount,
            netAmount,
            balance: newBalance
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

async function subtractMoney({
    groupId,
    amount,
    telegramUserId,
    telegramUsername,
    note = null
}) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const groupResult = await client.query(
            `
            SELECT *
            FROM groups
            WHERE id = $1
            FOR UPDATE
            `,
            [groupId]
        );

        const group = groupResult.rows[0];
        if (!group) {
            throw new Error("Không tìm thấy nhóm");
        }

        const newBalance = Number(group.balance) - amount;

        const transactionResult = await client.query(
            `
            INSERT INTO transactions (
                group_id,
                type,
                amount,
                fee_percent,
                fee_amount,
                net_amount,
                balance_after,
                telegram_user_id,
                telegram_username,
                note
            )
            VALUES ($1, 'OUT', $2, 0, 0, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [
                groupId,
                amount,
                newBalance,
                telegramUserId,
                telegramUsername,
                note
            ]
        );

        await client.query(
            `
            UPDATE groups
            SET balance = $1,
                daily_out = daily_out + $2,
                daily_tx_count = daily_tx_count + 1,
                updated_at = NOW()
            WHERE id = $3
            `,
            [newBalance, amount, groupId]
        );

        await client.query("COMMIT");

        return {
            group,
            transaction: transactionResult.rows[0],
            amount,
            balance: newBalance
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

async function closeDay({ groupId, telegramUserId }) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const groupResult = await client.query(
            `
            SELECT *
            FROM groups
            WHERE id = $1
            FOR UPDATE
            `,
            [groupId]
        );

        const group = groupResult.rows[0];
        if (!group) {
            throw new Error("Không tìm thấy nhóm");
        }

        const closingResult = await client.query(
            `
            INSERT INTO daily_closings (
                group_id,
                total_in,
                total_out,
                total_fee,
                closing_balance,
                transaction_count,
                closed_by_user_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
            `,
            [
                groupId,
                group.daily_in,
                group.daily_out,
                group.daily_fee,
                group.balance,
                group.daily_tx_count,
                telegramUserId
            ]
        );

        await client.query(
            `
            UPDATE groups
            SET daily_in = 0,
                daily_out = 0,
                daily_fee = 0,
                daily_tx_count = 0,
                updated_at = NOW()
            WHERE id = $1
            `,
            [groupId]
        );

        await client.query("COMMIT");

        return {
            group,
            closing: closingResult.rows[0]
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

async function getTodayTransactions(groupId, limit = 10) {
    const result = await pool.query(
        `
        SELECT *
        FROM transactions
        WHERE group_id = $1
          AND created_at >= date_trunc('day', NOW())
        ORDER BY created_at DESC
        LIMIT $2
        `,
        [groupId, limit]
    );

    return result.rows;
}

module.exports = {
    addMoney,
    subtractMoney,
    closeDay,
    getTodayTransactions
};
