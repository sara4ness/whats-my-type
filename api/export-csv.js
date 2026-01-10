import sqlite3 from "sqlite3";

let db = null;

async function getDb() {
  if (!db) {
    db = new sqlite3.Database("/tmp/user-choices.db");

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
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const database = await getDb();

    const rows = await new Promise((resolve, reject) => {
      database.all(
        "SELECT * FROM user_choices ORDER BY timestamp DESC",
        [],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    if (rows.length === 0) {
      res.setHeader("Content-Type", "text/plain");
      res.status(200).send("No data available");
      return;
    }

    // Convert to CSV
    const headers = Object.keys(rows[0]).join(",");
    const csvRows = rows.map((row) =>
      Object.values(row)
        .map((val) =>
          typeof val === "string" && val.includes(",") ? `"${val}"` : val
        )
        .join(",")
    );

    const csv = [headers, ...csvRows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=user-choices.csv"
    );
    res.status(200).send(csv);
  } catch (error) {
    console.error("Error exporting CSV:", error);
    res.status(500).json({
      success: false,
      error: "Failed to export CSV",
    });
  }
}
