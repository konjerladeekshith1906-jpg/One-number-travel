const dotenv = require("dotenv");
dotenv.config();

const mysql = require("mysql2/promise");

function parseDatabaseUrl(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: Number(parsed.port || 3306),
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname.replace(/^\/+/, ""),
    };
  } catch (error) {
    return null;
  }
}

const parsedDatabaseUrl = parseDatabaseUrl(process.env.DATABASE_URL || process.env.MYSQL_URL);

const pool = mysql.createPool({
  ...(parsedDatabaseUrl || {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "one_number_travel",
  }),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(process.env.DB_SSL === "true" ? { ssl: { rejectUnauthorized: false } } : {}),
});

async function testConnection() {
  const [rows] = await pool.query("SELECT 1 AS connected");
  return rows[0];
}

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS search_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      from_location VARCHAR(100) NOT NULL,
      to_location VARCHAR(100) NOT NULL,
      travel_date VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
  `);
}

async function saveSearchRequest({ from, to, date }) {
  await initializeDatabase();
  const [result] = await pool.query(
    "INSERT INTO search_requests (from_location, to_location, travel_date) VALUES (?, ?, ?)",
    [from, to, date]
  );
  return result;
}

async function getSearchRequests() {
  await initializeDatabase();
  const [rows] = await pool.query(
    "SELECT id, from_location, to_location, travel_date, created_at FROM search_requests ORDER BY created_at DESC"
  );
  return rows;
}

module.exports = { pool, testConnection, initializeDatabase, saveSearchRequest, getSearchRequests };