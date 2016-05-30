var api = require('./api');
var ui = require('./ui');

module.exports = function(operator) {
   // Add GraphQL Data Schema
   operator.addSchema({
      actions: require('./data/queries/actions')(operator),
      logentries: require('./data/queries/logentries')(operator),
   });
   
   // API/CMD Hooks
   api(operator);
   
   // UI Hooks
   ui(operator);
};
