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

// fs.readFile(path[, options], callback(error, data))
// fs.readdir(path[, options], callback(error, files)), files is a string array
// get an array of the names of all the files in exports.dataDir:
//  for each of those files, build the expected todo list:
// const expectedTodoList = [{ id: '00001', text: '00001' }, { id: '00002', text: '00002' }];
// invoke the callback function with (error, todoList) --> callee will respond to client

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, {withFileTypes: false}, (error, files) => {
    var todoList = files.map((file) => {
      file = file.slice(0, file.indexOf('.txt'));
      return {id: file, text: file};
    });
    callback(error, todoList);
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), 'utf8', (error, text) => {
    if (error) {
      callback(error);
    } else {
      callback(null, { id, text });
    }
  });
};

// fs.existsSync(path)
//
exports.update = (id, text, callback) => {
  let idPath = path.join(exports.dataDir, `${id}.txt`);
  if (fs.existsSync(idPath)) {
    fs.writeFile(idPath, text, (error) => {
      if (error) {
        callback(error);
      }
      callback(null, {id, text});
    });
  } else {
    callback(new Error(`No item with id: ${id}`));
  }
};

// fs.unlink(path, callback)
exports.delete = (id, callback) => {
  let idPath = path.join(exports.dataDir, `${id}.txt`);
  if (fs.existsSync(idPath)) {
    fs.unlink(idPath, (error) => {
      if (error) {
        callback(error);
      }
      callback();
    });
  } else {
    callback(new Error(`No item with id: ${id}`));
  }
};

// exports.delete = (id, callback) => {
//   var item = items[id];
//   delete items[id];
//   if (!item) {
//     // report an error if item not found
//     callback(new Error(`No item with id: ${id}`));
//   } else {
//     callback();
//   }
// };

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
