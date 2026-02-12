const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/case-metadata", (req, res) => {

  fs.readFile(path.join(__dirname, "case_metadata.json"), "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({
        error: "Unable to read case metadata file"
      });
    }

    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseError) {
      res.status(500).json({
        error: "Invalid JSON format"
      });
    }
  });

});

app.get("/llm-output", (req, res) => {
  fs.readFile(path.join(__dirname, "bifer.md"), "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading LLM output");
    }
    res.send(data);
  });
});

const PORT = process.env.PORT || 300



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});