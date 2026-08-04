const pool = require("../config/database");

async function createGroup(chatId, groupName) {

    const check = await pool.query(

        `
        SELECT *
        FROM groups
        WHERE telegram_group_id = $1
        `,

        [chatId]

    );

    if (check.rows.length > 0) {
        return null;
    }

    const result = await pool.query(

        `
        INSERT INTO groups(
            telegram_group_id,
            group_name,
            fee_percent,
            balance
        )
        VALUES($1,$2,$3,$4)
        RETURNING *
        `,

        [
            chatId,
            groupName,
            0,
            0
        ]

    );

    return result.rows[0];

}

async function getGroup(chatId) {

    const result = await pool.query(

        `
        SELECT *
        FROM groups
        WHERE telegram_group_id = $1
        LIMIT 1
        `,

        [chatId]

    );

    return result.rows[0];

}

async function getGroups() {

    const result = await pool.query(

        `
        SELECT *
        FROM groups
        ORDER BY id ASC
        `

    );

    return result.rows;

}

async function updateFee(chatId, feePercent) {

    const result = await pool.query(

        `
        UPDATE groups
        SET fee_percent = $1
        WHERE telegram_group_id = $2
        RETURNING *
        `,

        [
            feePercent,
            chatId
        ]

    );

    return result.rows[0];

}

async function updateBalance(chatId, balance) {

    const result = await pool.query(

        `
        UPDATE groups
        SET balance = $1
        WHERE telegram_group_id = $2
        RETURNING *
        `,

        [
            balance,
            chatId
        ]

    );

    return result.rows[0];

}

module.exports = {

    createGroup,

    getGroup,

    getGroups,

    updateFee,

    updateBalance

};