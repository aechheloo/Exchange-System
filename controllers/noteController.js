const pool = require("../config/database");

async function addNote(data) {

    const result = await pool.query(

        `
        INSERT INTO notes(
            employee_id,
            telegram_group_id,
            content
        )
        VALUES($1,$2,$3)
        RETURNING *
        `,

        [
            data.employee_id || null,
            data.telegram_group_id || null,
            data.content
        ]

    );

    return result.rows[0];

}

async function getNotesByEmployee(employeeId) {

    const result = await pool.query(

        `
        SELECT *
        FROM notes
        WHERE employee_id = $1
        ORDER BY id DESC
        `,

        [employeeId]

    );

    return result.rows;

}

async function getGroupNotes(groupId) {

    const result = await pool.query(

        `
        SELECT *
        FROM notes
        WHERE telegram_group_id = $1
        ORDER BY id DESC
        `,

        [groupId]

    );

    return result.rows;

}

async function deleteNote(noteId) {

    const result = await pool.query(

        `
        DELETE FROM notes
        WHERE id = $1
        RETURNING *
        `,

        [noteId]

    );

    return result.rows[0];

}

module.exports = {

    addNote,

    getNotesByEmployee,

    getGroupNotes,

    deleteNote

};