import React from 'react';
import focusTags from '../focus-tags';
import ActionList from '../../components/action-list';
import those from 'those';

class Actions extends React.Component {
   /*************************************************************
    * RENDERING
    *************************************************************/
   render () {
      var {list} = this.props;
      list = those(list).order('name').slice();
      return (
         <ActionList actions={list} />
      );
   }        
}

export default focusTags(Actions);
