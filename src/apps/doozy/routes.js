   
import React from 'react';
import fetch from '../../core/fetch';
import Action from './ui/action';
import Actions from './ui/actions';
import Comic from './ui/comic';
import strips from './ui/comic/strips';
import LogEntry from './ui/logentry';
import LogEntries from './ui/logentries';

async function getTags () {
   var tagsResponse = await fetch(`/graphql?query={tags{id,name,kind,descendantOf}}`);
   var tags = await tagsResponse.json();
   return tags.data.tags;
}

export const ActionRoute = {
   path: '/actions/:id',
   action: async (state) => {
      const response = await fetch(`/graphql?query={actions(id:"${state.params.id}"){id,name,tags{id,name,kind,descendantOf},kind,content,duration,lastPerformed}}`);
      const { data } = await response.json();
      state.context.onSetTitle('Action - ' + data.actions[0].name);
      return <Action model={data.actions[0]} />;
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

export const ComicRoute = {
   path: '/feeds/:id',
   action: async (state) => {
      state.context.onSetTitle(state.params.id);
      return <Comic content={strips[state.params.id]} />;
   }
};

export const ComicsRoute = {
   path: '/feeds',
   action: async (state) => {
      state.context.onSetTitle('Feeds');
      return <Comic index={strips} />;
   }
};

export const LogEntryRoute = {
   path: '/log(entrie)?s/:id',
   action: async (state) => {
      const response = await fetch(`/graphql?query={logentries(id:"${state.params.id}"){id,kind,date,details,duration,actions{id,name},tags{id,name,kind,descendantOf}}}`);
      const { data } = await response.json();
      state.context.onSetTitle('Log Entry - ' + data.logentries[0].date.split('T')[0]);
      return <LogEntry model={data.logentries[0]} />;
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
