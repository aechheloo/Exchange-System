const express = require("express");
const pool = require("../config/database");
const basicAuth = require("./basicAuth");
const { formatMoney, formatPercent } = require("../utils/format");

const router = express.Router();

router.use(basicAuth);

router.get("/", async (_req, res) => {
    const groupResult = await pool.query(`
        SELECT *
        FROM groups
        ORDER BY id ASC
    `);

    const totalsResult = await pool.query(`
        SELECT
            COUNT(*)::int AS group_count,
            COALESCE(SUM(balance), 0) AS total_balance,
            COALESCE(SUM(daily_in), 0) AS total_in,
            COALESCE(SUM(daily_out), 0) AS total_out,
            COALESCE(SUM(daily_fee), 0) AS total_fee
        FROM groups
        WHERE active = TRUE
    `);

    res.render("dashboard", {
        groups: groupResult.rows,
        totals: totalsResult.rows[0],
        formatMoney,
        formatPercent
    });
});

router.post("/groups/:id", async (req, res) => {
    const groupId = Number(req.params.id);
    const groupName = String(req.body.group_name || "").trim();
    const feePercent = Number(
        String(req.body.fee_percent || "").replace(",", ".")
    );
    const active = req.body.active === "on";

    if (
        !Number.isInteger(groupId) ||
        groupName.length < 2 ||
        !Number.isFinite(feePercent) ||
        feePercent < 0 ||
        feePercent > 100
    ) {
        return res.status(400).send("Dữ liệu nhóm không hợp lệ");
    }

    await pool.query(
        `
        UPDATE groups
        SET group_name = $1,
            fee_percent = $2,
            active = $3,
            updated_at = NOW()
        WHERE id = $4
        `,
        [groupName, feePercent, active, groupId]
    );

    res.redirect("/admin");
});

router.get("/transactions", async (req, res) => {
    const groupId = req.query.group_id
        ? Number(req.query.group_id)
        : null;

    const groupsResult = await pool.query(`
        SELECT id, group_name
        FROM groups
        ORDER BY group_name
    `);

    const params = [];
    let where = "";

    if (Number.isInteger(groupId)) {
        params.push(groupId);
        where = "WHERE t.group_id = $1";
    }

    const transactionsResult = await pool.query(
        `
        SELECT
            t.*,
            g.group_name
        FROM transactions t
        JOIN groups g ON g.id = t.group_id
        ${where}
        ORDER BY t.created_at DESC
        LIMIT 300
        `,
        params
    );

    res.render("transactions", {
        groups: groupsResult.rows,
        selectedGroupId: groupId,
        transactions: transactionsResult.rows,
        formatMoney,
        formatPercent
    });
});

router.get("/staff", async (_req, res) => {
    const usersResult = await pool.query(`
        SELECT *
        FROM users
        ORDER BY id ASC
    `);

    const groupsResult = await pool.query(`
        SELECT id, group_name
        FROM groups
        ORDER BY group_name
    `);

    const permissionsResult = await pool.query(`
        SELECT
            p.id,
            u.telegram_user_id,
            u.display_name,
            g.id AS group_id,
            g.group_name
        FROM permissions p
        JOIN users u ON u.id = p.user_id
        JOIN groups g ON g.id = p.group_id
        ORDER BY u.display_name, g.group_name
    `);

    res.render("staff", {
        users: usersResult.rows,
        groups: groupsResult.rows,
        permissions: permissionsResult.rows
    });
});

router.post("/staff", async (req, res) => {
    const telegramUserId = String(
        req.body.telegram_user_id || ""
    ).trim();
    const displayName = String(req.body.display_name || "").trim();

    if (!/^\d+$/.test(telegramUserId) || displayName.length < 2) {
        return res.status(400).send("Thông tin nhân viên không hợp lệ");
    }

    await pool.query(
        `
        INSERT INTO users (
            telegram_user_id,
            display_name,
            role,
            active
        )
        VALUES ($1, $2, 'staff', TRUE)
        ON CONFLICT (telegram_user_id)
        DO UPDATE SET
            display_name = EXCLUDED.display_name,
            active = TRUE,
            updated_at = NOW()
        `,
        [telegramUserId, displayName]
    );

    res.redirect("/admin/staff");
});

router.post("/permissions", async (req, res) => {
    const telegramUserId = String(
        req.body.telegram_user_id || ""
    ).trim();
    const groupId = Number(req.body.group_id);

    if (!/^\d+$/.test(telegramUserId) || !Number.isInteger(groupId)) {
        return res.status(400).send("Phân quyền không hợp lệ");
    }

    await pool.query(
        `
        INSERT INTO permissions (user_id, group_id)
        SELECT u.id, g.id
        FROM users u
        JOIN groups g ON g.id = $2
        WHERE u.telegram_user_id = $1
        ON CONFLICT (user_id, group_id) DO NOTHING
        `,
        [telegramUserId, groupId]
    );

    res.redirect("/admin/staff");
});

router.post("/permissions/:id/delete", async (req, res) => {
    const permissionId = Number(req.params.id);

    if (!Number.isInteger(permissionId)) {
        return res.status(400).send("Permission ID không hợp lệ");
    }

    await pool.query(
        "DELETE FROM permissions WHERE id = $1",
        [permissionId]
    );

    res.redirect("/admin/staff");
});

module.exports = router;
