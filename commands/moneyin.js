const {
    getGroup,
    updateBalance
} = require("../controllers/groupController");

const {
    addTransaction
} = require("../controllers/transactionController");

module.exports = (bot) => {

    bot.onText(/^\/in (.+)$/, async (msg, match) => {

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

            const fee = Math.round(

                amount * Number(group.fee_percent) / 100

            );

            const receive = amount - fee;

            await addTransaction({

                group_id: group.id,

                type: "IN",

                amount: amount,

                fee: fee,

                note: "Tiền vào"

            });

            await updateBalance(

                chatId,

                Number(group.balance) + receive

            );

            bot.sendMessage(

                chatId,

                `💰 TIỀN VÀO

Tiền vào: ${amount.toLocaleString()}đ

Phí ${group.fee_percent}%: ${fee.toLocaleString()}đ

Thực nhận: ${receive.toLocaleString()}đ`

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