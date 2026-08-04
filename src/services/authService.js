const pool = require("../config/database");

function isSuperAdminUser(userId) {
    const configured =
        process.env.SUPER_ADMIN_USER_ID ||
        process.env.SUPER_ADMIN_CHAT_ID ||
        "";

    return Boolean(configured) && String(userId) === String(configured);
}

async function ensureSuperAdminUser(from) {
    if (!isSuperAdminUser(from.id)) return;

    const displayName = [from.first_name, from.last_name]
        .filter(Boolean)
        .join(" ")
        .trim() || from.username || String(from.id);

    await pool.query(
        `
        INSERT INTO users (telegram_user_id, display_name, role, active)
        VALUES ($1, $2, 'super_admin', TRUE)
        ON CONFLICT (telegram_user_id)
        DO UPDATE SET
            display_name = EXCLUDED.display_name,
            role = 'super_admin',
            active = TRUE,
            updated_at = NOW()
        `,
        [from.id, displayName]
    );
}

async function canOperateGroup(userId, groupId) {
    if (isSuperAdminUser(userId)) return true;

    const result = await pool.query(
        `
        SELECT 1
        FROM permissions p
        JOIN users u ON u.id = p.user_id
        WHERE u.telegram_user_id = $1
          AND u.active = TRUE
          AND p.group_id = $2
        LIMIT 1
        `,
        [userId, groupId]
    );

    return result.rowCount > 0;
}

module.exports = {
    isSuperAdminUser,
    ensureSuperAdminUser,
    canOperateGroup
};
