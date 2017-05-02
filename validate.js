const path = require('path');
const os = require("os");
const fs = require("fs");
const Validator = require('./lib/Validator');
const argv = require('minimist')(process.argv.slice(2));

let profile = 'owl';
let distPath = path.resolve(__dirname, 'dist', 'n3unit-owl.pvm');
let queryPath = path.resolve(__dirname, 'resources', 'rules', 'query.n3');
let profilePath = path.resolve(__dirname, 'profiles', profile + '.n3');

let validator = new Validator({
  queryPath,
  extraFiles: [distPath, profilePath]
});

let sourcePath = argv.i;
let outputPath = argv.o;
let schemas = argv.s ? argv.s.split(',') : null;

if (schemas) {
  const prefices = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'resources', 'ontologies', 'prefix.json')));
  schemas = schemas.map(function (schema) {
    return prefices[schema] ? prefices[schema] : schema
  });
}

let sourceData = fs.readFileSync(sourcePath, 'utf8');

const startTime = new Date();
validator.validateStream(sourceData, schemas, function (err, child) {
  if (err) {
    throw err;
  }
  let outStream = fs.createWriteStream(outputPath, 'utf8');
  child.stderr.pipe(process.stderr);
  child.stdout.pipe(outStream);
  child.on('close', function (code) {
    if (code !== 0) {
      throw new Error("Couldn't reason: code " + code);
    }
    const endTime = new Date();
    console.log(`done in ${endTime.getTime() - startTime.getTime()}!`);
  });
});
