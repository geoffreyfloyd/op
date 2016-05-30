import React from 'react';
import {create, get, getAll, remove, removePrefix, update} from '../../../data/queries/core';
import those from 'those';

/**
 * Set the context for data access
 */
module.exports = function (operator) {

   /*****************************************************
   * BITS
   ****************************************************/
   operator.express.get('/gnidbits/api/bit', operator.authenticate, operator.jsonResponse, function (req, res) {
      getAll(operator, 'gnidbits.bit').then(function (result) {
         res.end(JSON.stringify(result));
      });
   });
   
   operator.express.get('/gnidbits/api/bit/:id', operator.authenticate, operator.jsonResponse, function (req, res) {
      get(operator, req.params.id, 'gnidbits.bit').then(function (result) {
         res.end(JSON.stringify(result));
      });
   });

   operator.express.post('/gnidbits/api/bit', operator.authenticate, operator.jsonResponse, function (req, res) {
      create(operator, 'gnidbits.bit', req.body, function (gnode, db, model) {
            // Create tag connections
            if (model.tags && model.tags.length) {
               model.tags.forEach(function (tag) {
                  var tagNode = db.find(removePrefix(tag), 'tag').first();
                  if (tagNode) {
                        gnode.connect(tagNode, db.RELATION.ASSOCIATE);
                  }
               });
            }
      }, 'slug').then(function (result) {
         res.end(JSON.stringify(result));
      });
   });

   operator.express.put('/gnidbits/api/bit', operator.authenticate, operator.jsonResponse, function (req, res) {
      update(operator, 'gnidbits.bit', req.body, function (gnode, db, model) {
            // remove old connections
            var removeConnections = [];
            gnode.related('tag').forEach(function (tagGnapse) {
               var isInState = false
               if (model.tags && model.tags.length) {
                  for (var i = 0; i < model.tags.length; i++) {
                        var thisTagName = typeof model.tags[i] === 'string' ? model.tags[i] : model.tags[i].name;
                        
                        if (thisTagName === tagGnapse.getTarget().tag) {
                           isInState = true;
                           break;
                        }
                  }
               }
               if (!isInState) {
                  removeConnections.push(tagGnapse);
               }
            });

            // Remove tags
            removeConnections.forEach(function (gnapse) {
               gnode.disconnect(gnapse); 
            });

            // Create tag connections
            if (model.tags && model.tags.length) {
               model.tags.forEach(function (tag) {
                  var exists, tagNode, tagName;
                  if (typeof tag === 'string') {
                        tagName = tag;
                  }
                  else {
                        tagName = tag.name;
                  }
                  exists = those(gnode.related('tag').map(function (gnapse) { return gnapse.getTarget().state; })).first({ name: tagName });
                  tagNode = db.find(tagName, 'tag').first(); 
                  if (!exists && tagNode) {
                        gnode.connect(tagNode, db.RELATION.ASSOCIATE);
                  }
               });
            }
      }).then(function (result) {
         res.end(JSON.stringify(result));
      });
   });

   operator.express.delete('/gnidbits/api/bit/:id', operator.authenticate, operator.jsonResponse, function (req, res) {
      remove(operator, 'gnidbits.bit', req.params.id).then(function (result) {
         res.end(JSON.stringify(result));
      });
   });
};
