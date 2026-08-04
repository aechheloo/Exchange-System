const { getGroup, updateFee } = require("../controllers/groupController");

module.exports = (bot) => {

    bot.onText(/^\/fee (.+)$/, async (msg, match) => {

        try {

            const chatId = msg.chat.id;

            const fee = Number(match[1]);

            if (isNaN(fee)) {

                return bot.sendMessage(

                    chatId,

                    "❌ Phí không hợp lệ."

                );

            }

            const group = await getGroup(chatId);

            if (!group) {

                return bot.sendMessage(

                    chatId,

                    "❌ Nhóm chưa được đăng ký."

                );

            }

            await updateFee(

                chatId,

                fee

            );

            bot.sendMessage(

                chatId,

                `✅ Đã cập nhật phí: ${fee}%`

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