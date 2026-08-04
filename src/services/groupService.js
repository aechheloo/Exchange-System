const pool = require("../config/database");

async function getGroupByTelegramId(telegramGroupId) {
    const result = await pool.query(
        `
        SELECT *
        FROM groups
        WHERE telegram_group_id = $1
          AND active = TRUE
        LIMIT 1
        `,
        [telegramGroupId]
    );

    return result.rows[0] || null;
}

async function listGroups() {
    const result = await pool.query(`
        SELECT
            id,
            telegram_group_id,
            group_name,
            fee_percent,
            balance,
            daily_in,
            daily_out,
            daily_fee,
            daily_tx_count,
            active
        FROM groups
        ORDER BY id ASC
    `);

    return result.rows;
}

async function setupGroup({
    telegramGroupId,
    groupName,
    feePercent,
    actorUserId
}) {
    const result = await pool.query(
        `
        INSERT INTO groups (
            telegram_group_id,
            group_name,
            fee_percent,
            active
        )
        VALUES ($1, $2, $3, TRUE)
        ON CONFLICT (telegram_group_id)
        DO UPDATE SET
            group_name = EXCLUDED.group_name,
            fee_percent = EXCLUDED.fee_percent,
            active = TRUE,
            updated_at = NOW()
        RETURNING *
        `,
        [telegramGroupId, groupName, feePercent]
    );

    await pool.query(
        `
        INSERT INTO audit_logs (
            action,
            actor_telegram_user_id,
            group_id,
            details
        )
        VALUES ('SETUP_GROUP', $1, $2, $3::jsonb)
        `,
        [
            actorUserId,
            result.rows[0].id,
            JSON.stringify({
                telegram_group_id: String(telegramGroupId),
                group_name: groupName,
                fee_percent: feePercent
            })
        ]
    );

    return result.rows[0];
}

async function updateGroupName(groupId, groupName, actorUserId) {
    const result = await pool.query(
        `
        UPDATE groups
        SET group_name = $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING *
        `,
        [groupName, groupId]
    );

    if (!result.rows[0]) return null;

    await pool.query(
        `
        INSERT INTO audit_logs (
            action,
            actor_telegram_user_id,
            group_id,
            details
        )
        VALUES ('RENAME_GROUP', $1, $2, $3::jsonb)
        `,
        [
            actorUserId,
            groupId,
            JSON.stringify({ group_name: groupName })
        ]
    );

    return result.rows[0];
}

async function updateGroupFee(groupId, feePercent, actorUserId) {
    const result = await pool.query(
        `
        UPDATE groups
        SET fee_percent = $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING *
        `,
        [feePercent, groupId]
    );

    if (!result.rows[0]) return null;

    await pool.query(
        `
        INSERT INTO audit_logs (
            action,
            actor_telegram_user_id,
            group_id,
            details
        )
        VALUES ('SET_FEE', $1, $2, $3::jsonb)
        `,
        [
            actorUserId,
            groupId,
            JSON.stringify({ fee_percent: feePercent })
        ]
    );

    return result.rows[0];
}

module.exports = {
    getGroupByTelegramId,
    listGroups,
    setupGroup,
    updateGroupName,
    updateGroupFee
};
