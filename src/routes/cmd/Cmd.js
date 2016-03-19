/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './Cmd.scss';
import Prompt from './Prompt';
import Session from './Session';
import Toolbar from './Toolbar';

var requestStore = {
   getSessionIds: function () {
      return ['rando'];
   }
};

class Cmd extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         selectedSessionId: null,
         sessionIds: [],
         showProcesses: true,
         sidePanelWidth: 400
      };
   }

   calculateSize(showProcesses) {
      var size = {
         width: 800,
         height: 600
      };

      var sidePanelWidth = 400;
      var workspaceHeight = size.height - 75;

      if (requestStore.getSessionIds().length > 1 && showProcesses) {
         if (size.width < sidePanelWidth * 2) {
            sidePanelWidth = size.width - sidePanelWidth;
         }
      }
      else {
         sidePanelWidth = 0;
      }

      return {
         sidePanelWidth: sidePanelWidth,
         workspaceWidth: size.width - sidePanelWidth,
         workspaceHeight: workspaceHeight
      };
   }
   
   // <div style={{ display: 'flex' }}>
   //    <div className={styles.scroll} key="mainworkspace" style={{ flexGrow: '1', margin: '0 10px', maxWidth: String(size.workspaceWidth) + 'px', height: size.workspaceHeight + 'px', overflowY: 'auto' }} >
   //       <Session sessionId={sessionId} selected />
   //    </div>
   // </div>
   renderSingleSession(size, sessionId) {
      return (
         <div>
            <Toolbar key="toolbar" showProcesses={this.state.showProcesses} onClickProcesses={this.handleClickProcesses} onClickNewSession={this.handleClickNewSession}>
               <Prompt sessionId={sessionId} />
            </Toolbar>
            
         </div>
      );
   }

   render() {

      var size = this.calculateSize(this.state.showProcesses);
      var sessionIds = requestStore.getSessionIds();

      return (
         this.renderSingleSession(size, sessionIds[0])
      );
   }
}

Cmd.propTypes = { title: PropTypes.string.isRequired };

export default withStyles(Cmd, styles);
