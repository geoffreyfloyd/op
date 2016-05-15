import GnodeStore from './gnode-store';
import actionStore from './action-store';
import doozy from '../doozy';

class LogEntryStore extends GnodeStore {

    constructor () {
        super('LogEntry');
    };

    save (logEntry, done, fail) {
        var existingAction, newAction;
        if (logEntry.actionName && logEntry.actionName.length) {
            existingAction = actionStore.get(logEntry.actionName);
            if (existingAction) {
                logEntry.actionId = existingAction.id;
            }
            else {
                newAction = doozy.action(logEntry.actionName);
                newAction.created = this.state.date;
            }
        }

        // update log entry
        if (!newAction) {
            if (logEntry.isNew) {
                this.create(logEntry, done, fail);
            }
            else {
                this.update(logEntry, done, fail);
            }
        }
        else {
            // Create action first
            actionStore.create(newAction, function (serverAction) {
                logEntry.actionId = serverAction.id;
                // Then Create logentry that references action
                if (logEntry.isNew) {
                    this.create(logEntry, done, fail);
                }
                else {
                    this.update(logEntry, done, fail);
                }
            });
        }
    }
}

// Export instance
var singleton = new LogEntryStore();
export default singleton;
