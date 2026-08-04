const {
    createEmployee,
    getEmployees
} = require("../controllers/employeeController");

module.exports = (bot) => {

    bot.onText(/^\/employee$/, async (msg) => {

        try {

            const chatId = msg.chat.id;

            const employees = await getEmployees(chatId);

            if (employees.length === 0) {

                return bot.sendMessage(

                    chatId,

                    "❌ Chưa có nhân viên."

                );

            }

            let text = "👥 DANH SÁCH NHÂN VIÊN\n\n";

            employees.forEach((item, index) => {

                text += `${index + 1}. ${item.full_name}\n`;
                text += `📞 ${item.phone || "-"}\n\n`;

            });

            bot.sendMessage(chatId, text);

        } catch (err) {

            console.log(err);

            bot.sendMessage(

                msg.chat.id,

                "❌ Không thể lấy danh sách nhân viên."

            );

        }

    });

    bot.onText(/^\/employee (.+)\|(.+)$/, async (msg, match) => {

        try {

            const employee = await createEmployee({

                full_name: match[1].trim(),

                phone: match[2].trim(),

                telegram_id: null,

                group_id: msg.chat.id

            });

            bot.sendMessage(

                msg.chat.id,

                `✅ Đã thêm nhân viên

👤 ${employee.full_name}
📞 ${employee.phone}`

            );

        } catch (err) {

            console.log(err);

            bot.sendMessage(

                msg.chat.id,

                "❌ Không thể thêm nhân viên."

            );

        }

    });

};