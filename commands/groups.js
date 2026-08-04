const pool = require("../config/database");

module.exports = (bot) => {

    bot.onText(/^\/groups$/, async (msg) => {

        try {

            const result = await pool.query(
                "SELECT * FROM groups ORDER BY id ASC"
            );

            if (result.rows.length === 0) {

                return bot.sendMessage(
                    msg.chat.id,
`📂 DANH SÁCH NHÓM

Chưa có nhóm.

Gõ:

/addgroup`
                );

            }

            let text = "📂 DANH SÁCH NHÓM\n\n";

            result.rows.forEach((group, index) => {

                text += `${index + 1}. ${group.group_name}\n`;
                text += `💰 Phí: ${group.fee_percent}%\n\n`;

            });

            text += "\nGõ /addgroup để thêm nhóm.";

            bot.sendMessage(msg.chat.id, text);

        } catch (err) {

            console.log(err);

            bot.sendMessage(
                msg.chat.id,
                "❌ Không lấy được danh sách nhóm."
            );

        }

    });

};