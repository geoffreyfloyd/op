import React from 'react';
import RelativeTime from '../RelativeTime';

export default class ActionListItem extends React.Component {
   /*************************************************************
   * RENDERING
   *************************************************************/
   render () {
      var {id, lastPerformed, name} = this.props;
      
      return (
         <tr style={styles.row} className={'highlight-hover'}>
            <td width="5px" style={{padding: '0 0 0 5px'}}><input style={styles.checkbox} type="checkbox" /></td>
            <td>
               <span><a href={'/actions/' + id}>{name}</a></span>
            </td>
            <td width="150px"><RelativeTime accuracy="d" isoTime={lastPerformed} /></td>
         </tr>
      );
   }
}

const styles = {
   checkbox : {
      height: '1.5rem',
      width: '1.5rem',
   },
   row: {
      fontSize: '1.4em'
   }
};
