import { GraphQLList as List, GraphQLString } from 'graphql';
import fetch from '../../../core/fetch';
import LogEntryType from './types/LogEntryType';
import Promise from 'bluebird';
import {get, getAll} from './core';
import those from 'those';

let lastFetchTask;

module.exports = function (operator) {
   return {
      type: new List(LogEntryType),
      args: {
         id: { type: GraphQLString },
         tags: { type: new List(GraphQLString) }
      },
      resolve(_, args) {
         
         if (args && args.id) {
            // Array filtered to single action
            return new Promise(function (resolve, reject) {
               
               var logentry = get(operator, args.id, 'doozy.logentry');
               if (logentry) {
                  logentry = [logentry];
               }
               resolve(logentry);
            });
         }
         else {
            if (lastFetchTask) {
               return lastFetchTask;
            }
            
            lastFetchTask = new Promise(function (resolve, reject) {
               var logentries = getAll(operator, 'doozy.logentry');
               
               if (args && args.tags) {
                  those(logentries).where(function (logentry) {
                     if (logentry.tags.length) {
                        return those(logentry.tags).pluck('id').hasAny(args.tags);
                     }
                     return false;
                  });
               }
               
               resolve(logentries);
            })
            .finally(() => {
               lastFetchTask = null;
            });

            return lastFetchTask;
         }
      }

   };
   
};
