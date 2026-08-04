const pool = require("../config/database");

module.exports = (bot) => {

    bot.onText(/^\/note (.+)$/, async (msg, match) => {

        try {

            const chatId = msg.chat.id;

            const content = match[1];

            await pool.query(

                `
                INSERT INTO notes(
                    telegram_group_id,
                    content,
                    created_at
                )
                VALUES($1,$2,NOW())
                `,

                [
                    chatId,
                    content
                ]

            );

            bot.sendMessage(

                chatId,

                `📝 Đã lưu Note

Nội dung:

${content}`

            );

        } catch (err) {

            console.log(err);

            bot.sendMessage(

                msg.chat.id,

                "❌ Không thể lưu Note."

            );

        }

    });

};