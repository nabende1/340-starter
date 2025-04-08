const { Pool } = require("pg");
require("dotenv").config();

// Configure connection pool with SSL for all environments
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" 
    ? { rejectUnauthorized: false }  // Required for Render PostgreSQL
    : { rejectUnauthorized: false }, // Optional for local dev (safe to keep)
});

// Optional: Log queries in development mode
if (process.env.NODE_ENV === "development") {
  pool.on("connect", () => {
    console.log("Connected to PostgreSQL database");
  });

  pool.on("query", (query) => {
    console.log("Executed query:", query.text);
  });
}

module.exports = pool; // Consistent export for all environments