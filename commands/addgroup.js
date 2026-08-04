const pool = require("../config/database");

module.exports = (bot) => {

    let waiting = {};

    bot.onText(/^\/addgroup$/, (msg) => {

        waiting[msg.chat.id] = {
            step: 1
        };

        bot.sendMessage(
            msg.chat.id,
            "📝 Nhập tên nhóm:"
        );

    });

    bot.on("message", async (msg) => {

        if (!waiting[msg.chat.id]) return;

        if (msg.text.startsWith("/")) return;

        if (waiting[msg.chat.id].step === 1) {

            waiting[msg.chat.id].name = msg.text;

            waiting[msg.chat.id].step = 2;

            return bot.sendMessage(
                msg.chat.id,
                "💰 Nhập phí (%):"
            );

        }

        if (waiting[msg.chat.id].step === 2) {

            const fee = Number(msg.text);

            await pool.query(
                `
                INSERT INTO groups
                (
                    telegram_group_id,
                    group_name,
                    fee_percent
                )
                VALUES
                ($1,$2,$3)
                `,
                [
                    Date.now(),
                    waiting[msg.chat.id].name,
                    fee
                ]
            );

            bot.sendMessage(
                msg.chat.id,
`✅ Đã tạo nhóm

Tên:
${waiting[msg.chat.id].name}

Phí:
${fee}%`
            );

            delete waiting[msg.chat.id];

        }

    });

};