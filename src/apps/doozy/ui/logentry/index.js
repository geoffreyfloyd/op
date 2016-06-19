import '../../global.scss';

import React from 'react';
import host from '../../stores/host';
// import InputForm from '../../components/input-form';
// import TextInput from '../../components/input-form/TextInput';
import Form from '../../../../components/forms/Form';
import FormSection from '../../../../components/forms/FormSection';
import InputTable from '../../../../components/forms/InputTable';
import TagInput from '../../../../components/forms/TagInput';
import TextInput from '../../../../components/forms/TextInput';
import MultiLineInput from '../../../../components/forms/MultiLineInput';
import logEntryStore from '../../stores/logentry-store';

export default class LogEntry extends React.Component {
   constructor (props) {
      super(props);
      this.handleSaveChanges = this.handleSaveChanges.bind(this);
   }

   /*************************************************************
    * EVENT HANDLING
    *************************************************************/
   handleSaveChanges () {
      var form = this.refs.form.getValue();
      var newModel = Object.assign({}, this.props.model, form);
      logEntryStore.save(newModel);
   }

   /*************************************************************
    * RENDERING
    *************************************************************/
   render () {
      // <TextInput label="Kind" field="kind" />
      var { model, tags } = this.props;
      return ( 
         <div style={styles.background}>
            <div style={styles.content}>
               <Form ref="form" model={model} style={{ color: '#2B90E8' }} labelSpan={2} labelStyle={{ color: '#00AF27' }}>
                  <FormSection title="General" style={styles.formSection}>
                     <TextInput label="Date" path="date" type="date" />
                     <MultiLineInput label="Details" path="details" focus={true} />
                     <TextInput label="Duration" path="duration" type="text" />
                     <TagInput label="Tags" path="tags" items={tags} />
                  </FormSection>
               </Form>
               <div style={styles.centerButtons}>
                  <button style={styles.saveButton} onClick={this.handleSaveChanges}>Save Changes</button>
               </div>
            </div>
         </div>
      );
   }        
}

function newTag() {
   return new Promise(function (resolve, reject) {
      resolve({
         id: '',
      });
   });
}

/*************************************************************
 * STYLING
 *************************************************************/
var styles = {
   background: {
      backgroundColor: '#222',
      minHeight: '100vh',
      padding: '0.5rem',
   },
   centerButtons: {
      margin: '1rem 0',
   },
   content: {
      // backgroundColor: '#fff',
      maxWidth: '60rem',
      margin: 'auto',
   },
   formSection: {
      padding: '0.5rem 1rem',
      borderRadius: '0.25rem',
      backgroundColor: '#333',
      marginBottom: '0.5rem',
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
