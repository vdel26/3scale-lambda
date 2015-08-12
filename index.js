var archiver = require('archiver');
var p        = require('path');
var fs       = require('fs');
var split    = require('split');
var through  = require('through');

var output = fs.createWriteStream(__dirname + '/3scale-lambda-auth.zip');
var archive = archiver('zip');

output.on('close', function () {
  console.log(archive.pointer() + ' total bytes');
  console.log('zip bundle is ready');
});

archive.on('error', function (err) {
  throw err;
});

// configure destination of zipped bundle

archive.pipe(output);

// get a readable-writable stream that applies a
// string replacement to an input stream

function getReplacementStream (providerKey) {
  return through(function (line) {
    this.queue(line.replace(/PROVIDER_KEY/, providerKey));
  });
}

// get a readable stream that returns the Lambda
// function file with the right key in place

function getInputStream (providerKey) {
  return fs.createReadStream(__dirname + '/input/aws_3scale_auth.js')
          .pipe(split())
          .pipe(getReplacementStream(providerKey));
}

// public API

module.exports = function generator (providerKey) {
  archive
    .append(getInputStream(providerKey), { name: 'aws_3scale_auth.js' })
    .directory('input/node_modules', 'node_modules')
    .finalize();
}
