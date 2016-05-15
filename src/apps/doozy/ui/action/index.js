import '../../global.scss';

import React from 'react';
import host from '../../stores/host';
import InputForm from '../../components/input-form';
import TextInput from '../../components/input-form/TextInput';
import actionStore from '../../stores/action-store';

export default class Action extends React.Component {
   constructor (props) {
      super(props);
      this.handleSaveChanges = this.handleSaveChanges.bind(this);
   }
      
   /*************************************************************
    * EVENT HANDLING
    *************************************************************/
   handleSaveChanges () {
      var form = this.refs.form.getForm();
      var newModel = Object.assign({}, this.props.model, form);
      actionStore.save(newModel);
   }

   /*************************************************************
   * RENDERING
   *************************************************************/
   render () {
      // <TextInput label="Kind" field="kind" />
      var {model} = this.props;
      return (
         <div style={styles.background}>
            <div style={styles.content}>
               <InputForm ref="form" title="Action Details" bindingContext={model} style={{color: '#2B90E8'}} labelStyle={{color: '#00AF27'}}>
                  <TextInput label="Name" field="name" />
                  <TextInput label="Content" field="content" type="memo" focus={true} />
                  <TextInput label="Duration" field="duration" type="number" />
               </InputForm>
               <div style={styles.centerButtons}>
                  <button style={styles.saveButton} onClick={this.handleSaveChanges}>Save Changes</button>
               </div>
            </div>
         </div>
      );
   }
}

/*************************************************************
 * STYLING
 *************************************************************/
var styles = {
   background: {
      backgroundColor: '#222',
      minHeight: '100vh'
   },
   centerButtons: {
      maxWidth: '48rem',
      margin: '0 0 0 11rem',
   },
   content: {
      // backgroundColor: '#fff',
      maxWidth: '60rem',
      margin: 'auto',
   },
   saveButton: {
         color: '#fff',
         backgroundColor: '#2B90E8',
         
         width: '100%',
         
         display: 'inline-block',
         fontSize: '1.1rem',
         lineHeight: '1.42857143',
         textAlign: 'center',
         whiteSpace: 'nowrap',
         verticalAlign: 'middle',
         MsTouchAction: 'manipulation',
         touchAction: 'manipulation',
         cursor: 'pointer',
         WebkitUserSelect: 'none',
         MozUserSelect: 'none',
         MsUserSelect: 'none',
         userSelect: 'none',
         backgroundImage: 'none',
         border: '1px solid transparent',
         borderRadius: '0.25rem'
   }
};
