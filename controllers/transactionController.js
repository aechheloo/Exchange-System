const pool = require("../config/database");

async function addTransaction(data) {

    const result = await pool.query(

        `
        INSERT INTO transactions(
            group_id,
            type,
            amount,
            fee,
            note
        )
        VALUES($1,$2,$3,$4,$5)
        RETURNING *
        `,

        [
            data.group_id,
            data.type,
            data.amount,
            data.fee,
            data.note
        ]

    );

    return result.rows[0];

}

async function getTransactions(groupId) {

    const result = await pool.query(

        `
        SELECT *
        FROM transactions
        WHERE group_id=$1
        ORDER BY id DESC
        `,

        [groupId]

    );

    return result.rows;

}

async function getTransaction(id) {

    const result = await pool.query(

        `
        SELECT *
        FROM transactions
        WHERE id=$1
        LIMIT 1
        `,

        [id]

    );

    return result.rows[0];

}

module.exports = {

    addTransaction,

    getTransactions,

    getTransaction

};