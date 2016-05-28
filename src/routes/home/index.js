/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Home from './Links';
import fetch from '../../core/fetch';

export const path = '/';
export const action = async (state) => {
   // const response = await fetch('/graphql?query={news{title,link,contentSnippet}}');
   // const { data } = await response.json();
   
   var links = [
      {
         title: 'Cmd Prompt',
         link: '/cmd'
      },
      {
         title: 'Feeds',
         link: '/feeds'
      },
      {
         title: 'Actions',
         link: '/actions'
      },
      {
         title: 'Logs',
         link: '/logs'
      },
   ];
   state.context.onSetTitle('HoomanLogic Home');
   return <Home links={links} />;
};
