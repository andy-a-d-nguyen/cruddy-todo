const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

// pad zeros in front of a num
const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  // Asynchronously reads the entire contents of a file.
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  // fs.writeFile(file, data[, options], callback)
  // When file is a filename, asynchronously writes data to the file, replacing the file if it already exists. data can be a string or a buffer.
  // When file is a file descriptor, the behavior is similar to calling fs.write() directly
  // File descriptor: numeric identifier
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

// 1. should use error first callback pattern
// 2. should give an id as a zaro padded string
// 3. should give the next id based on the count in the file
// 4. should update the counter file with the next value
exports.getNextUniqueId = (callback) => {
  // find current counter by reading counter file
  readCounter((err, counter) => {
    // overwrite counter by incrementing by 1
    writeCounter(counter + 1, (err, id) => {
      // callback takes in err as 1st argument and id as 2nd argument (according to test spec)
      callback(err, id);
    });
  });
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
