import Promise from 'bluebird';
import those from 'those';

export function removePrefix (tag) {
   if (doozy.TAG_PREFIXES.indexOf(tag.slice(0, 1)) === -1) {
         return tag;
   }
   else {
         return tag.slice(1);
   }
};

var baseModel = function (gnode) {
   if (gnode) {
         return {
            id: gnode.tag,
            version: gnode.version,
            isNew: false
         };
   }
   else {
         return null;
   }
};

var getModel = function (gnode, db, kind) {
   var model = null;
   if (gnode) {
      // Strap the model if this kind has one
      var strap = modelStraps[kind];
      if (strap) {
         strap = strap(gnode, db);
      }

      // Merge state and calc into model
      model = Object.assign({}, gnode.state, strap, baseModel(gnode));

   }
   return model;
};

var modelProps = {
   action: ['id', 'version', 'isNew', 'lastPerformed', 'tags'],
   logentry: ['id', 'version', 'isNew','actions','tags'],
   plan: ['id', 'version', 'isNew'],
   planstep: ['id', 'version', 'isNew','planId','parentId'],
   tag: ['id', 'version', 'isNew', 'descendantOf'],
   target: ['id', 'version', 'isNew']
};

var modelStraps = {
   action: function (gnode, db) {
         var strap = {};

         /**
          * defaults
            */
         strap.recurrenceRules = gnode.state.recurrenceRules || [];

         /**
          * calculations
            */
         // calc tags data
         var tags = [];
         gnode.siblings('doozy.tag').forEach(function (gnapse) {
            tags.push(getModel(gnapse.getTarget(), db, 'tag'));
         });
         strap.tags = tags;

         // calc latest logentry
         var lastPerformed = null;
         gnode.siblings('doozy.logentry').forEach(function (gnapse) {
            if (gnapse.target.state.entry === 'performed' && (!lastPerformed || lastPerformed < gnapse.target.state.date)) {
               lastPerformed = gnapse.target.state.date;
            }
         });

         strap.lastPerformed = lastPerformed;

         return strap;
   },
   logentry: function (gnode, db) {
         var strap = {};

         // calc tags data
         var actions = [];
         var tags = [];
         
         // Add direct tags
         gnode.siblings('doozy.tag').forEach(function (tagGnapse) {
            var tagGnode = tagGnapse.getTarget()
            if (tagGnode) {
               tags.push(getModel(tagGnode, db, 'tag'));
            }
            else {
               console.log('Orphaned gnapse!');
            }
         });
         
         // Add actions
         var actionGnapses = gnode.siblings('doozy.action').forEach(function (actionGnapse) {
            
            var actionGnode = actionGnapse.getTarget();
            if (actionGnode) {
               // Get model from gnode
               var action = getModel(actionGnode, db, 'action');
               
               // Add action
               actions.push(action);

               // Add action's tags to list of logentry tags
               action.tags.forEach(function (tag) {
                  if (!those(tags).has(tag)) {
                     tags.push(tag);
                  }
               });
            }
            else {
               console.log('Orphaned gnapse!');
            }
         });
         
         // Massage date
         strap.date = gnode.state.date.split('T')[0];
         
         // return the model strap
         strap.actions = actions;
         strap.tags = tags;
         strap.kind = gnode.state.entry;
         return strap;
   },
   planstep: function (gnode, db) {
         var strap = {};
         // Get plan (may be parent or associate)
         var plan = gnode.related('doozy.plan').first();
         if (plan) {
            strap.planId = plan.target.tag;
         }
         // Get parent planstep (if not root)
         var parent = gnode.parents('doozy.planstep').first();
         if (parent && parent.target.kind === 'doozy.planstep') {
            strap.parentId = parent.target.tag;
         }
         else {
            strap.parentId = null;
         }
         return strap;
   },
   tag: function (gnode, db) {
         var strap = {};
         // calc tags data
         var tags = [];
         var getAllParents = function (gnapse) {
            var tagGnode = gnapse.getTarget();
            if (tagGnode) {
               tags.push(tagGnode.tag);
               tagGnode.parents('doozy.tag').forEach(getAllParents);
            }
         };
         gnode.parents('doozy.tag').forEach(getAllParents);
         strap.descendantOf = tags;
         return strap;
   }
}

var stripModel = function (model, stripOut) {
   var state = {};
   for (var prop in model) {
         // Only copy over if the propery isn't in list of ones to strip out
         if (model.hasOwnProperty(prop) && stripOut.indexOf(prop) === -1) {
            state[prop] = model[prop];
         }
   }
   return state;
};

export async function getAll (operator, kind) {
   var result = [];
   await operator.getDb(function (db) {
      db.allOf('doozy.' + kind).forEach(function (gnode) {
         var model = getModel(gnode, db, kind);
         result.push(model);
      });
   });
   return result;
};

export async function get (operator, id, kind) {
   var result;
   await operator.getDb(function (db) {
      var gnode = db.get('doozy.' + kind + '.' + id);
      if (gnode) {
         var model = getModel(gnode, db, kind);
         result = model;
      }
      else {
         result = null;
      }
   });
   return result;
};

export function create (operator, kind, model, createConnections, generateTag) {
   return new Promise(function (resolve) {
      operator.getDb(function (db) {
         var name;
         if (generateTag && typeof generateTag === 'function') {
            name = generateTag(gnode, db, model);
         }
         else {
            name = model[(generateTag || 'name')];
         }

         // Strip model to state and create new node from it
         var gnode = new db.Gnode(db, name, 'doozy.' + kind, stripModel(model, modelProps[kind]));

         // Add node to db
         db.add(gnode);

         // Create connections callback
         if (createConnections) {
            createConnections(gnode, db, model);
         }

         // Commit new node
         db.commitChanges();

         // refresh the model
         model = getModel(gnode, db, kind);

         resolve(model);   
      });
   });
};

export function update (operator, kind, model, updateConnections) {
   return new Promise(function (resolve) {
      operator.getDb(function (db) {
         // Get gnode from db
         var gnode = db.find(model.id, 'doozy.' + kind).first();
         if (gnode) {

            // Strip model to state and update existing gnode's state
            gnode.setState(stripModel(model, modelProps[kind]));

            // Update connections callback
            if (updateConnections) {
               updateConnections(gnode, db, model);
            }

            // Commit the updated gnode state
            db.commitChanges();

            // refresh the model
            model = getModel(gnode, db, kind);

            // Send refreshed model
            resolve(model)
         }
      });
});
};

export function remove (operator, kind, id, beforeRemove) {
   return new Promise(function (resolve) {
      operator.getDb(function (db) {
         var gnode = db.find(id, 'doozy.' + kind).first();
         if (gnode) {
            if (beforeRemove) {
               beforeRemove(gnode, db);
            }
            db.remove(gnode);
            db.commitChanges();
            resolve({error: null});
         }
         else {
            resolve({error: 'Gnode not found'});
         }
      });
   });
};