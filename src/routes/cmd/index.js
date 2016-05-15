/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Cmd from './Cmd';

export const path = '/cmd';
export const action = async (state) => {
   const title = 'Command Prompt';
   state.context.onSetTitle(title);
   return <Cmd title={title} />;
};
