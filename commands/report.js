const {
    getReport
} = require("../controllers/reportController");

module.exports = (bot) => {

    bot.onText(/^\/report$/, async (msg) => {

        try {

            const chatId = msg.chat.id;

            const report = await getReport(chatId);

            if (!report) {

                return bot.sendMessage(
                    chatId,
                    "❌ Chưa có dữ liệu."
                );

            }

            const text = `

📊 BÁO CÁO NHÓM

💰 Tiền vào:
${Number(report.total_in || 0).toLocaleString()}đ

💸 Tiền ra:
${Number(report.total_out || 0).toLocaleString()}đ

🏦 Tổng phí:
${Number(report.total_fee || 0).toLocaleString()}đ

💵 Số dư:
${Number(report.balance || 0).toLocaleString()}đ

📅 Thời gian:
${new Date().toLocaleString("vi-VN")}

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