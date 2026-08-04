const {
    getReport
} = require("../controllers/reportController");

module.exports = (bot) => {

    bot.onText(/^\/closemonth$/, async (msg) => {

        try {

            const chatId = msg.chat.id;

            const report = await getReport(chatId);

            if (!report) {

                return bot.sendMessage(
                    chatId,
                    "❌ Chưa có dữ liệu để chốt tháng."
                );

            }

            const now = new Date();

            const month = `${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;

            const text = `

📦 CHỐT THÁNG ${month}

💰 Tổng tiền vào:
${Number(report.total_in || 0).toLocaleString()}đ

💸 Tổng tiền ra:
${Number(report.total_out || 0).toLocaleString()}đ

🏦 Tổng phí:
${Number(report.total_fee || 0).toLocaleString()}đ

💵 Số dư cuối tháng:
${Number(report.balance || 0).toLocaleString()}đ

✅ Đã chốt tháng thành công.

`;

            bot.sendMessage(
                chatId,
                text
            );

        } catch (err) {

            console.log(err);

            bot.sendMessage(
                msg.chat.id,
                "❌ Có lỗi xảy ra."
            );

        }

    });

};