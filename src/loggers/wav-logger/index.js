var wavFileInfo = require('./wav');
var babble = require('babble');
var path = require('path');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs-extra'));

/**
 * Promise to return a list of subdirectories that parse to a date
 */
function getWavLogFolders (uri) {
   // Return a promise
   return new Promise( function (resolve, reject) {
      // Build list of folders
      var folders = [];
      // Get uri directory listing
      fs.readdirAsync(uri).then(function (list) {
         // Error getting directory listing
         if (!list) {
            reject(err);
         }
         
         // Return a promise to process a file-stats-promise for each directory listing
         return Promise.all(list.map(function (item) {
            return fs.statAsync(path.join(uri, item)).then(function (stats) {
               // We're looking for directories
               if (stats.isDirectory()) {
                  // Directory labeled as a date
                  var date = babble.moments.parseLocalDate(this.filename);
                  if (date) {
                     // Add this folder
                     folders.push(path.join(uri, this.filename));
                  }
               }
            }.bind({ filename: item }));
         }));
      }).done(function () {
         // Resolve this promise with the results
         resolve(folders);
      });
   });
};

function getWavLogs (folders) {
   return new Promise(function (resolve, reject) {
      var logs = [];
      return Promise.all(folders.map(function (folder) {
         return getWavLog(folder).then(function (log) {
            logs.push(log);
         });
      })).then(function () {
         resolve(logs);
      });
   });
};

function getWavLog (uri) {
   return new Promise(function (resolve, reject) {

      var totalDuration = 0;
      var counter = 0;
      var items = [];
      var waiting = false;
      
      fs.walk(uri).on('readable', function() {
         var item;
         
         while (item = this.read()) {
            // All files in '.gnapses' are by assumed to be a pointer to a gnode
            if (item.stats.isFile() && item.path.slice(-4).toLowerCase() === '.wav') {
               // Up the counter of wav files
               counter++;
               // Get wav file info
               wavFileInfo.infoByFilename(item.path, function (err, info) {
                  // Successfully extracted wav info
                  if (info) {
                     // add to total
                     totalDuration += info.duration;
                     // add log item
                     items.push({
                        start: info.stats.birthtime || info.stats.atime,
                        duration: info.duration
                     });
                  }
                  
                  // Remove from counter
                  counter--;
                  
                  // Resolve when all wav files have been processed
                  if (waiting && counter === 0) {
                     waiting = false;
                     resolve({
                        items: items,
                        name: uri.split(path.sep).slice(-1)[0],
                        duration: totalDuration,
                        uri: uri,
                     });
                  }
               });
            }
         }
      })
      .on('error', function(err) {
         switch (err.errno) {
            case (-4058):
               // No such file or directory error:
               // The gnode has no .gnapses folder
               // This is fine, just ignore it
               break;
            default:
               console.log(err);
               break;
         }
         return;
      })
      .on('end', function() {
         if (counter !== 0) {
            waiting = true;
         }
         else {
            resolve({
               items: items,
               name: uri.split(path.sep).slice(-1)[0],
               duration: totalDuration,
               uri: uri,
            });
         }
         return;
      });
   });
}

module.exports = {
   getWavLog: getWavLog,
   getWavLogs: getWavLogs,
   getWavLogFolders: getWavLogFolders
};

// Sample Use
// var those = require('those');
// var wavPath = 'D:\\prj_audio';
// getWavLogFolders(wavPath).then(getWavLogs).then(function (logs) {
//    those(logs).order('name').flip().forEach(function (log) {
//       var duration = babble.get('durations').parse(String(parseInt(log.duration, 10)) + ' sec');
//       console.log(log.name + ' : ' + log.items[0].start + ' : ' + duration.tokens[0].value.toString(':'));
//    });
// });
