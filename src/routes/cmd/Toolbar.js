import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './Toolbar.scss';

class Toolbar extends React.Component {
   /*************************************************************
    * DEFINITIONS
    *************************************************************/
   static propTypes = {
      children: React.PropTypes.object,
      onClickNewSession: React.PropTypes.func,
      onClickProcesses: React.PropTypes.func,
      showProcesses: React.PropTypes.bool
   };

   /*************************************************************
   * RENDERING
   *************************************************************/
   render () {
      return (
         <div className={styles.container}>
            <ul className={styles.menuitem} style={{ float: 'right' }}>
               <li><button className={styles.button} onClick={this.props.onClickNewSession}><i className="fa fa-2x fa-terminal" title="Start a new session"></i></button></li>
               <li><button className={styles.button} style={this.props.showProcesses ? { color: '#d6d6d6' } : {}} onClick={this.props.onClickProcesses}><i className="fa fa-2x fa-gears" title="Processes"></i></button></li>
            </ul>
            {this.props.children}
         </div>
      );
   }
}

export default withStyles(Toolbar, styles);
