const pool = require("../config/database");

exports.getGroups = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM groups ORDER BY id ASC"
        );

        res.json({
            success: true,
            data: result.rows
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

exports.createGroup = async (req, res) => {

    try {

        const {
            telegram_group_id,
            group_name,
            fee_percent
        } = req.body;

        const result = await pool.query(
            `
            INSERT INTO groups
            (telegram_group_id, group_name, fee_percent)
            VALUES ($1,$2,$3)
            RETURNING *
            `,
            [
                telegram_group_id,
                group_name,
                fee_percent
            ]
        );

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};