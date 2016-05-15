import GnodeStore from './gnode-store';
import those from 'those';

class ActionStore extends GnodeStore {
    constructor () {
        super('Action');
    }
    
    cleanActionName (name) {
        return name.replace(/:/g, '').replace(/  /g, ' ').trim().toLowerCase(); // eslint-disable-line no-regex-spaces
    }

    getActionByName (name) {
        var existingAction = those(actionStore.context({}).value).first(function (item) {
            return cleanActionName(item.name) === cleanActionName(name.toLowerCase());
        });
        return existingAction;
    }
}

// Export instance
var singleton = new ActionStore();
export default singleton;
