/**
* Created by bjdmeest on 29/10/2015.
*/
const path = require('path'),
  exec = require('child_process').exec,
  spawn = require('child_process').spawn,
  os = require('os');

const EyeHandler = function (opts) {
  opts = opts || {};
  opts.eyePath = opts.eyePath || os.platform() === 'win32' ? "\"C:/Program Files/eye/bin/eye.cmd\"" : '/opt/eye/bin/eye.sh';
  opts.swiplPath = opts.swiplPath || os.platform() === 'win32' ? "swipl" : '/usr/bin/swipl';
  this.opts = opts;
};

EyeHandler.prototype.constructor = EyeHandler;

const fileOrder = {
  'pvm': 5,
  'n3p': 3,
  'n3': 2,
  'ttl': 1
};

EyeHandler.prototype.reason = function (opts, dataFiles, query, cb) {
    opts = opts || {};
    dataFiles = dataFiles || [];
    let i;
    //if (!query) {
    //    query = path.resolve(__dirname, '../resources/all.query.n3');
    //}

    for (i = 0; i < dataFiles.length; i++) {
        dataFiles[i].path = '"' + dataFiles[i].path + '"';
    }

    dataFiles.sort(function (a, b) {
        return fileOrder[b.type] - fileOrder[a.type];
    });

    if (dataFiles.length > 1 && dataFiles[1].type === 'pvm') {
        return cb(new Error('multiple pvm files entered!'));
    }
    const args = [];
    let cmd;

    if (dataFiles[0] && dataFiles[0].type === 'pvm') {
        cmd = this.opts.swiplPath;
        args.push('-x');
        args.push(dataFiles[0].path);
        args.push('--');
        dataFiles.splice(0, 1);
    }
    else {
        cmd = this.opts.eyePath;
    }
    for (i = 0; i < opts.length; i++) {
        args.push(opts[i].key);
        if (opts.value) {
            args.push(opts[i].value);
        }
    }

    for (i = 0; i < dataFiles.length; i++) {
        if (dataFiles[i].type === 'n3p') {
            args.push('--plugin');
        }
        args.push(dataFiles[i].path);
    }

    if (query) {
        args.push('--query');
        args.push('"' + query + '"');
    }

    console.log(args.join(' '));

  const buffer = 1024 * 1024 * 2; // 2 MB

  exec(cmd + ' ' + args.join(' '), {maxBuffer: buffer}, function (err, stdout, stderr) {
        cb(err, stdout, stderr);
    });
};

EyeHandler.prototype.reasonStream = function (opts, dataFiles, query, cb) {
  opts = opts || {};
  dataFiles = dataFiles || [];
  let i;
  //if (!query) {
  //    query = path.resolve(__dirname, '../resources/all.query.n3');
  //}

  dataFiles.sort(function (a, b) {
    return fileOrder[b.type] - fileOrder[a.type];
  });

  if (dataFiles.length > 1 && dataFiles[1].type === 'pvm') {
    return cb(new Error('multiple pvm files entered!'));
  }
  let args = [];
  let cmd;

  if (dataFiles[0] && dataFiles[0].type === 'pvm') {
    cmd = this.opts.swiplPath;
    args.push('-x');
    args.push(dataFiles[0].path);
    args.push('--');
    dataFiles.splice(0, 1);
  }
  else {
    cmd = this.opts.eyePath;
  }
  for (i = 0; i < opts.length; i++) {
    args.push(opts[i].key);
    if (opts.value) {
      args.push(opts[i].value);
    }
  }

  for (i = 0; i < dataFiles.length; i++) {
    if (dataFiles[i].type === 'n3p') {
      args.push('--plugin');
    }
    args.push(dataFiles[i].path);
  }

  if (query) {
    args.push('--query');
    args.push(query);
  }

  console.log(args.join(' '));

  args = args.map(function(arg) {
    return arg.replace(/\\/g, '/');
  });

  try {
    let child = spawn(cmd, args);
    cb(null, child);
  } catch (e) {
    cb(e);
  }
};

module.exports = EyeHandler;