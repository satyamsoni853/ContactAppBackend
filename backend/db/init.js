const pool = require("./pool");

const initDB = async () => {
  try {
    console.log("🔄 Initializing database tables...\n");

    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("  ✅ users table ready");

    // Example: Posts table (you can modify/extend this)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("  ✅ posts table ready");

    console.log("\n🎉 Database initialized successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Database initialization failed:", err.message);
    process.exit(1);
  }
};

initDB();
