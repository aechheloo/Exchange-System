module.exports = (bot) => {

    bot.onText(/^\/help$/, async (msg) => {

        const text = `

📚 DANH SÁCH LỆNH

👥 NHÓM

/setupgroup Tên nhóm|Phí
/groups

💰 GIAO DỊCH

/in Số tiền
/out Số tiền

⚙️ CÀI ĐẶT

/fee Phần trăm

📊 BÁO CÁO

/report
/closeday
/closemonth

👨‍💼 NHÂN VIÊN

/employee
/employee Tên|Số điện thoại

📝 GHI CHÚ

/note
/note Nội dung

❓ TRỢ GIÚP

/help

`;

        bot.sendMessage(

            msg.chat.id,

            text

        );

    });

};