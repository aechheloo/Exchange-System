const pool = require("../config/database");

async function addSalaryTransaction(data) {

    const result = await pool.query(

        `
        INSERT INTO salary_transactions(
            employee_id,
            type,
            amount,
            note
        )
        VALUES($1,$2,$3,$4)
        RETURNING *
        `,

        [
            data.employee_id,
            data.type,
            data.amount,
            data.note || null
        ]

    );

    return result.rows[0];

}

async function getSalaryTransactions(employeeId) {

    const result = await pool.query(

        `
        SELECT *
        FROM salary_transactions
        WHERE employee_id = $1
        ORDER BY id DESC
        `,

        [employeeId]

    );

    return result.rows;

}

async function getSalarySummary(employeeId) {

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
            ),0) AS total_out,

            COALESCE(SUM(
                CASE
                    WHEN type='ADVANCE'
                    THEN amount
                    ELSE 0
                END
            ),0) AS advance

        FROM salary_transactions

        WHERE employee_id = $1

        `,

        [employeeId]

    );

    const row = result.rows[0];

    row.total_salary =
        Number(row.total_in) -
        Number(row.total_out) -
        Number(row.advance);

    return row;

}

module.exports = {

    addSalaryTransaction,

    getSalaryTransactions,

    getSalarySummary

};