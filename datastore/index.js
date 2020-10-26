const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

/**The value that is saved in counter.txt increases with each new todo item created
The number of files in dataDir increases with each new todo item created
The contents of each file contain only the text of that todo item*/
/**
 * @param {string} text
 * @param {function} callback: (errror[defaults to null], Object{id and text})
 * @sideEffect builds a new file in the 'datastore/data' directory
 */
exports.create = (text, callback) => {
  // getNextUniqueId(function(id, _callback) {
  //  use fs.open(path, callback) to create a new file named with the counter
  //  callback takes in err and (optional) file
  //  invoke the callback
  //}
  // counter.getNextUniqueId((id, callback) => {
  counter.getNextUniqueId((error, id) => {
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (error) => {
      if (error) {
        callback(error);
      }
      callback(null, {id, text});
    });
  });
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

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
