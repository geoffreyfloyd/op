import '../../global.scss';

import React from 'react';
import host from '../../stores/host';
import { $background, $content, $form, $formSection, $label, $buttons, $button } from '../../../../components/styles';
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
         <div style={$background}>
            <div style={$content}>
               <Form ref="form" model={model} style={$form} labelSpan={2} labelStyle={$label}>
                  <FormSection title="General" style={$formSection}>
                     <TextInput label="Date" path="date" type="date" />
                     <MultiLineInput label="Details" path="details" autoGrow focus />
                     <TextInput label="Duration" path="duration" type="text" />
                     <TagInput label="Tags" path="tags" items={tags} />
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
