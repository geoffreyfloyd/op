var api = require('./api');
var ui = require('./ui');

module.exports = function(operator) {
   // Add GraphQL Data Schema
   operator.addSchema({
      actions: require('./data/actions')(operator),
      logentries: require('./data/logentries')(operator),
      tags: require('./data/tags')(operator),
   });
   
   // API/CMD Hooks
   api(operator);
   
   // UI Hooks
   ui(operator);
};
