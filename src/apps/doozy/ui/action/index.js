import '../../global.scss';

import React from 'react';
import host from '../../stores/host';
import { $background, $content, $form, $formSection, $label, $buttons, $button } from '../../../../components/styles';
import Form from '../../../../components/forms/Form';
import FormSection from '../../../../components/forms/FormSection';
import TextInput from '../../../../components/forms/TextInput';
import TagInput from '../../../../components/forms/TagInput';
import MultiLineInput from '../../../../components/forms/MultiLineInput';
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
      var form = this.refs.form.getValue();
      var newModel = Object.assign({}, this.props.model, form);
      actionStore.save(newModel);
   }

   /*************************************************************
   * RENDERING
   *************************************************************/
   render () {
      var { model, tags } = this.props;
      return (
         <div style={$background}>
            <div style={$content}>
               <Form ref="form" model={model} style={$form} labelSpan={2} labelStyle={$label}>
                  <FormSection title="General" style={$formSection}>
                     <TextInput label="Name" path="name" />
                     <TagInput label="Tags" path="tags" items={tags} />
                     <MultiLineInput label="Content" path="content" autoGrow focus />
                     <TextInput label="Duration" path="duration" type="number" />
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
