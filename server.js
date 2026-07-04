const express = require("express");
const path = require("path");
const { saveSearchRequest, testConnection, getSearchRequests } = require("./db");

const app = express();
const requestedPort = Number(process.env.PORT || 3000);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve all static files (index.html, results.html, css, js, images, etc.)
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/health", async (req, res) => {
  try {
    const result = await testConnection();
    res.json({ status: "ok", connected: result.connected === 1 });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.post("/search", async (req, res) => {
  try {
    const searchData = req.body || req.query;
    const from = String(searchData.from || "").trim();
    const to = String(searchData.to || "").trim();
    const date = String(searchData.date || "").trim();

    if (!from || !to || !date) {
      return res.status(400).json({
        success: false,
        message: "Please provide origin, destination, and travel date.",
      });
    }

    const result = await saveSearchRequest({ from, to, date });
    res.json({ success: true, message: "Search saved to MySQL", id: result.insertId });
  } catch (error) {
    console.error("Failed to save search:", error);
    res.status(500).json({
      success: false,
      message: `Database error: ${error.message}`,
    });
  }
});

app.get("/results", (req, res) => {
  res.sendFile(path.join(__dirname, "results.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

app.get("/api/admin/searches", async (req, res) => {
  try {
    const rows = await getSearchRequests();
    res.json(rows);
  } catch (error) {
    console.error("Failed to fetch search requests:", error);
    res.status(500).json({ message: error.message });
  }
});

// Catch-all for unknown routes, falls back to home page
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "index.html"));
});

const startServer = (port) => {
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.log(`Port ${port} is busy. Trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(error);
      process.exit(1);
    }
  });
};

startServer(requestedPort);