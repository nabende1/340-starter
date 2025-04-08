const { Pool } = require("pg");

// Render requires SSL unconditionally - simplify configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Force SSL for ALL environments
});

// Optional: Add connection logging for debugging
pool.on("connect", () => {
  if (process.env.NODE_ENV === "development") {
    console.log("Connected to PostgreSQL database");
  }
});

pool.on("error", (err) => {
  console.error("Database connection error:", err);
});

module.exports = pool;