/* global describe, run, it */

const fs = require('fs'),
  path = require('path'),
  TestHelper = require('../lib/TestHelper');

describe('individual bugs', function () {
  this.timeout(3000);
  const basePath = path.resolve(__dirname, './bugs');
  const patternMap = '%s.mapping.rml.ttl';
  const outMap = '%s.out.ttl';
  const returnMap = '%s.test-output.ttl';
  const rmlValidator = TestHelper.createRMLValidator();
  it('should fix #3', function (done) {
    let paths = TestHelper.createPaths([patternMap, outMap, returnMap], 3, basePath);
    checkMap(rmlValidator, paths[0], paths[1], paths[2], done);
  });
  it('should fix #8', function (done) {
    let paths = TestHelper.createPaths([patternMap, outMap, returnMap], 8, basePath);
    checkMap(rmlValidator, paths[0], paths[1], paths[2], done);
  });
  it('should fix #19', function (done) {
    let paths = TestHelper.createPaths([patternMap, outMap, returnMap], 19, basePath);
    checkMap(rmlValidator, paths[0], paths[1], paths[2], done);
  });
  it('should fix #20', function (done) {
    let paths = TestHelper.createPaths([patternMap, outMap, returnMap], 20, basePath);
    checkMap(rmlValidator, paths[0], paths[1], paths[2], done);
  });
  it('should fix #100', function (done) {
    let paths = TestHelper.createPaths([patternMap, outMap, returnMap], 100, basePath);
    checkMap(rmlValidator, paths[0], paths[1], paths[2], done);
  });
  it('should fix #101', function (done) {
    let paths = TestHelper.createPaths([patternMap, outMap, returnMap], 101, basePath);
    checkMap(rmlValidator, paths[0], paths[1], paths[2], done);
  });
  it('should fix #102', function (done) {
    let paths = TestHelper.createPaths([patternMap, outMap, returnMap], 102, basePath);
    checkMap(rmlValidator, paths[0], paths[1], paths[2], done);
  });
  it('should fix #103', function (done) {
    let paths = TestHelper.createPaths([patternMap, outMap, returnMap], 103, basePath);
    checkMap(rmlValidator, paths[0], paths[1], paths[2], done);
  });
  it('should fix #104', function (done) {
    let paths = TestHelper.createPaths([patternMap, outMap, returnMap], 104, basePath);
    checkMap(rmlValidator, paths[0], paths[1], paths[2], done);
  });
  it('should fix #105', function (done) {
    let paths = TestHelper.createPaths([patternMap, outMap, returnMap], 105, basePath);
    checkMap(rmlValidator, paths[0], paths[1], paths[2], done);
  });
  it('should fix #106', function (done) {
    let paths = TestHelper.createPaths([patternMap, outMap, returnMap], 106, basePath);
    checkMap(rmlValidator, paths[0], paths[1], paths[2], done);
  });
  it('should fix #107', function (done) {
    let paths = TestHelper.createPaths([patternMap, outMap, returnMap], 107, basePath);
    checkMap(rmlValidator, paths[0], paths[1], paths[2], done);
  });
});

function checkMap(validator, inputPath, shouldPath, outPath = null, done) {
  fs.readFile(inputPath, 'utf8', function (err, ttl) {
    if (err) {
      throw err;
    }
    validator.validate(ttl, null, function (err, out) {
      if (err) {
        throw err;
      }
      if (outPath) {
        fs.writeFileSync(outPath, out, 'utf8');
      }
      fs.readFile(shouldPath, 'utf8', function (err, base) {
        if (err) {
          if (err.code === 'ENOENT') {
            fs.writeFileSync(shouldPath, '', 'utf8');
            base = '<a> <b> <c> .';
          } else {
            throw err;
          }
        }
        TestHelper.compareTtl(out, base, done);
      });
    });
  });
}

describe('all bugs', function () {
  const basePath = path.resolve(__dirname, './bugs');
  fs.readdir(basePath, function (err, files) {
    const bugFiles = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const matches = /^(\d+).mapping+.rml+.ttl$/.exec(file);
      if (matches) {
        bugFiles.push({
          name: file,
          file: path.resolve(basePath, file),
          output: path.resolve(basePath, matches[1] + '.out.ttl')
        });
      }
    }
    describe('bugs from files', function () {
      TestHelper.walkFiles(bugFiles, function (inputFile, out) {
        fs.writeFileSync(path.resolve(inputFile.replace('.mapping.rml.ttl', '.test-output.ttl')), out, 'utf8');
        console.log(out);
      });
    });
    //run();
  });
});
