require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const pool = require("./config/database");

const app = express();

const PORT = process.env.PORT || 8080;

// ==========================
// BOT
// ==========================

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

// ==========================
// LOAD COMMANDS
// ==========================

require("./commands/addgroup")(bot);

// ==========================
// WEB
// ==========================

app.get("/", (req, res) => {
    res.send("Exchange System Online");
});

// ==========================
// START
// ==========================

async function start() {

    try {

        // Tạo bảng groups nếu chưa có
        await pool.query(`
            CREATE TABLE IF NOT EXISTS groups(
                id SERIAL PRIMARY KEY,
                telegram_group_id BIGINT,
                group_name TEXT NOT NULL,
                fee_percent NUMERIC NOT NULL
            );
        `);

        console.log("DATABASE CONNECTED");

        console.log("==================================");
        console.log(" Exchange System Started");
        console.log("==================================");

        console.log("PORT:", PORT);

        console.log(
            "BOT:",
            process.env.BOT_TOKEN
                ? "CONNECTED"
                : "NOT FOUND"
        );

        console.log(
            "DATABASE:",
            process.env.DATABASE_URL
                ? "CONNECTED"
                : "NOT FOUND"
        );

        console.log(
            "SUPER ADMIN:",
            process.env.SUPER_ADMIN_CHAT_ID
                ? "CONNECTED"
                : "NOT FOUND"
        );

        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });

    } catch (err) {

        console.error(err);

    }

}

start();