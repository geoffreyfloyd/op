import React from 'react';
import Form from '../../../../components/forms/Form';
import FormSection from '../../../../components/forms/FormSection';
import InputTable from '../../../../components/forms/InputTable';
import SelectionInput from '../../../../components/forms/SelectionInput';
import TagInput from '../../../../components/forms/TagInput';
import TextInput from '../../../../components/forms/TextInput';
import MultiLineInput from '../../../../components/forms/MultiLineInput';
import bitStore from '../../stores/bit-store';
import Promise from 'bluebird';

export default class Bit extends React.Component {
   constructor(props) {
      super(props);
      this.handleSaveChanges = this.handleSaveChanges.bind(this);
      this.state = {
         model: this.props.model,
         tags: this.props.tags,
      };
   }

   /*************************************************************
    * EVENT HANDLING
    *************************************************************/
   handleSaveChanges() {
      var form = this.refs.form.getValue();
      var newModel = Object.assign({}, this.props.model, form);
      bitStore.save(newModel).then(serverModel => {
         this.setState({ model: serverModel });
      });
   }

   /*************************************************************
   * RENDERING
   *************************************************************/
   render() {
      var { model, tags } = this.state;
      
      return (
         <div style={styles.background}>
            <div style={styles.content}>
               <Form ref="form" model={model} style={{ color: '#2B90E8' }} labelStyle={{ color: '#00AF27' }}>
                  <FormSection title="General">
                     <TextInput label="Name" path="caption" />
                  </FormSection>
                  <FormSection title="Images">
                     <InputTable path="images" getNewRow={newImage}>
                        <TextInput label="Source" path="src" />
                     </InputTable>
                  </FormSection>
                  <FormSection title="Videos">
                     <InputTable path="videos" getNewRow={newVideo}>
                        <TextInput label="Source" path="src" />
                        <TextInput label="Start At" type="number" path="start" />
                        <TextInput label="End At" type="number" path="end" />
                     </InputTable>
                  </FormSection>
                  <FormSection title="Texts">
                     <InputTable path="texts" getNewRow={newText}>
                        <MultiLineInput label="Text" path="text" />
                     </InputTable>
                  </FormSection>
                  <FormSection title="Notes">
                     <InputTable path="notes" getNewRow={newNote}>
                        <MultiLineInput label="Note" path="note" />
                     </InputTable>
                  </FormSection>
                  <FormSection title="Tags">
                     <TagInput label="Tags" path="tags" />
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

function newImage() {
   return new Promise(function (resolve, reject) {
      resolve({
         src: ''
      });
   });
}

function newVideo() {
   return new Promise(function (resolve, reject) {
      resolve({
         src: '',
         start: null,
         end: null
      });
   });
}


function newNote() {
   return new Promise(function (resolve, reject) {
      resolve({
         src: '',
         note: ''
      });
   });
}

function newText() {
   return new Promise(function (resolve, reject) {
      resolve({
         src: '',
         text: ''
      });
   });
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
