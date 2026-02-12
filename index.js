const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

// ---------- HEALTH CHECK ----------
app.get("/", (req, res) => {
  res.send("Backend running OK");
});

// ---------- METADATA ----------
app.get("/case-metadata", (req, res) => {
  const filePath = path.join(__dirname, "case_metadata.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.log("Metadata file error:", err);
      return res.status(500).json({ error: "Metadata file missing" });
    }

    try {
      res.json(JSON.parse(data));
    } catch (e) {
      res.status(500).json({ error: "Invalid JSON" });
    }
  });
});

// ---------- LLM OUTPUT ----------
app.get("/llm-output", (req, res) => {
  const filePath = path.join(__dirname, "bifer.md");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.log("LLM file error:", err);
      return res.status(500).send("LLM file missing");
    }

    res.send(data);
  });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
