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
import requestStore from '../../stores/request-store';
import windowSizeStore from '../../stores/window-size-store';

class Cmd extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         selectedSessionId: requestStore.new(),
         sessionIds: [],
         showProcesses: true,
         sidePanelWidth: 400
      };
   }

   componentDidMount() {
      windowSizeStore.subscribe(this.handleStoreUpdate);
      requestStore.subscribe(this.handleStoreUpdate.bind(this), null);
   }

   componentWillUnmount() {
      windowSizeStore.unsubscribe(this.handleStoreUpdate);
      requestStore.unsubscribe(this.handleStoreUpdate.bind(this), null);
   }

   /*************************************************************
    * EVENT HANDLING
    *************************************************************/
   handleStoreUpdate() {
      var selectedSessionId = this.state.selectedSessionId;
      if (requestStore.getRequests(selectedSessionId).length === 0) {
         var sessionIds = requestStore.getSessionIds();
         if (sessionIds.length > 0) {
            this.setState({
               ts: (new Date()).toISOString(),
               selectedSessionId: sessionIds[0]
            });
            return;
         }
      }

      this.setState({
         ts: (new Date()).toISOString()
      });
   }

   handleClickProcesses() {
      var state = Object.assign({
         showProcesses: !this.state.showProcesses
      }, this.calculateSize(!this.state.showProcesses));
      this.setState(state);
   }

   handleClickNewSession() {
      requestStore.new();
   }

   handleSelectSession(sessionId) {
      this.setState({
         selectedSessionId: sessionId
      });
   }

   /*************************************************************
    * HELPERS
    *************************************************************/
   calculateSize(showProcesses) {
      var size = windowSizeStore.updates.value;

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

   /*************************************************************
    * RENDERING
    *************************************************************/
   renderMultiSession(sessionIds, size) {

      var selectedSessionId = this.state.selectedSessionId;

      if (selectedSessionId === null) {
         selectedSessionId = sessionIds[0];
      }

      var otherSessionIds = [];

      sessionIds.map(function(sessionId) {
         if (sessionId !== selectedSessionId) {
            otherSessionIds.push(sessionId);
         }
      });

      var sideSessions;
      if (this.state.showProcesses) {
         sideSessions = (
            <div className={styles.scroll} key="sideSessions" style={{ height: size.workspaceHeight + 'px', overflowY: 'auto', width: String(size.sidePanelWidth) + 'px', margin: '0 10px 0 0' }}>
               {otherSessionIds.map(function(sessionId) {
                  return (<Session key={sessionId} sessionId={sessionId} className={styles.scroll} style={{ maxHeight: '600px', overflowY: 'auto' }} onSelect={this.handleSelectSession.bind(this) } />);
               }.bind(this)) }
            </div>
         );
      }

      return (
         <div>
            <Toolbar key="toolbar" showProcesses={this.state.showProcesses} onClickProcesses={this.handleClickProcesses.bind(this) } onClickNewSession={this.handleClickNewSession.bind(this) }>
               <Prompt sessionId={selectedSessionId} />
            </Toolbar>
            <div style={{ display: 'flex' }}>
               <div className={styles.scroll} key="mainworkspace" style={{ flexGrow: '1', margin: '0 10px', maxWidth: String(size.workspaceWidth) + 'px', height: size.workspaceHeight + 'px', overflowY: 'auto' }} >
                  <Session sessionId={selectedSessionId} selected />
               </div>
               {sideSessions}
            </div>
         </div>
      );
   }

   renderSingleSession(sessionId, size) {
      return (
         <div>
            <Toolbar key="toolbar" showProcesses={false} onClickProcesses={this.handleClickProcesses.bind(this) } onClickNewSession={this.handleClickNewSession.bind(this) }>
               <Prompt sessionId={sessionId} />
            </Toolbar>
            <div className={styles.scroll} key="mainworkspace" style={{ margin: '0 10px 10px', height: size.workspaceHeight + 'px', overflowY: 'auto' }}>
               <Session sessionId={sessionId} selected />
            </div>
         </div>
      );
   }

   render() {

      var size = this.calculateSize(this.state.showProcesses);
      var sessionIds = requestStore.getSessionIds();

      if (sessionIds.length === 0) {
         return null;
      }
      else if (sessionIds.length === 1) {
         return this.renderSingleSession(sessionIds[0], size);
      }
      else {
         return this.renderMultiSession(sessionIds, size);
      }
   }
}

Cmd.propTypes = { title: PropTypes.string.isRequired };

export default withStyles(Cmd, styles);
