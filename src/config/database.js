const { Pool } = require("pg");

const useSsl = String(process.env.DATABASE_SSL || "true").toLowerCase() !== "false";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: useSsl
        ? {
              rejectUnauthorized: false
          }
        : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
});

pool.on("error", (error) => {
    console.error("DATABASE POOL ERROR:", error);
});

module.exports = pool;
