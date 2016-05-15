import { createCommandInterface } from 'hooman';
import babble from 'babble';

module.exports = function(operator) {
   
   if (operator.client) {
      return;
   }
   
   var log = createCommandInterface({

      interpreter: function(cmd, tokens, bridge) {
         var pattern = /^log /i;
         if (pattern.test(cmd)) {
            var commandArgsIndex = 1;

            try {
               var tag = tokens[commandArgsIndex];
               var text = tokens[commandArgsIndex + 1];
            }
            catch (e) {
               return {
                  cmd: this.interpret.translate,
                  args: [tag, text, bridge],
                  certainty: 0.5,
                  request: 'tag,text'
               };
            }

            return {
               cmd: this.interpret.translate,
               args: [tag, text, bridge],
               certainty: 1.0,
               request: null
            };
         }
         else {
            return false
         }
      },
      command: function(tag, text, bridge) {
         try {
            var db = bridge.operator.db;
            var date = new Date(); //TODO Date.create() or babble.get('moments').parse()
            date.setUTCHours(0, 0, 0, 0);
            var name = date.toISOString().split('T')[0] + '-' + tag;
            var logGnode = db.get('doozy.logentry.' + name);
            // first try to find an existing one for this date
            
            // SYNTAX: add node doozy.action test-me-out {"name":"test me out", "reason":"test"}
            if (logGnode) {
               
               // Append to details of log
               var details = logGnode.state.details + operator.newline + text;
               logGnode.setState(Object.assign({}, logGnode.state, {
                  details: details
               }));
               // Commit it
               db.commitChanges();
               bridge.done('text', 'Updated log "' + name + '"!' + operator.newline + details);
            }
            else {
               logGnode = new db.Gnode(db, name, 'doozy.logentry', {
                  rootActionId: null,
                  duration: 0,
                  date: date,
                  details: text,
                  entry: 'performed'
               });

               db.add(logGnode);
               
               var tagGnode = db.get('doozy.tag.' + tag);
               if (tagGnode) {
                  logGnode.connect(tagGnode, db.RELATION.ASSOCIATE);
               }
               
               db.commitChanges();
               bridge.done('text', 'Added log "' + name + '"!');   
            }
            
            
            
         }
         catch (e) {
            bridge.fail(String(e));
         }
      }
   });
   
   var todo = createCommandInterface({

      interpreter: function(cmd, tokens, bridge) {
         var pattern = /^todo /i;
         if (pattern.test(cmd)) {
            var commandArgsIndex = 1;

            try {
               var tag = tokens[commandArgsIndex];
               var text = tokens[commandArgsIndex + 1];
            }
            catch (e) {
               return {
                  cmd: this.interpret.translate,
                  args: [tag, text, bridge],
                  certainty: 0.5,
                  request: 'tag,text'
               };
            }

            return {
               cmd: this.interpret.translate,
               args: [tag, text, bridge],
               certainty: 1.0,
               request: null
            };
         }
         else {
            return false
         }
      },
      command: function(tag, text, bridge) {
         try {
            bridge.operator.getDb(function (db) {
               var date = new Date(); //TODO Date.create() or babble.get('moments').parse()
               date.setUTCHours(0, 0, 0, 0);
               
               var actionGnode = db.find(text, 'doozy.action').first();
               
               // first try to find an existing one for this date
               if (actionGnode) {
                  bridge.fail('Action already exists!\r\n' + actionGnode.tag);
                  return;
               }
               else {
                  actionGnode = new db.Gnode(db, text, 'doozy.action', {
                     userId: null,
                     name: text,
                     kind: 'Action',
                     duration: 0,
                     nextDate: null,
                     content: null,
                     isPublic: false,
                     created: new Date(),
                     isArchive: null,
                     ordinal: null,
                     projectStepId: null
                  });
                  
                  db.add(actionGnode);
                  
                  var tagGnode = db.get('doozy.tag.' + tag);
                  if (tagGnode) {
                     actionGnode.connect(tagGnode, db.RELATION.ASSOCIATE);
                  }
                  
                  db.commitChanges();
                  bridge.done('text', 'Added action "' + actionGnode.tag + '"!');   
               }
            });
         }
         catch (e) {
            bridge.fail(String(e));
         }
      }
   });

   // Register with operator
   operator.registerCommand(log);
   operator.registerCommand(todo);
};
