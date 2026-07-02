const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve all static files (index.html, results.html, css, js, images, etc.)
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/search", (req, res) => {
  // Handle search request and store in session
  const searchData = req.body || req.query;
  // You can save to database here
  res.json({ success: true, message: "Search received" });
});

app.get("/results", (req, res) => {
  res.sendFile(path.join(__dirname, "results.html"));
});

// Catch-all for unknown routes, falls back to home page
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});