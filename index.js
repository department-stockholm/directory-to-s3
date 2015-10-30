'use strict';

const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const mime = require('mime-types');
const Emitter = require('events');
const glob = require('glob');
const recursive = require('recursive-readdir');
const bytes = require('bytes');


function Uploader(options) {
  Emitter.call(this);

  this.s3 = new AWS.S3({apiVersion: '2006-03-01'});
  this.acl = options.acl;
  this.verbose = options.verbose;
  this.prefix = options.prefix;
  this.bucket = options.bucket;
  this.pending = 0;
  this.totalBytes = 0;
  this.totalFiles = 0;
  this.uploadedBytes = 0;
  this.uploadedFiles = 0;
  this.root = path.resolve(process.cwd());

  this.failed = false;
  this.on('error', function(err) {
    this.failed = err;
  }.bind(this));
  this.on('file', function(file, buffer, root) {
    this.upload(file, buffer, root);
  }.bind(this));
}

Uploader.prototype = new Emitter();

Uploader.prototype.addPattern = function(pattern) {
  var options = {
    cwd: this.root
  };
  glob(pattern, options, function(err, files) {
    if (err) {
      this.emit('error', err);
    } else {
      files.forEach(readFile(this.root), this);
    }
  }.bind(this));
};

Uploader.prototype.addDirectory = function(dir) {
  var root = path.resolve(this.root, dir);
  recursive(root, function(err, files) {
    if (err) {
      this.emit('error', err);
    } else {
      files.forEach(readFile(root), this);
    }
  }.bind(this));
};

Uploader.prototype.upload = function(file, buffer, root) {
  var key = file.split(root + '/').pop();

  if (this.failed) {
    return;
  }

  this.pending += 1;
  this.totalBytes += buffer.byteLength;
  this.totalFiles += 1;

  var options = {
    ACL: this.acl,
    Bucket: this.bucket,
    Key: this.prefix + key,
    Body: buffer,
    ContentType: mime.contentType(path.extname(file))
  };
  this.s3.putObject(options, function(err, data) {
    this.pending -= 1;
    if (err) {
      this.emit('error', err);
      return;
    }
    this.uploadedBytes += buffer.byteLength;
    this.uploadedFiles += 1;
    if (this.pending === 0) {
      this.emit('end');
    } else {
      this.emit('progress');
    }
  }.bind(this));
};

function readFile(root) {
  return function(file) {
    fs.readFile(file, function(err, buffer) {
      if (err) {
        this.emit('error', err);
      } else {
        this.emit('file', file, buffer, root);
      }
    }.bind(this));
  };
}

module.exports = Uploader;