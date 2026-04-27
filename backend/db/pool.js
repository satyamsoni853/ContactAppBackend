const { Pool } = require("pg");
require("dotenv").config({ path: __dirname + "/../.env" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Test connection on startup
pool.query("SELECT NOW()")
  .then((res) => {
    console.log("✅ Connected to Neon PostgreSQL at:", res.rows[0].now);
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });

module.exports = pool;
