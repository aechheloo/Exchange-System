require("dotenv").config();

const express = require("express");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");

const pool = require("./src/config/database");
const initDatabase = require("./src/database/init");
const registerBot = require("./src/bot");
const adminRouter = require("./src/web/adminRoutes");

const requiredVariables = ["BOT_TOKEN", "DATABASE_URL"];
for (const name of requiredVariables) {
    if (!process.env[name]) {
        throw new Error(`Thiếu biến môi trường ${name}`);
    }
}

const app = express();
const PORT = Number(process.env.PORT || 8080);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_req, res) => {
    res.status(200).send("Exchange System Online");
});

app.get("/health", async (_req, res) => {
    try {
        await pool.query("SELECT 1");
        res.status(200).json({
            success: true,
            service: "Exchange-System",
            database: "connected"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            service: "Exchange-System",
            database: "disconnected",
            error: error.message
        });
    }
});

app.use("/admin", adminRouter);

let server;
let bot;
let shuttingDown = false;

async function start() {
    await initDatabase();

    bot = new TelegramBot(process.env.BOT_TOKEN, {
        polling: {
            interval: 300,
            autoStart: true,
            params: {
                timeout: 30
            }
        }
    });

    registerBot(bot);

    bot.on("polling_error", (error) => {
        console.error("TELEGRAM POLLING ERROR:", error.message);
    });

    server = app.listen(PORT, () => {
        console.log("================================");
        console.log("Exchange System Started");
        console.log("================================");
        console.log("PORT:", PORT);
        console.log("BOT: CONNECTED");
        console.log("DATABASE: CONNECTED");
        console.log(
            "SUPER ADMIN USER:",
            process.env.SUPER_ADMIN_USER_ID ? "CONNECTED" : "NOT FOUND"
        );
        console.log(
            "SUPER ADMIN CHAT:",
            process.env.SUPER_ADMIN_CHAT_ID ? "CONNECTED" : "NOT FOUND"
        );
    });
}

async function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;

    console.log(`${signal}: stopping safely...`);

    try {
        if (bot) {
            await bot.stopPolling();
        }
    } catch (error) {
        console.error("STOP POLLING ERROR:", error.message);
    }

    const closeServer = () =>
        new Promise((resolve) => {
            if (!server) return resolve();
            server.close(() => resolve());
        });

    await closeServer();

    try {
        await pool.end();
    } catch (error) {
        console.error("DATABASE CLOSE ERROR:", error.message);
    }

    process.exit(0);
}

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));

start().catch((error) => {
    console.error("START SYSTEM ERROR:", error);
    process.exit(1);
});
