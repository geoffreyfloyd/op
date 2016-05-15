import React from 'react';
import Uploader from './Uploader';

const ProfilePic = React.createClass({
   /*************************************************************
   * DEFINITIONS
   *************************************************************/
   getInitialState: function () {
      return {
            filesSelected: false
      };
   },

   /*************************************************************
   * EVENT HANDLING
   *************************************************************/
   handleOnFileChange: function (filesSelected) {
      this.setState({
            filesSelected: filesSelected
      });
   },

   /*************************************************************
   * RENDERING
   *************************************************************/
   render: function () {
      var currentImage;
      if (!this.state.filesSelected) {
            currentImage = (<img style={{display: 'inline', maxWidth: '100px', maxHeight: '100px'}} src={this.props.uri} />);
      }
      return (
            <div>
               <label>What picture do you want others to see?</label>
               {currentImage}
               <Uploader type="Profile" onFileChange={this.handleOnFileChange} />
            </div>
      );
   }
});

export default ProfilePic;
