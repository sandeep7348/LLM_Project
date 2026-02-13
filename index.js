const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const { Octokit } = require("@octokit/rest");

const app = express();

app.use(express.json());
app.use(cors());

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("Backend running OK");
});

app.get("/case-metadata", (req, res) => {
  const filePath = path.join(__dirname, "case_metadata.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Metadata file missing" });
    }

    try {
      res.json(JSON.parse(data));
    } catch (e) {
      res.status(500).json({ error: "Invalid JSON" });
    }
  });
});

app.get("/llm-output", (req, res) => {
  const filePath = path.join(__dirname, "bifer.md");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("LLM file missing");
    }

    res.send(data);
  });
});

app.post("/submit-case", upload.single("caseNumber"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath, { encoding: "base64" });
    const fileName = req.file.filename;

    await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      path: `uploads/${fileName}`,
      message: `Upload file ${fileName}`,
      content: fileContent,
    });

    fs.unlinkSync(filePath);

    res.json({
      message: "File uploaded and pushed to GitHub",
      fileName,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "GitHub upload failed" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
