require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

const PORT = process.env.PORT || 8080;

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

// Nạp các lệnh
require("./commands/addgroup")(bot);
require("./commands/groups")(bot);

// Web
app.get("/", (req, res) => {
    res.send("Exchange System Online");
});

// Lệnh start
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "✅ Bot đang hoạt động.");
});

// Khởi động server
app.listen(PORT, () => {
    console.log("================================");
    console.log("Exchange System Started");
    console.log("================================");
    console.log("PORT:", PORT);
});