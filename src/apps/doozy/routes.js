   
import React from 'react';
import fetch from '../../core/fetch';
import Action from './ui/action';
import Actions from './ui/actions';
import LogEntry from './ui/logentry';
import LogEntries from './ui/logentries';

var emptyAction = function () {
   return {
      isNew: true,
      id: '',
      kind: 'Action',
      name: '',
      created: (new Date()).toISOString(),
      duration: 0,
      content: null,
      beginDate: null,
      nextDate: null,
      isPublic: false,
      lastPerformed: null,
      tags: [],
      recurrenceRules: [],
      items: []
   };
};

var emptyLog = function () {
   return {
      isNew: true,
      id: '',
      actionId: null,
      rootActionId: null,
      actionName: '',
      duration: 0,
      date: (new Date()).toISOString(),
      details: '',
      entry: 'performed',
      tags: []
   };
};


async function getTags () {
   var tagsResponse = await fetch(`/graphql?query={tags{id,name,kind,descendantOf}}`);
   var tags = await tagsResponse.json();
   return tags.data.tags;
}

export const ActionRoute = {
   path: '/actions/:id',
   action: async (state) => {
      const response = await fetch(`/graphql?query={actions(id:"${state.params.id}"){id,name,tags{id,name,kind,descendantOf},kind,content,duration,lastPerformed},tags{id,name,kind,descendantOf}}`);
      const { data } = await response.json();
      var model = data.actions[0] || emptyAction();
      state.context.onSetTitle('Action - ' + model.name);
      return <Action model={model} tags={data.tags} />;
   }
};

export const ActionsRoute = {
   path: '/actions',
   action: async (state) => {
      // Get optional param
      const id = state.params.id || '';
      
      // Get Actions
      const response = await fetch(`/graphql?query={actions(id:"${id}"){id,name,tags{id,name,kind,descendantOf},lastPerformed}}`);
      const { data } = await response.json();
      
      // Get Tags
      var tags = await getTags();
      
      state.context.onSetTitle('Actions');
      return <Actions list={data.actions} tags={tags} />;
   }
};

export const LogEntryRoute = {
   path: '/log(entrie)?s/:id',
   action: async (state) => {
      const response = await fetch(`/graphql?query={logentries(id:"${state.params.id}"){id,kind,date,details,duration,actions{id,name},tags{id,name,kind,descendantOf}},tags{id,name,kind,descendantOf}}`);
      const { data } = await response.json();
      var model = data.logentries[0] || emptyLog();
      state.context.onSetTitle('Log Entry - ' + model.date.split('T')[0]);
      return <LogEntry model={model} tags={data.tags} />;
   }
};

export const LogEntriesRoute = {
   path: '/log(entrie)?s',
   action: async (state) => {
      // Get optional param
      // var id = state.params.id || '';
      
      // Get Log Entries
      var logsResponse = await fetch(`/graphql?query={logentries{id,kind,date,details,duration,actions{id,name},tags{id,name,kind,descendantOf}}}`);
      var logentries = await logsResponse.json();
      logentries = logentries.data.logentries;
      
      // Get Tags
      var tags = await getTags();
      
      state.context.onSetTitle('Log Entries');
      return <LogEntries list={logentries} tags={tags} />;
   }
};
