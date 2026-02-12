const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/case-metadata", (req, res) => {

  fs.readFile("case_metadata.json", "utf8", (err, data) => {
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
    fs.readFile("bifer.md", "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Error reading LLM output");
        }

        // ✅ SEND RAW MARKDOWN / TEXT
        res.send(data);
    });
});

// app.listen(3000, () => {
//     console.log("Server running on http://localhost:3000");
// });

module.exports = app;
