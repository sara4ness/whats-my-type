// server.js - Backend server to collect and store user typography choices
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database("./user-choices.db", (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log("Connected to SQLite database");

    // Create table if it doesn't exist
    db.run(
      `
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
    `,
      (err) => {
        if (err) {
          console.error("Error creating table:", err);
        } else {
          console.log("Table created or already exists");
        }
      }
    );
  }
});

// POST endpoint to save user choices
app.post("/api/save-choices", (req, res) => {
  const {
    fontCategory,
    specificFont,
    fontSize,
    leading,
    letterSpacing,
    fontWeight,
    contentWidth,
    linkColor,
    dyslexiaMode,
    textColor,
    bgColor,
    sessionId,
  } = req.body;

  // Get user agent and IP for analytics
  const userAgent = req.headers["user-agent"] || "Unknown";
  const ipAddress = req.ip || req.connection.remoteAddress || "Unknown";

  const sql = `
    INSERT INTO user_choices (
      font_category, 
      specific_font, 
      font_size, 
      leading,
      letter_spacing,
      font_weight,
      content_width,
      link_color,
      dyslexia_mode,
      text_color, 
      bg_color,
      session_id,
      user_agent,
      ip_address
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      fontCategory,
      specificFont,
      fontSize,
      leading,
      letterSpacing || 0,
      fontWeight || "400",
      contentWidth || 700,
      linkColor || "#0066cc",
      dyslexiaMode ? 1 : 0,
      textColor,
      bgColor,
      sessionId,
      userAgent,
      ipAddress,
    ],
    function (err) {
      if (err) {
        console.error("Error saving to database:", err);
        return res.status(500).json({
          success: false,
          error: "Failed to save choices",
        });
      }

      console.log(`New entry saved with ID: ${this.lastID}`);
      res.json({
        success: true,
        id: this.lastID,
        message: "Choices saved successfully",
      });
    }
  );
});

// GET endpoint to retrieve all choices (for admin/analysis)
app.get("/api/get-all-choices", (req, res) => {
  const sql = "SELECT * FROM user_choices ORDER BY timestamp DESC";

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch data",
      });
    }

    res.json({
      success: true,
      data: rows,
      count: rows.length,
    });
  });
});

// GET endpoint to get statistics
app.get("/api/stats", (req, res) => {
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

  const stats = {};

  // Run all queries
  Promise.all([
    new Promise((resolve) =>
      db.get(queries.total, [], (err, row) => resolve(row))
    ),
    new Promise((resolve) =>
      db.all(queries.fontCategories, [], (err, rows) => resolve(rows))
    ),
    new Promise((resolve) =>
      db.all(queries.specificFonts, [], (err, rows) => resolve(rows))
    ),
    new Promise((resolve) =>
      db.get(queries.avgFontSize, [], (err, row) => resolve(row))
    ),
    new Promise((resolve) =>
      db.get(queries.avgLeading, [], (err, row) => resolve(row))
    ),
    new Promise((resolve) =>
      db.all(queries.popularColors, [], (err, rows) => resolve(rows))
    ),
  ])
    .then(([total, categories, fonts, avgSize, avgLeading, colors]) => {
      res.json({
        success: true,
        stats: {
          totalEntries: total.count,
          fontCategories: categories,
          popularFonts: fonts,
          averageFontSize: Math.round(avgSize.avg * 10) / 10,
          averageLeading: Math.round(avgLeading.avg * 100) / 100,
          popularColorSchemes: colors,
        },
      });
    })
    .catch((err) => {
      console.error("Error getting stats:", err);
      res
        .status(500)
        .json({ success: false, error: "Failed to get statistics" });
    });
});

// GET endpoint to export data as CSV
app.get("/api/export-csv", (req, res) => {
  const sql = "SELECT * FROM user_choices ORDER BY timestamp DESC";

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch data",
      });
    }

    // Convert to CSV
    const headers = Object.keys(rows[0] || {}).join(",");
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
    res.send(csv);
  });
});

// GET endpoint to export data as JSON
app.get("/api/export-json", (req, res) => {
  const sql = "SELECT * FROM user_choices ORDER BY timestamp DESC";

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch data",
      });
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=user-choices.json"
    );
    res.json(rows);
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Database location: ${path.resolve("./user-choices.db")}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err);
    } else {
      console.log("Database connection closed");
    }
    process.exit(0);
  });
});
