const pool = require("../config/database");

module.exports = (bot) => {
    const waiting = {};

    bot.onText(/^\/addgroup$/, (msg) => {
        const chatId = msg.chat.id;

        waiting[chatId] = {
            step: 1
        };

        bot.sendMessage(
            chatId,
            "📝 Nhập tên nhóm:"
        );
    });

    bot.on("message", async (msg) => {
        const chatId = msg.chat.id;

        if (!waiting[chatId]) return;
        if (!msg.text || msg.text.startsWith("/")) return;

        if (waiting[chatId].step === 1) {
            waiting[chatId].name = msg.text.trim();
            waiting[chatId].step = 2;

            return bot.sendMessage(
                chatId,
                "💰 Nhập phí (%):"
            );
        }

        if (waiting[chatId].step === 2) {
            const fee = Number(msg.text);

            if (!Number.isFinite(fee) || fee < 0 || fee > 100) {
                return bot.sendMessage(
                    chatId,
                    "❌ Phí không hợp lệ. Hãy nhập số từ 0 đến 100."
                );
            }

            try {
                await pool.query(
                    `
                    INSERT INTO groups
                    (
                        telegram_group_id,
                        group_name,
                        fee_percent
                    )
                    VALUES ($1, $2, $3)
                    `,
                    [
                        Date.now(),
                        waiting[chatId].name,
                        fee
                    ]
                );

                await bot.sendMessage(
                    chatId,
`✅ Đã tạo nhóm

Tên:
${waiting[chatId].name}

Phí:
${fee}%`
                );

                delete waiting[chatId];

            } catch (error) {
                console.error("ADD GROUP ERROR:", error);

                await bot.sendMessage(
                    chatId,
                    "❌ Không thể tạo nhóm. Kiểm tra lại Database."
                );
            }
        }
    });
};