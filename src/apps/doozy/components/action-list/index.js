import React from 'react';
import ActionListItem from './action-list-item';

export default class ActionList extends React.Component {
   /*************************************************************
   * RENDERING
   *************************************************************/
   render () {
      var {actions} = this.props;
      if (!actions) {
         actions = [];
      }
      return (
         <table {...this.props} className="table table-striped">
            <tbody>
               {actions.map(function (action) {
                  return (
                     <ActionListItem key={action.id} {...action} />
                  );
               })}
            </tbody>
         </table>
      );
   }
}