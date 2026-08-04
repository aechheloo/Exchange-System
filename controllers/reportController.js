const pool = require("../config/database");

async function getDailyReport(groupId) {

    const result = await pool.query(

        `
        SELECT

            COALESCE(SUM(
                CASE
                    WHEN type='IN'
                    THEN amount
                    ELSE 0
                END
            ),0) AS total_in,

            COALESCE(SUM(
                CASE
                    WHEN type='OUT'
                    THEN amount
                    ELSE 0
                END
            ),0) AS total_out

        FROM transactions

        WHERE group_id=$1

        `,

        [groupId]

    );

    return result.rows[0];

}

async function getMonthlyReport(groupId) {

    const result = await pool.query(

        `
        SELECT

            COALESCE(SUM(
                CASE
                    WHEN type='IN'
                    THEN amount
                    ELSE 0
                END
            ),0) AS total_in,

            COALESCE(SUM(
                CASE
                    WHEN type='OUT'
                    THEN amount
                    ELSE 0
                END
            ),0) AS total_out

        FROM transactions

        WHERE group_id=$1

        `,

        [groupId]

    );

    return result.rows[0];

}

module.exports = {

    getDailyReport,

    getMonthlyReport

};