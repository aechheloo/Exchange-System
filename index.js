require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const pool = require("./config/database");

const app = express();
const PORT = process.env.PORT || 8080;

if (!process.env.BOT_TOKEN) {
    throw new Error("Thiếu biến BOT_TOKEN");
}

if (!process.env.DATABASE_URL) {
    throw new Error("Thiếu biến DATABASE_URL");
}

/* =========================
   TELEGRAM BOT
========================= */

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

/* =========================
   NẠP CÁC LỆNH
========================= */

require("./commands/addgroup")(bot);
require("./commands/groups")(bot);

/* =========================
   WEB SERVER
========================= */

app.get("/", (req, res) => {
    res.status(200).send("Exchange System Online");
});

/* =========================
   LỆNH KIỂM TRA
========================= */

bot.onText(/^\/start$/, async (msg) => {
    await bot.sendMessage(
        msg.chat.id,
        "✅ Bot đang hoạt động."
    );
});

/* =========================
   KHỞI ĐỘNG HỆ THỐNG
========================= */

let server;

async function startSystem() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS groups (
                id SERIAL PRIMARY KEY,
                telegram_group_id BIGINT NOT NULL,
                group_name TEXT NOT NULL,
                fee_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
                balance BIGINT NOT NULL DEFAULT 0,
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `);

        console.log("DATABASE CONNECTED");

        server = app.listen(PORT, () => {
            console.log("================================");
            console.log("Exchange System Started");
            console.log("================================");
            console.log("PORT:", PORT);
            console.log("BOT: CONNECTED");
            console.log("DATABASE: CONNECTED");
            console.log(
                "SUPER ADMIN:",
                process.env.SUPER_ADMIN_CHAT_ID
                    ? "CONNECTED"
                    : "NOT FOUND"
            );
        });
    } catch (error) {
        console.error("START SYSTEM ERROR:", error);
        process.exit(1);
    }
}

/* =========================
   DỪNG AN TOÀN KHI REDEPLOY
========================= */

async function shutdown(signal) {
    console.log(`${signal}: stopping safely...`);

    try {
        await bot.stopPolling();
    } catch (error) {
        console.error("STOP POLLING ERROR:", error.message);
    }

    if (server) {
        server.close(async () => {
            await pool.end();
            process.exit(0);
        });
    } else {
        await pool.end();
        process.exit(0);
    }
}

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));

bot.on("polling_error", (error) => {
    console.error("TELEGRAM POLLING ERROR:", error.message);
});

startSystem();