const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
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

// exports.readAll = (callback) => {
//   fs.readdir(exports.dataDir, (error, files) => {
//     var todoList = files.map((file) => {
//       file = file.slice(0, file.indexOf('.txt'));
//       return {id: file, text: file};
//     });
//     callback(error, todoList);
//   });
// };

// exports.readAll = (callback) => {
//   return fs.readdir(exports.dataDir)
//     .then((files) => files.map(file => {
//       return fsPromises.readFile(exports.dataDir + `${file}.txt`);
//     }))
//     .then(() => Promise.all())
//     .catch((error) => console.log('Error in datastore/index.js::readDirAsync'));
// };

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error');
    } else {
      var data = files.map((file) => {
        var id = file.slice(0, file.indexOf('.txt'));
        var filepath = path.join(exports.dataDir, `${id}.txt`);
        return fs.promises.readFile(filepath, 'utf8')
          .then((fileData) => {
            return {
              id: id,
              text: fileData
            };
          });
      });
      Promise.all(data)
        .then((todos) => {
          if (err) {
            callback(err);
          } else {
            callback(null, todos);
          }
        });
    }
  });
};

/**
 * obtain a list of all the files
 * then, assemble and return an array of objects
 * iff error, log to consle
 */
// var preaddir = Promise.promisify(fs.readdir);
// exports.readAll = callback => {
//   return preaddir(exports.dataDir)
//     .then(files =>
//       files.map(file => ({
//         file: fs.readFileSync(exports.dataDir + `${file}.txt`, 'utf8')
//       })
//       )
//     )
//     .catch();
// };

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
