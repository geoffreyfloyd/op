
import React from 'react';
import fetch from '../../core/fetch';
import Comic from './ui/comic';
//import strips from './ui/comic/strips';

async function getTags () {
   var tagsResponse = await fetch(`/graphql?query={tags{id,name,kind,descendantOf}}`);
   var tags = await tagsResponse.json();
   return tags.data.tags;
}

export const BitRoute = {
   path: '/bits/:id',
   action: async (state) => {
      // Get optional param
      const id = state.params.id || '';

      // Get Bit
      const response = await fetch(`/graphql?query={bits(id:"${id}"){id,caption,images{src},texts{text},videos{src,start,end},tags{id,name,kind,descendantOf}}}`);
      const { data } = await response.json();
      
      // Get Tags
      var tags = await getTags();
      
      // Set Title
      state.context.onSetTitle('Bits');
      
      return <Comic content={data.bits} tags={tags} />;
   }
};

export const BitsRoute = {
   path: '/bits',
   action: async (state) => {
      // Get Bits
      const response = await fetch(`/graphql?query={bits{id,caption,images{src},texts{text},videos{src,start,end},tags{id,name,kind,descendantOf}}}`);
      const { data } = await response.json();
      
      // Get Tags
      var tags = await getTags();
      
      // Set Title
      state.context.onSetTitle('Bits');
      
      return <Comic content={data.bits} tags={tags} />;
   }
};

export const StripRoute = {
   path: '/strips/:id',
   action: async (state) => {
      state.context.onSetTitle(state.params.id);
      
      // var content = strips[state.params.id];
      // var props = {};
      // if (!content) {
      //    props.index = strips;
      // }
      // else {
      //    props.content = content;
      // }
     
      // Get Strip
      const id = state.params.id || '';
      const response = await fetch(`/graphql?query={strips(id:"${id}"){id,bits{id,caption,images{src},texts{text},videos{src,start,end},tags{id,name,kind,descendantOf}},tags{id,name,kind,descendantOf}}}`);
      const { data } = await response.json();
      
      // Get Tags
      var tags = await getTags();
      
      
      // return <Comic {...props} />;
      return <Comic content={data.strips[0].bits} tags={tags} />;
   }
};
