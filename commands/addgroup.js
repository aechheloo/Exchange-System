module.exports = (bot) => {

    bot.onText(/^\/addgroup$/, async (msg) => {

        const chatId = msg.chat.id;

        try {

            const pool = require("../config/database");

            const check = await pool.query(
                "SELECT * FROM groups WHERE telegram_group_id=$1",
                [chatId]
            );

            if (check.rows.length > 0) {

                return bot.sendMessage(
                    chatId,
                    "❌ Nhóm đã tồn tại."
                );

            }

            await pool.query(
                `
                INSERT INTO groups(
                    telegram_group_id,
                    group_name,
                    fee_percent,
                    balance
                )
                VALUES($1,$2,$3,$4)
                `,
                [
                    chatId,
                    msg.chat.title || "Chưa đặt tên",
                    0,
                    0
                ]
            );

            bot.sendMessage(
                chatId,
                "✅ Đã thêm nhóm thành công."
            );

        } catch (err) {

            console.log(err);

            bot.sendMessage(
                chatId,
                "❌ Có lỗi xảy ra."
            );

        }

    });

};