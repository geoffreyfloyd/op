import GnodeStore from './gnode-store';
import those from 'those';

class BitStore extends GnodeStore {
    constructor () {
        super('Bit');
    }
    
    save (model) {
        if (model.key) {
            this.update(model);
        }
        else {
            model.slug = global.window.location.href.split('/').slice(-1)[0];
            this.create(model);
        }
    }
}

// Export instance
var singleton = new BitStore();
export default singleton;
