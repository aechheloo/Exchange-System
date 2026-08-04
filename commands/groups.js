module.exports = (bot) => {

    bot.onText(/^\/groups$/, async (msg) => {

        const chatId = msg.chat.id;

        try {

            const pool = require("../config/database");

            const result = await pool.query(
                `
                SELECT
                    group_name,
                    fee_percent,
                    balance
                FROM groups
                ORDER BY id ASC
                `
            );

            if (result.rows.length === 0) {

                return bot.sendMessage(
                    chatId,
                    "❌ Chưa có nhóm nào."
                );

            }

            let text = "📋 DANH SÁCH NHÓM\n\n";

            result.rows.forEach((group, index) => {

                text +=
`${index + 1}. ${group.group_name}
Phí: ${group.fee_percent}%
Số dư: ${Number(group.balance).toLocaleString()}đ

`;

            });

            bot.sendMessage(chatId, text);

        } catch (err) {

            console.log(err);

            bot.sendMessage(
                chatId,
                "❌ Không thể lấy danh sách nhóm."
            );

        }

    });

};