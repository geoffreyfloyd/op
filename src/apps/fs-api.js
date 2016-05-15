import { createCommandInterface } from 'hooman';

module.exports = function(operator) {

   var list = createCommandInterface({

      interpreter: function(cmd, tokens, bridge) {
         var path;
         var pattern = /^(ls|list|dir) /i;
         if (pattern.test(cmd)) {
            var commandArgsIndex = 1;

            try {
               
               path = tokens[commandArgsIndex];
               console.log(path);
            }
            catch (e) {
               return {
                  cmd: this.interpret.translate,
                  args: [path, bridge],
                  certainty: 0.5,
                  request: 'path'
               };
            }

            return {
               cmd: this.interpret.translate,
               args: [path, bridge],
               certainty: 1.0,
               request: null
            };
         }
         else {
            return false
         }
      },
      command: function(path, bridge) {
         try {
            // SYNTAX: add node doozy.action test-me-out {"name":"test me out", "reason":"test"}
            var fs = bridge.operator.fs;
            fs.readdirAsync(path).then(function(dir) {
               if (dir) {
                  var result = '';
                  dir.forEach(function (item) {
                     result += item + '\n';
                  });  
                  bridge.done('text', result);   
               }
               else {
                  
               }
            }).error(function (err) {
               bridge.fail(err.statusText || err);   
            });
         }
         catch (e) {
            bridge.fail('Unexpected args');
         }

         
      }
   });

   operator.registerCommand(list);

};
