
var wavFileInfo = require('./wav');
var babble = require('babble');
var path = require('path');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs-extra'));

var wavPath = 'D:\\prj_audio';

/**
 * Promise to return a list of subdirectories that parse to a date
 */
function getDateLogFolders (uri) {
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

function tallyWavDurations (folders) {
   return Promise.all(folders.map(function (folder) {
      return tallyWavDuration(folder).then(function (seconds) {
         var duration = babble.get('durations').parse(String(parseInt(seconds, 10)) + ' sec');
         var log = { 
            uri: folder,
            name: folder.split(path.sep).slice(-1)[0],
            duration: duration.tokens[0].value.toString(':')
         };
         console.log(log);
      });
   }));
};

function tallyWavDuration (uri) {
   return new Promise(function (resolve, reject) {
      var waiting = false;
      var time = 0;
      var counter = 0;
      fs.walk(uri).on('readable', function() {
         var item;
         
         while (item = this.read()) {
            // All files in '.gnapses' are by assumed to be a pointer to a gnode
            if (item.stats.isFile() && item.path.slice(-3).toLowerCase() === 'wav') {

               // Build target and relation from path
               var base = path.basename(item.path);
               var target = base.slice(2);
               var relation = base.slice(0, 1);
               counter++;
               wavFileInfo.infoByFilename(item.path, function (err, info) {
                  if (info) {
                     // add to total
                     time += info.duration;
                  }
                  counter--;
                  
                  if (waiting && counter === 0) {
                     waiting = false;
                     resolve(time);
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
         if (counter === 0) {
            
         }
         else {
            waiting = true;
         }
         return;
      });
   });
}

function logTime (sec) {
   // var seconds = sec % 60;
   // var minutes = (sec - seconds) / 60;
   var duration = babble.get('durations').parse(String(parseInt(sec, 10)) + 'sec'); //minutes + 'm' + parseInt(seconds, 10) + 's'
   console.log(duration.tokens[0].value.toString(':'));
}

getDateLogFolders(wavPath).then(tallyWavDurations);
