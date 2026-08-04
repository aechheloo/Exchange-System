require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

const PORT = process.env.PORT || 8080;

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

app.get("/", (req, res) => {
    res.send("Exchange System Online");
});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "✅ Bot đang hoạt động.");
});

app.listen(PORT, () => {
    console.log("Exchange System Started");
});