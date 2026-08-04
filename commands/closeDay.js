const {
    getReport
} = require("../controllers/reportController");

module.exports = (bot) => {

    bot.onText(/^\/closeday$/, async (msg) => {

        try {

            const chatId = msg.chat.id;

            const report = await getReport(chatId);

            if (!report) {

                return bot.sendMessage(
                    chatId,
                    "❌ Chưa có dữ liệu để chốt ngày."
                );

            }

            const text = `

🔒 CHỐT NGÀY

📅 ${new Date().toLocaleDateString("vi-VN")}

💰 Tiền vào:
${Number(report.total_in || 0).toLocaleString()}đ

💸 Tiền ra:
${Number(report.total_out || 0).toLocaleString()}đ

🏦 Tổng phí:
${Number(report.total_fee || 0).toLocaleString()}đ

💵 Số dư:
${Number(report.balance || 0).toLocaleString()}đ

✅ Đã chốt ngày thành công.

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