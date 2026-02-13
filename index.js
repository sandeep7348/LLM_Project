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
const localRepoDir = path.join(__dirname, "local_repo");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(localRepoDir)) {
  fs.mkdirSync(localRepoDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.get("/", (req, res) => {
  res.send("Backend running OK");
});

app.get("/read-local-file", (req, res) => {
  try {
    const filePath = path.join(localRepoDir, "output.md");
    const data = fs.readFileSync(filePath, "utf8");
    res.send(data);
  } catch (err) {
    res.status(500).json({ error: "Local file not found" });
  }
});

app.get("/read-local-file/:fileName", (req, res) => {
  try {
    const fileName = req.params.fileName;
    const filePath = path.join(localRepoDir, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found");
    }

    const data = fs.readFileSync(filePath, "utf8");
    res.send(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/read-latest-local-file", (req, res) => {
  try {
    const files = fs.readdirSync(localRepoDir);

    if (!files.length) {
      return res.status(404).send("No files in local repo");
    }

    const latestFile = files
      .map(file => ({
        name: file,
        time: fs.statSync(path.join(localRepoDir, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time)[0].name;

    const data = fs.readFileSync(path.join(localRepoDir, latestFile), "utf8");

    res.json({
      file: latestFile,
      content: data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/read-algorithm-pdf", (req, res) => {
  const filePath = "C:/Users/8YIN/OneDrive/Desktop/algorithm2e.pdf";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).send("File not found");
    }

    res.setHeader("Content-Type", "application/pdf");
    res.send(data);
  });
});

app.get("/download-algorithm-pdf", (req, res) => {
  const filePath = "C:/Users/8YIN/OneDrive/Desktop/algorithm2e.pdf";
  res.download(filePath);
});

app.get("/stream-algorithm-pdf", (req, res) => {
  const filePath = "C:/Users/8YIN/OneDrive/Desktop/algorithm2e.pdf";
  const stream = fs.createReadStream(filePath);
  res.setHeader("Content-Type", "application/pdf");
  stream.pipe(res);
});

app.get("/case-metadata", (req, res) => {
  const filePath = path.join(__dirname, "case_metadata.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Metadata file missing" });
    }

    try {
      res.json(JSON.parse(data));
    } catch {
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
    const repoPath = `uploads/${fileName}`;

    let sha;

    try {
      const existingFile = await octokit.repos.getContent({
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        path: repoPath,
      });

      sha = existingFile.data.sha;
    } catch {}

    await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      path: repoPath,
      message: `Upload file ${fileName}`,
      content: fileContent,
      branch: "main",
      sha,
    });

    fs.unlinkSync(filePath);

    res.json({
      message: "File uploaded and pushed to GitHub",
      fileName,
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
      status: err.status,
      details: err.response?.data,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
