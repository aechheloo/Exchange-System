const {
    getGroup,
    updateBalance
} = require("../controllers/groupController");

const {
    addTransaction
} = require("../controllers/transactionController");

module.exports = (bot) => {

    bot.onText(/^\/out (.+)$/, async (msg, match) => {

        try {

            const chatId = msg.chat.id;

            const amount = Number(match[1]);

            if (isNaN(amount) || amount <= 0) {

                return bot.sendMessage(

                    chatId,

                    "❌ Số tiền không hợp lệ."

                );

            }

            const group = await getGroup(chatId);

            if (!group) {

                return bot.sendMessage(

                    chatId,

                    "❌ Nhóm chưa được đăng ký."

                );

            }

            if (Number(group.balance) < amount) {

                return bot.sendMessage(

                    chatId,

                    "❌ Số dư không đủ."

                );

            }

            await addTransaction({

                group_id: group.id,

                type: "OUT",

                amount: amount,

                fee: 0,

                note: "Tiền ra"

            });

            await updateBalance(

                chatId,

                Number(group.balance) - amount

            );

            bot.sendMessage(

                chatId,

                `💸 TIỀN RA

Đã xuất:

${amount.toLocaleString()}đ

Số dư còn lại:

${(Number(group.balance) - amount).toLocaleString()}đ`

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