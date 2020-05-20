const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const util = require("util");

const replace = require("./logic");

const readDir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const deleteFile = util.promisify(fs.unlink);

const app = express();
app.use(cors());
app.use(bodyParser.json());

const FILES_DIR = path.join(__dirname, "files");
console.log(FILES_DIR);

// GET: '/files'
// response: {status: 'ok', files: ['all.txt','file.txt','names.txt']}

const list = readDir(path.join(__dirname, "files"));
app.get("/files", (req, res) => {
  res.json({ status: "ok", files: list });
});

// POST: '/files/add/:name'
//  body: {text: "file contents"}
//  write a new files into ./files with the given name and contents
// redirect -> GET: '/files'
app.post("/files/add/:name", (req, res, next) => {
  const name = req.params.name;
  const fileText = {
    text: req.body.text,
  };
  const newText = writeFile(`${FILES_DIR}/${name}`, fileText.text, (err) => {
    if (err && err.code === "ENOENT") {
      res.status(404).end();
      return;
    }
    if (err) {
      next(err);
      return;
    }
    res.redirect(303, "/files");
  });
  res.send(newText.text);
});

// PUT: '/files/replace/:oldFile/:newFile'
//  body: {toReplace: "str to replace", withThis: "replacement string"}
//  route logic:
//    read the old file
//    use the replace function to create the new text
//    write the new text to the new file name
//  note - params should not include .txt, you should add that in the route logic
// failure: {status: '404', message: `no file named ${oldFile}`  }
// success: redirect -> GET: '/files'

app.put("/files/replace/:oldFile/:newFile", async (req, res) => {
  const oldFile = req.params.oldFile;
  const newFile = req.params.newFile;

  const fileText = {
    toReplace: req.body.toReplace,
    withThis: req.body.withThis,
  };
  console.log(fileText);
  try {
    const readOldFile = fs.readFileSync(`${FILES_DIR}/${oldFile}.txt`, "utf-8");
    const replaceFile = replace(
      readOldFile,
      fileText.toReplace,
      fileText.withThis
    );

    const writtenFile = fs.writeFileSync(
      `${FILES_DIR}/${newFile}.txt`,
      replaceFile
    );
    res.json(writtenFile);
  } catch (err) {
    res.send({ status: "404", message: `no file named ${oldFile}` });
  }
});
// GET: '/report'
//  reads the contents from ./test/report.json and sends it
// response: {status: 'ok', report }
app.get("/report", (req, res) => {
  const reportFilePath = path.join(__dirname, "test", "report.json");
  console.log(reportFilePath);

  const report = fs.readFileSync(reportFilePath, "utf-8");
  res.send({ status: "ok", report: report });
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).end();
});

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Replacer is serving at http://localhost:${port}`)
);
