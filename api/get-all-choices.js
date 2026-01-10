import sqlite3 from "sqlite3";

let db = null;

async function getDb() {
  if (!db) {
    db = new sqlite3.Database("/tmp/user-choices.db");

    // Create table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS user_choices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        font_category TEXT NOT NULL,
        specific_font TEXT NOT NULL,
        font_size INTEGER NOT NULL,
        leading REAL NOT NULL,
        letter_spacing REAL,
        font_weight TEXT,
        content_width INTEGER,
        link_color TEXT,
        dyslexia_mode INTEGER,
        text_color TEXT NOT NULL,
        bg_color TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        session_id TEXT,
        user_agent TEXT,
        ip_address TEXT
      )
    `);
  }
  return db;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const database = await getDb();

    const data = await new Promise((resolve, reject) => {
      database.all(
        "SELECT * FROM user_choices ORDER BY timestamp DESC",
        [],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    res.status(200).json({
      success: true,
      data: data,
      count: data.length,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch data",
    });
  }
}
