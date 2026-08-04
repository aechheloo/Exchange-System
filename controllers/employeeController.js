const pool = require("../config/database");

async function createEmployee(data) {

    const result = await pool.query(

        `
        INSERT INTO employees(
            full_name,
            phone,
            telegram_id,
            group_id
        )
        VALUES($1,$2,$3,$4)
        RETURNING *
        `,

        [
            data.full_name,
            data.phone || null,
            data.telegram_id || null,
            data.group_id || null
        ]

    );

    return result.rows[0];

}

async function getEmployees(groupId) {

    const result = await pool.query(

        `
        SELECT *
        FROM employees
        WHERE group_id = $1
        ORDER BY id ASC
        `,

        [groupId]

    );

    return result.rows;

}

async function getEmployee(employeeId) {

    const result = await pool.query(

        `
        SELECT *
        FROM employees
        WHERE id = $1
        LIMIT 1
        `,

        [employeeId]

    );

    return result.rows[0];

}

async function updateEmployee(employeeId, data) {

    const result = await pool.query(

        `
        UPDATE employees
        SET
            full_name = $1,
            phone = $2,
            telegram_id = $3,
            group_id = $4
        WHERE id = $5
        RETURNING *
        `,

        [
            data.full_name,
            data.phone || null,
            data.telegram_id || null,
            data.group_id || null,
            employeeId
        ]

    );

    return result.rows[0];

}

async function deleteEmployee(employeeId) {

    const result = await pool.query(

        `
        DELETE FROM employees
        WHERE id = $1
        RETURNING *
        `,

        [employeeId]

    );

    return result.rows[0];

}

module.exports = {

    createEmployee,

    getEmployees,

    getEmployee,

    updateEmployee,

    deleteEmployee

};