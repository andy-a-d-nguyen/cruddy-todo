const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

// 1. should create a file for each todo
// 2. should use the generated unique id as the file name
// 3. should only save to do text contents in a file
// 4. should pass a todo object to the callback on success
exports.create = (text, callback) => {
  var id = counter.getNextUniqueId();
  items[id] = text;
  callback(null, { id, text });
};

exports.readAll = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

// path.join() method joins all given path segments together using the platform-specific separator as a delimiter, then normalizes the resulting path.
// normalize: removes '..' and '.' from path
// 'data': where data is being stored
exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  // fs.existsSync(path) : Returns true if the path exists, false otherwise.
  if (!fs.existsSync(exports.dataDir)) {
    // fs.mkdirSync(path, options) : Synchronously creates a directory
    fs.mkdirSync(exports.dataDir);
  }
};
