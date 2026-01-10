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

    const queries = {
      total: "SELECT COUNT(*) as count FROM user_choices",
      fontCategories:
        "SELECT font_category, COUNT(*) as count FROM user_choices GROUP BY font_category",
      specificFonts:
        "SELECT specific_font, COUNT(*) as count FROM user_choices GROUP BY specific_font ORDER BY count DESC",
      avgFontSize: "SELECT AVG(font_size) as avg FROM user_choices",
      avgLeading: "SELECT AVG(leading) as avg FROM user_choices",
      popularColors:
        "SELECT text_color, bg_color, COUNT(*) as count FROM user_choices GROUP BY text_color, bg_color ORDER BY count DESC LIMIT 5",
    };

    const results = await Promise.all([
      new Promise((resolve, reject) => {
        database.get(queries.total, [], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      }),
      new Promise((resolve, reject) => {
        database.all(queries.fontCategories, [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      }),
      new Promise((resolve, reject) => {
        database.all(queries.specificFonts, [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      }),
      new Promise((resolve, reject) => {
        database.get(queries.avgFontSize, [], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      }),
      new Promise((resolve, reject) => {
        database.get(queries.avgLeading, [], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      }),
      new Promise((resolve, reject) => {
        database.all(queries.popularColors, [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      }),
    ]);

    const [total, categories, fonts, avgSize, avgLeading, colors] = results;

    res.status(200).json({
      success: true,
      stats: {
        totalEntries: total.count || 0,
        fontCategories: categories || [],
        popularFonts: fonts || [],
        averageFontSize: avgSize.avg ? Math.round(avgSize.avg * 10) / 10 : 0,
        averageLeading: avgLeading.avg
          ? Math.round(avgLeading.avg * 100) / 100
          : 0,
        popularColorSchemes: colors || [],
      },
    });
  } catch (error) {
    console.error("Error getting stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get statistics",
    });
  }
}
