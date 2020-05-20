const fs = require("fs");
const express = require("express");
const path = require("path");

const replace = require("./logic/index.js");

// /* write a CLI interface for the "replace" function and your files

//   command line arguments:
//     1: the file you want to read from
//     2: the old string to replace
//     3: the new string to replace it with
//     4: the file you want to write to

//   examples:
//   $ node cli.js the-book-of-sand.txt the any sand-the-any.txt
//   $ node cli.js the-library-of-babel.txt f g library-f-g.txt

//   behavior:
//   : parse command line arguments from process.argv
//     (let the user know if they are missing any arguments!)
//   : read from the selected file in the './files' directory
//   : use your logic function to create the new text
//   : write to the new file
//   : console.log a nice message letting the user know what happened

//   little challenges:
//   : -help
//     if a user passes in "-help" as any command line argument,
//     log a little description of how the CLI works
//   : -list
//     if a user passes in "-list" as any command line argument,
//     log a list of all the file names in "./files"

const list = fs.readdirSync(path.join(__dirname, "files"));
const DOC_STRING = `
COMMANDS:

  list
    print all files to the console

  command line:
    node cli.js <reading file> <to replace> <with this> <new text name>
      
FLAGS:

  -h
    print this helpful message

  
`;

if (process.argv.includes("-h")) {
  console.log(DOC_STRING);
  process.exit(0);
}

if (process.argv.includes("list")) {
  console.log(list);
}

const text = process.argv[2];
const toReplace = process.argv[3];
const withThis = process.argv[4];
const newText = process.argv[5];

if (!text || !toReplace || !withThis || !newText) {
  console.log(
    `you must write comand line like this: node cli.js <reading file> <to replace> <with this> <new text name>`
  );
}
if (!list.includes(text)) {
  console.log(`the file name must be in the files folder.`);
} else {
  const FILE_PATH = path.join(__dirname, "files", text);
  const newFilePath = path.join(__dirname, "files", newText);
  const textRead = fs.readFileSync(FILE_PATH, "utf-8");
  const writtenText = replace(textRead, toReplace, withThis);

  fs.writeFileSync(newFilePath, writtenText);
}
