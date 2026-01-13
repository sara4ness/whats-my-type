const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const db = new sqlite3.Database("./typography-choices.db", (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log("Connected to SQLite database");
    initializeDatabase();
  }
});

// Create tables if they don't exist
function initializeDatabase() {
  db.run(
    `
        CREATE TABLE IF NOT EXISTS user_choices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            font_category TEXT,
            specific_font TEXT,
            font_size INTEGER,
            leading TEXT,
            text_color TEXT,
            bg_color TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `,
    (err) => {
      if (err) {
        console.error("Error creating table:", err);
      } else {
        console.log("Database table ready");
      }
    }
  );
}

// API Routes

// Save user choices
app.post("/api/save-choices", (req, res) => {
  const {
    fontCategory,
    specificFont,
    fontSize,
    leading,
    textColor,
    bgColor,
    sessionId,
  } = req.body;

  // Generate session ID if not provided
  const finalSessionId = sessionId || uuidv4();

  const sql = `
        INSERT INTO user_choices 
        (session_id, font_category, specific_font, font_size, leading, text_color, bg_color)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

  db.run(
    sql,
    [
      finalSessionId,
      fontCategory,
      specificFont,
      fontSize,
      leading,
      textColor,
      bgColor,
    ],
    function (err) {
      if (err) {
        console.error("Error saving choices:", err);
        return res.status(500).json({
          success: false,
          error: "Failed to save choices",
        });
      }

      res.json({
        success: true,
        message: "Choices saved successfully",
        id: this.lastID,
        sessionId: finalSessionId,
      });
    }
  );
});

// Get all choices
app.get("/api/get-all-choices", (req, res) => {
  const sql = "SELECT * FROM user_choices ORDER BY timestamp DESC";

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching choices:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch choices",
      });
    }

    res.json({
      success: true,
      data: rows,
    });
  });
});

// Get statistics
app.get("/api/stats", (req, res) => {
  // Get total entries
  db.get("SELECT COUNT(*) as count FROM user_choices", [], (err, totalRow) => {
    if (err) {
      console.error("Error getting stats:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to get statistics",
      });
    }

    // Get average font size
    db.get(
      "SELECT AVG(font_size) as avg FROM user_choices",
      [],
      (err, avgFontSize) => {
        // Get average leading (convert to number first)
        db.all("SELECT leading FROM user_choices", [], (err, leadingRows) => {
          const leadingValues = leadingRows
            .map((r) => parseFloat(r.leading))
            .filter((n) => !isNaN(n));
          const avgLeading =
            leadingValues.length > 0
              ? (
                  leadingValues.reduce((a, b) => a + b, 0) /
                  leadingValues.length
                ).toFixed(2)
              : 0;

          // Get font category distribution
          db.all(
            `
                    SELECT font_category, COUNT(*) as count 
                    FROM user_choices 
                    GROUP BY font_category 
                    ORDER BY count DESC
                `,
            [],
            (err, fontCategories) => {
              // Get popular fonts
              db.all(
                `
                        SELECT specific_font, COUNT(*) as count 
                        FROM user_choices 
                        GROUP BY specific_font 
                        ORDER BY count DESC 
                        LIMIT 10
                    `,
                [],
                (err, popularFonts) => {
                  // Get popular color schemes
                  db.all(
                    `
                            SELECT text_color, bg_color, COUNT(*) as count 
                            FROM user_choices 
                            GROUP BY text_color, bg_color 
                            ORDER BY count DESC 
                            LIMIT 10
                        `,
                    [],
                    (err, popularColorSchemes) => {
                      res.json({
                        success: true,
                        stats: {
                          totalEntries: totalRow.count,
                          averageFontSize: Math.round(avgFontSize.avg || 0),
                          averageLeading: avgLeading,
                          fontCategories: fontCategories || [],
                          popularFonts: popularFonts || [],
                          popularColorSchemes: popularColorSchemes || [],
                        },
                      });
                    }
                  );
                }
              );
            }
          );
        });
      }
    );
  });
});

// Export as CSV
app.get("/api/export-csv", (req, res) => {
  const sql = "SELECT * FROM user_choices ORDER BY timestamp DESC";

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error exporting CSV:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to export CSV",
      });
    }

    // Create CSV header
    const headers = [
      "ID",
      "Session ID",
      "Font Category",
      "Specific Font",
      "Font Size",
      "Leading",
      "Text Color",
      "BG Color",
      "Timestamp",
    ];
    let csv = headers.join(",") + "\n";

    // Add rows
    rows.forEach((row) => {
      csv +=
        [
          row.id,
          row.session_id,
          `"${row.font_category}"`,
          `"${row.specific_font}"`,
          row.font_size,
          row.leading,
          row.text_color,
          row.bg_color,
          row.timestamp,
        ].join(",") + "\n";
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=typography-choices.csv"
    );
    res.send(csv);
  });
});

// Export as JSON
app.get("/api/export-json", (req, res) => {
  const sql = "SELECT * FROM user_choices ORDER BY timestamp DESC";

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error exporting JSON:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to export JSON",
      });
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=typography-choices.json"
    );
    res.json(rows);
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Admin dashboard: Open admin-dashboard.html in your browser`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err);
    }
    console.log("\n✅ Database connection closed");
    process.exit(0);
  });
});
