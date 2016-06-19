
import React from 'react';
import fetch from '../../core/fetch';
import Bit from './ui/bit';
import Comic from './ui/comic';
//import strips from './ui/comic/strips';

async function getTags () {
   var tagsResponse = await fetch(`/graphql?query={tags{id,name,kind,descendantOf}}`);
   var tags = await tagsResponse.json();
   return tags.data.tags;
}

var emptyBit = { id: '', caption: '', videos: [], images: [], notes: [], texts: [], tags: [] };

export const BitRoute = {
   path: '/bits/:id',
   action: async (state) => {
      // Get optional param
      const id = state.params.id || '';

      // Get Data
      const response = await fetch(`/graphql?query={bits(id:"${id}"){id,caption,images{src},notes{note},texts{text},videos{src,start,end},tags{id,name,kind,descendantOf}},tags{id,name,kind,descendantOf}}`);
      const { data } = await response.json();

      // Set Title
      state.context.onSetTitle('Manage Bit');
      
      return <Bit model={data.bits[0] || emptyBit} tags={data.tags} />;
   }
};

export const BitsRoute = {
   path: '/bits',
   action: async (state) => {
      // Get Data
      const response = await fetch(`/graphql?query={bits{id,caption,images{src},notes{note},texts{text},videos{src,start,end},tags{id,name,kind,descendantOf}},tags{id,name,kind,descendantOf}}`);
      const { data } = await response.json();
      
      // Set Title
      state.context.onSetTitle('Bits');
      
      return <Comic content={data.bits} tags={data.tags} />;
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
     
      // Get Data
      const id = state.params.id || '';
      const response = await fetch(`/graphql?query={strips(id:"${id}"){id,bits{id,caption,images{src},texts{text},videos{src,start,end},tags{id,name,kind,descendantOf}},tags{id,name,kind,descendantOf}},tags{id,name,kind,descendantOf}}`);
      const { data } = await response.json();
      
      // return <Comic {...props} />;
      return <Comic content={data.strips[0].bits} tags={data.tags} />;
   }
};
