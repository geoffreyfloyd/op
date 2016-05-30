/**
 * @module gnode-store
 * @description Store for gathering, storing, and distributing gnode objects to
 *              client components.
 */

import ContextStore from './context-store';
import http from '../../../core/http';
import Promise from 'bluebird';

/* global $ */
/**
 * Cache & Local Storage
 * :: This is shared by all instances of GnodeStore
 */
var baseUrl = '';
var cache = {};

var _cacheApi = {

    destroy: function (storeName, id, persist = true) {
        var result = false;
        for (var i = 0; i < cache[storeName].gnodes.length; i++) {
            if (cache[storeName].gnodes[i].id === id) {
                cache[storeName].gnodes.splice(i, 1);
                result = true;
                break;
            }
        }
        
        // persist now
        if (persist && result) {
            _cacheApi.save();
        }

        return result;
    },

    /**
     * Update the cache with the new value.
     * @param storeName {string} The type of gnode
     * @param value {object} The gnode object
     * @param persist {bool} Write to local storage
     */
    update: function (storeName, value, persist = true) {
        var i;

        if (Object.prototype.toString.call(value) === '[object Array]') {
            // Value is an array of gnodes, recursively call this method
            // for each individual gnode
            for (i = 0; i < value.length; i++) {
                // Recursive call to add/update this gnode
                _cacheApi.update(storeName, value[i], false);
                // Get the latest last changed value
                // from the gnodes in the array
                if (value[i].lastChanged > cache[storeName].lastChanged) {
                    cache[storeName].lastChanged = value[i].lastChanged;
                }
                // Get the version value
                // from the gnodes in the array
                if (value[i].version > cache[storeName].version) {
                    cache[storeName].version = value[i].version;
                }
            }
        }
        else {
            // Value is a single gnode
            var exists = false;
            for (i = 0; i < cache[storeName].gnodes.length; i++) {
                if (cache[storeName].gnodes[i].id === value.id) {
                    // Entity exists in cache, replace with newer
                    cache[storeName].gnodes.splice(i, 1, value);
                    exists = true;
                    break;
                }
            }

            // Entity does not exist in cache, add to the collection
            if (!exists) {
                cache[storeName].gnodes.push(value);
            }
        }

        // persist now
        if (persist) {
            _cacheApi.save();
        }
    },

    /**
     * Save the local cache of gnodes to local storage using an
     * encryption key unique to the user.
     */
    save: function () {
        // DISABLE PERSISTENT CACHE UNTIL IT CAN BE STABILIZED
        // hlio.saveLocal('gnodeCache', cache, 'k001k4t');
    },

    /**
     * Load the cache from local storage. Only one user's gnodes are stored,
     * so if the user has changed (and thus the encryption key has changed)
     * then the cache will be set to an empty object.
     */
    init: function () {
        // DISABLE PERSISTENT CACHE UNTIL IT CAN BE STABALIZED
        // cache = hlio.loadLocal('gnodeCache', 'k001k4t');
        // if (cache === undefined || typeof cache === 'string' || cache === null) {
        cache = {};
        // }
    },

    /**
     * Retrieve gnode object from local cache, or null if the gnode is
     * not found
     * @param storeName {string} The type of gnode
     * @param id {int, string} The id of the gnode
     * @return Gnode object of matching id, or null if not found
     */
    getGnode: function (storeName, id) {
        for (var i = 0; i < cache[storeName].gnodes.length; i++) {
            if (cache[storeName].gnodes[i].id === id) {
                return cache[storeName].gnodes[i];
            }
        }
        return null;
    }
};

/**
 * GnodeStore Class
 */
class GnodeStore extends ContextStore {
    
    constructor (storeName) {
        // Call base class constructor
        super();

        // Initialize gnode type in cache
        if (typeof cache[storeName] === 'undefined') {
            cache[storeName] = {
                gnodes: [],
                lastPull: '1900-01-01T00:00:00.000Z',
                version: 0
            };
        }

        // Field level variables
        this.storeName = storeName;
        this.retry = 5;

        /***********************************************************************
         * REST API
         **********************************************************************/
         
        var me = this;
        this._api = {
            post: function (state) {
                return http(baseUrl + '/api/' + me.storeName.toLowerCase()).post().withCreds().withJsonBody(state).requestJson();
            },
            put: function (state) {
                return http(baseUrl + '/api/' + me.storeName.toLowerCase()).put().withCreds().withJsonBody(state).requestJson();
            },
            destroy: function (id) {
                return http(baseUrl + '/api/' + me.storeName.toLowerCase() + '/' + id, {method: 'DELETE'}).withCreds().requestJson();
            }
        };
    }
    
    /***********************************************************************
     * CONTEXT STORE CALLBACKS
     **********************************************************************/
    isCacheValid () {
        return false; // override in store implementation
    }

    onSubscribe (context) {
        if (context.args.hasOwnProperty('id')) {
            // Get gnode from cache and update value / subscribers
            var gnode = _cacheApi.getGnode(this.storeName, context.args.id);
            if (gnode !== null) {
                this.updateContext(gnode, context.args);
            }

            if (gnode === null || !this.isCacheValid(gnode)) {
                // Check for update to this gnode
                this.getLatestVersion(null, context.args.id);
            }
        }
        else {

            // Get gnode from cache and update value / subscribers
            if (cache[this.storeName].gnodes.length > 0) {
                this.updateContext(cache[this.storeName].gnodes, {});
            }

            // Check for updates to the list of gnodes
            context.isUpdating = true;
            _api.get().then(function (result) {
                context.isUpdating = false;

                // Update the cache with result
                _cacheApi.update(this.storeName, result);

                // Update context value and notify subscribers
                this.updateContext(cache[this.storeName].gnodes, {});

            }).catch(function (err) {
                console.log(err);
            });
        }
    }

    

    /**
     * Store Methods
     */
    getLatestVersion (value, id) {
        this._api.get(id)
        .then(function (result) {

            // Reset retry interval to 5 seconds
            // on a successful call
            this.retry = 5;

            // Returns null when no update is available
            // based on the latest update
            if (result === null) {
                return;
            }

            // Update the local stash of gnodes
            _cacheApi.update(this.storeName, result);

            // if a specific context exists for this id
            // then update the value and notify subscribers
            this.updateContext(result, {id: id});

            // Update the global context
            this.updateContext(cache[this.storeName].gnodes, {});
        })
        .catch(function (err) {
            console.log(err);

            // If we got an error and have null, try again in 5 seconds
            console.log(this.storeName + ' store got an error response from the server, trying again in ' + this.retry + ' seconds...');
            setTimeout(function () {
                this.getLatestVersion(value, id);
            }.bind(this), this.retry * 1000);
            this.retry += 5;
        });
    }

    create (model, then, fail) {
        // TODO: Optimistic Concurrency Strategy
        // No one is going to be subscribed to this id yet
        // this.updateContext(model, {id: id}); // id isn't valid yet

        // Notify subscribers to ALL that a new node has been added
        // this.updateContext(cache[this.storeName].gnodes, {}); // id isn't valid yet

        this._api.post(model)
        .then(function (serverModel) {

            // Update the local stash of gnodes
            _cacheApi.update(this.storeName, serverModel);

            // if a specific context exists for this id
            // then update the value and notify subscribers
            // this.updateContext(serverModel, {id: serverModel.id});

            // Update the global context
            this.updateContext(cache[this.storeName].gnodes, {});

            if (then) {
                then(serverModel);
            }
            // MessageBox.notify('Added plan ' + model.name, 'success');
        }.bind(this))
        .catch( function (err) {
            // TODO: Undo optimistic concurrency and notify subscribers
            // MessageBox.notify(err.responseText, 'error');
            console.log(err);
            if (fail) {
                fail(err);
            }
        });
    }

    destroy (id, then, fail) {
        this._api.destroy(id)
        .then(function () {
            // Update the local stash of gnodes
            _cacheApi.destroy(this.storeName, id);

            // if a specific context exists for this id
            // then update the value and notify subscribers
            this.updateContext(null, {id: id});

            // Update the global context
            this.updateContext(cache[this.storeName].gnodes, {});

            if (then) {
                then();
            }
            // MessageBox.notify('Deleted plan ' + id, 'success');
        }.bind(this))
        .catch( function (err) {
            // TODO: Undo optimistic concurrency and notify subscribers
            // MessageBox.notify(err.responseText, 'error');
            console.log(err);
            if (fail) {
                fail(err);
            }
        });
    }

    get (id, then, fail) {
        var gnode = _cacheApi.getGnode(this.storeName, id);
        if (!gnode) {
            this._api.get(id)
            .then(function (result) {
                if (then) {
                    then(result);
                }
            })
            .catch(function (err) {
                if (fail) {
                    fail(err);
                }
            });
        }
        return gnode;
    }

    getCache () {
        return cache[this.storeName].gnodes ? cache[this.storeName].gnodes.slice() : [];
    }

    update (model, then, fail) {
        this._api.put(model)
        .then(function (serverModel) {
            console.log(serverModel);
            // Update the local stash of gnodes
            _cacheApi.update(this.storeName, serverModel);

            // if a specific context exists for this id
            // then update the value and notify subscribers
            this.updateContext(serverModel, {id: serverModel.id});

            // Update the global context
            this.updateContext(cache[this.storeName].gnodes, {});

            if (then) {
                then(serverModel);
            }
        }.bind(this))
        .catch(function (err) {
            // TODO: Undo optimistic concurrency and notify subscribers
            console.log(err);
            // MessageBox.notify(err.responseText, 'error');
            if (fail) {
                fail(err);
            }
        });
    }
};

_cacheApi.init();
if (global.window) {
    baseUrl = window.location.href.split('/').slice(0,3).join('/') + '/gnidbits';
}

module.exports = GnodeStore;
