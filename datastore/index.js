const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var Promise = require('bluebird');
const db = Promise.promisifyAll(require('fs'));

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
      callback(null, { id, text });
    });  
  });
};



exports.readAll = () => {
  return db.readdirAsync(exports.dataDir)
    .map(function(fileName) {
      var id = db.statAsync(fileName);
      var text = db.readFileAsync(fileName).catch(function ignore() {});
    })
      .then(function(data) {
       console.log('id', data)
  
      })
      
      
    
     
    
      
      // return { 
      //   id: path.basename(id, '.txt'), 
      //   text: db.readFileAsync(path.join(exports.dataDir, id), 'utf8').catch(function(err) {
      //   console.log(err);
      // }) }
    }
    
    


  // fs.readdir(exports.dataDir, (err, items) => {
    
  //   callback(null, _.map(items, (id, text) => {
  //     return { id: path.basename(id, '.txt'), text: path.basename(id, '.txt') };
  //   }));
  // }); 


// fs.readdir(exports.dataDir, (err, items) => {
    
//   callback(null, _.map(items, (id, text) => {
//     return { id: path.basename(id, '.txt'), text: path.basename(id, '.txt') };
//   }));
// }); 


exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), 'utf8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {id, text: data});
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), 'utf8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (!err) {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
