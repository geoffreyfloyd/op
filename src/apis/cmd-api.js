import { createCommandInterface, tokenize } from 'hooman';
var wavLogger = require('../loggers/wav-logger');
var those = require('those');
var babble = require('babble');

module.exports = function(operator) {
    
    var hello = createCommandInterface({
        interpreter: function (cmd, tokens, bridge) {
            var pattern = /h[ae]llo|hi|hey|howdy/i;
            if (pattern.test(cmd)) {
                return {
                    cmd: this.interpret.translate,
                    args: [bridge],
                    certainty: 1.0,
                    request: null
                };
            }
            else {
                return false
            }
        },
        command: function (bridge) {
            bridge.done('text', 'Hi, how can i help you?');
        }
    });
    
    var whatsUp = createCommandInterface({
        interpreter: function (cmd, tokens, bridge) {
            var pattern = /(what|wut)[s]? up/i;
            if (pattern.test(cmd.replace(/'/, ''))) {
                return {
                    cmd: this.interpret.translate,
                    args: [bridge],
                    certainty: 1.0,
                    request: null
                };
            }
            else {
                return false
            }
        },
        command: function (bridge) {
            bridge.done('text', 'Just byting into life one chunk at a time.');
        }
    });
    
    var wavlog = createCommandInterface({
        interpreter: function (cmd, tokens, bridge) {
            var pattern = /wavlog/i;
            if (pattern.test(cmd.replace(/'/, ''))) {
                return {
                    cmd: this.interpret.translate,
                    args: [bridge],
                    certainty: 1.0,
                    request: null
                };
            }
            else {
                return false
            }
        },
        command: function (bridge) {
            var wavPath = 'D:\\prj_audio';
            wavLogger.getWavLogFolders(wavPath).then(wavLogger.getWavLogs).then(function (logs) {
               
               var pretty = true;
               if (pretty) {
                  var result = '';
                  those(logs).order('name').flip().forEach(function (log) {
                     var duration = babble.get('durations').parse(String(parseInt(log.duration, 10)) + ' sec');
                     result += log.name + " " + duration.tokens[0].value.toString('hm') + bridge.operator.newline;
                     log.items.forEach(function (item) {
                        var d = babble.get('durations').parse(String(parseInt(item.duration, 10)) + ' sec');
                        result += " - " + d.tokens[0].value.toString('hm') + ' @ ' + item.start + bridge.operator.newline;   
                     });
                     
                  });
                  bridge.done('text', result);
               }
               else { // raw
                  bridge.done('json', logs);   
               }
               
               //var log = those(logs).order('name').flip().first(); 
               //var duration = babble.get('durations').parse(String(parseInt(log.duration, 10)) + ' sec');
               
               //bridge.done('text', log.name + ' : ' + log.items[0].start + ' : ' + duration.tokens[0].value.toString(':'));
            });
        }
    });
    
    operator.registerCommand(hello);
    operator.registerCommand(whatsUp);
    operator.registerCommand(wavlog);

    /**
     * Handle a request from the client web prompt
     */
	operator.express.post('/_/cmd/*', function(req, res) {
	    /**
         * Set header to tell client that we're
         * sending json data in our response body
         */
		res.setHeader('Content-Type', 'application/json');

        // Set variables
		var cmd = req.body.cmd;
		var tokens = tokenize(cmd);
		var interpreterResponses = [];
		var bridge = operator.createBridge(req, res);

	    /**
         * Let all interpreters decide if they recognize this command
         * and add all interested responses to array
         */
		operator.commands.forEach(function (command) {
		    var interpreterResponse = command.interpret(cmd, tokens, bridge); 
		    if (interpreterResponse) {
		        interpreterResponses.push(interpreterResponse)
		    }
		});

		if (interpreterResponses.length === 0) {
		    /**
             * None of the command interpretors recognized this command
             */
		    bridge.fail('Pardon? My apologies, but i do not understand.');
		}
		else if (interpreterResponses.length === 1 && interpreterResponses[0].certainty === 1.0) {
		    /**
             * Only one interpreter recognized it and does not need
             * more input in order to respond to the request
             */
		    interpreterResponses[0].cmd.apply(null, interpreterResponses[0].args);
		}
		else {
		    // TODO: We have some figuring out to do
            console.log('Not sure what to do');
        }

	});
};
