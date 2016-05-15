/**
 * windio AKA helio AKA lio (local input output) - I/O Helpers
 * 2015, HoomanLogic, Geoff Manning
 */
/* globals FileReader window */
// if (global.window) {
//     var localforage = require('localforage');
// }

module.exports = {
   getImage: function (msg) {

      if (typeof msg.dataUrl === 'undefined' || msg.dataUrl === null || msg.dataUrl === '' ||
            typeof msg.fileName === 'undefined' || msg.fileName === null || msg.fileName === '') {
            return '';
      }

      var indexOfExtStart = msg.fileName.lastIndexOf('.');
      var extension = msg.fileName.substring(indexOfExtStart + 1, msg.fileName.length).toLowerCase();

      if (!['jpg', 'png', 'gif', 'jpeg', 'tif', 'tiff'].contains(extension)) {
            return '';
      }

      return '<img src="' + msg.dataUrl + '" alt="Sent Image">';
   },

   convertFileToDataUrl: function (file, ondone) {
      var reader = new FileReader();
      reader.onloadend = function () {
            ondone(file.name, reader.result);
      };
      reader.readAsDataURL(file);
   },

   saveToDisk: function (fileURL, fileName) {

      if (typeof fileURL === 'undefined' || fileURL === null) {
            return;
      }

      // for non-IE
      if (!Globals.window.ActiveXObject) {
            var save = document.createElement('a');
            save.href = fileURL;
            save.target = '_blank';
            save.download = fileName || 'unknown';

            var event = document.createEvent('Event');
            event.initEvent('click', true, true);
            save.dispatchEvent(event);
            (Globals.window.URL || Globals.window.webkitURL).revokeObjectURL(save.href);

            // for IE
      }
      else if (!!Globals.window.ActiveXObject && document.execCommand) {
            var _window = Globals.window.open(fileURL, '_blank');
            _window.document.close();
            _window.document.execCommand('SaveAs', true, fileName || fileURL);
            _window.close();
      }
   },

   saveBlobToDisk: function (blobURL, fileName) {
      var reader = new FileReader();
      reader.readAsDataURL(blobURL);
      reader.onload = function (data) {
            var save = document.createElement('a');
            save.href = data.target.result;
            save.target = '_blank';
            save.download = fileName || 'unknown file';

            var event = document.createEvent('Event');
            event.initEvent('click', true, true);
            save.dispatchEvent(event);
            (window.URL || window.webkitURL).revokeObjectURL(save.href);
      };
   },

   /**
   * Save resource to local storage
   */
   saveLocal: function (location, resource) {
      var value = JSON.stringify(resource);
      // if (global.window) {
      //       return localforage.setItem(location, value);
      // }
   },

   /**
   * Retrieve resource from local storage
   */
   loadLocal: function (location) {
      // if (global.window) {
      //       return localforage.getItem(location);
      // }
   }
};
