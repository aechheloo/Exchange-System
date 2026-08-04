require("dotenv").config();

const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Exchange System Online");
});

app.listen(PORT, () => {

    console.log("=================================");
    console.log(" Exchange System Started");
    console.log("=================================");

    console.log("PORT:", PORT);

    console.log(
        "BOT:",
        process.env.BOT_TOKEN ? "CONNECTED" : "NOT FOUND"
    );

    console.log(
        "DATABASE:",
        process.env.DATABASE_URL ? "CONNECTED" : "NOT FOUND"
    );

    console.log(
        "SUPER ADMIN:",
        process.env.SUPER_ADMIN_CHAT_ID
            ? "CONNECTED"
            : "NOT FOUND"
    );

});