import React from 'react';
import focusTags from '../focus-tags';
import LogEntryList from '../../components/LogEntryList';

export default class LogEntries extends React.Component {
   /*************************************************************
    * RENDERING
    *************************************************************/
   render() {
      const {list} = this.props;
      return (
         <LogEntryList logentries={list} />
      );
   }
}

export default focusTags(LogEntries);
