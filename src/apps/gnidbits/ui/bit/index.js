import React from 'react';
import { $background, $content, $form, $formSection, $inputRow, $inlineLabel, $label, $buttons, $button } from '../../../../components/styles';
import Message from '../../../../components/Message';
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

      Message.notify('Saving...');
      bitStore.save(newModel).then(serverModel => {
         this.setState({ model: serverModel });
         Message.notify('Saved...');
      });
   }

   /*************************************************************
   * RENDERING
   *************************************************************/
   render() {
      var { model, tags } = this.state;
      
      return (
         <div style={$background}>
            <div style={$content}>
               <Form ref="form" model={model} style={{ color: '#2B90E8' }} labelStyle={{ color: '#00AF27' }}>
                  <FormSection title="General" labelSpan={2} style={$formSection}>
                     <TextInput label="Name" path="caption" />
                     <TagInput label="Tags" path="tags" items={tags} />
                  </FormSection>
                  <FormSection title="Images" style={$formSection}>
                     <InputTable path="images" getNewRow={newImage}>
                        <TextInput path="src" />
                     </InputTable>
                  </FormSection>
                  <FormSection title="Videos" style={$formSection}>
                     <InputTable path="videos" getNewRow={newVideo} style={$inputRow}>
                        <label className="control-label" style={$inlineLabel}>Source</label>
                        <TextInput path="src" cellStyle={{ flex: '1' }} />
                        <label className="control-label" style={$inlineLabel}>Start At</label>
                        <TextInput type="number" path="start" cellStyle={{ maxWidth: '5rem' }} />
                        <label className="control-label" style={$inlineLabel}>End At</label>
                        <TextInput type="number" path="end" cellStyle={{ maxWidth: '5rem' }} />
                     </InputTable>
                  </FormSection>
                  <FormSection title="Texts" style={$formSection}>
                     <InputTable path="texts" getNewRow={newText}>
                        <MultiLineInput path="text" />
                     </InputTable>
                  </FormSection>
                  <FormSection title="Notes" style={$formSection}>
                     <InputTable path="notes" getNewRow={newNote}>
                        <MultiLineInput path="note" />
                     </InputTable>
                  </FormSection>
                  <FormSection title="Links" style={$formSection}>
                     <InputTable path="links" getNewRow={newLink}>
                        <TextInput path="src" />
                        <TextInput path="description" />
                     </InputTable>
                  </FormSection>
               </Form>
               <div style={$buttons}>
                  <button style={$button} onClick={this.handleSaveChanges}>Save Changes</button>
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

function newLink() {
   return new Promise(function (resolve, reject) {
      resolve({
         src: '',
         description: '',
      });
   });
}
