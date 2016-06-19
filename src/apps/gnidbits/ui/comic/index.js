import React from 'react';
import ComicPane from './comic-pane';
import ComicImage from './comic-image';
import ComicVideo from './comic-video';
import ComicText from './comic-text';
import Form from '../../../../components/forms/Form';
import TagInput from '../../../../components/forms/TagInput';
import SelectionInput from '../../../../components/forms/SelectionInput';

class ComicStrip extends React.Component {
   constructor (props) {
      super(props);
      this.state = {
         active: 0,
      }
      
      this.handleKeyDown = this.handleKeyDown.bind(this);
      this.handlePaneActivate = this.handlePaneActivate.bind(this);
      this.handlePaneDone = this.handlePaneDone.bind(this);
      if (global.window) {
         global.window.document.addEventListener('keydown', this.handleKeyDown, false);   
      }
   }
   
   nextPane () {
      var nextActive = this.state.active === (this.props.strip.length - 1) ? 0 : (this.state.active + 1);
      this.setState({
         active: nextActive
      });   
   }

   prevPane () {
      var prevActive = this.state.active - 1;
      if (prevActive === -1) {
         prevActive = this.props.strip.length - 1;
      }
      this.setState({
         active: prevActive
      });   
   }

   handleKeyDown (event) {
      var keyCode = event.which || event.charCode || event.keyCode;
      if ([32, 39, 40].indexOf(keyCode) > -1) { // space, right, down
         this.nextPane();
      }
      else if ([37, 38].indexOf(keyCode) > -1) { // left, up
         this.prevPane();
      }
   }
   
   handlePaneActivate (index) {
      this.setState({
         active: index
      });
   }
   
   handlePaneDone (index) {
      if (index === this.state.active) {
         this.nextPane();
      }
   }
   
   renderVideo(video, active) {
      return <ComicVideo active={active} {...video} />;
   }
   
   renderImage(image) {
      return <ComicImage {...image} />;
   }
   
   renderText(text) {
      return <ComicText {...text} />
   }
   
   render() {
      return (
         <div style={styles[this.props.mode]}>
            {this.props.strip.map((node, index) => {
               var images = [];
               var captions = [];
               var videos = [];
               var texts = [];
               
               if (node.videos && node.videos.length) {
                  videos = node.videos.map(vid => this.renderVideo(vid));
               }
               if (node.images && node.images.length) {
                  images = node.images.map(img => this.renderImage(img));
               }
               if (node.texts && node.texts.length) {
                  texts = node.texts.map(txt => this.renderText(txt));
               }
               
               return <ComicPane 
                        uri={node.uri || String(index)} 
                        caption={node.caption} 
                        onClick={this.handlePaneActivate.bind(null, index)} 
                        onDone={this.handlePaneDone.bind(null, index)}
                        mode={this.props.mode} active={index === this.state.active}>{[...images, ...videos, ...texts, ...captions]}</ComicPane>;
            })}
         </div>
      );
   }
}

const mediaTypes = [
   { 
      id: '*', 
      name: 'All'
   },
   { 
      id: 'videos', 
      name: 'Videos'
   },
   { 
      id: 'images', 
      name: 'Images'
   },
   { 
      id: 'texts', 
      name: 'Texts'
   },
   { 
      id: 'audios', 
      name: 'Audios'
   },
];


function getDefaultFilter() {
   return {
      mediaType: 'images',
      tags: []
   };
}

export default class Presenter extends React.Component {
   constructor (props) {
      super(props);
      this.state = getDefaultFilter();
      this.model = getDefaultFilter();
      this.handleFormChange = this.handleFormChange.bind(this);
   }

   handleFormChange (e) {
      this.setState(e.form);
   }

   render () {
      var { content, tags, index } = this.props;
      var state = this.state;
      if (index) {
         return (
            <div style={styles.body}>
               {Object.keys(index).map(key => {
                  return <ComicStrip mode="wrap" strip={index[key]} />   
               })}
            </div>
         ); 
      }
      else {

         if (state.mediaType && state.mediaType !== '*') {
            content = content.filter(bit => {
               return bit[state.mediaType].length;
            });
         }

         if (state.tags.length) {
            content = content.filter(bit => {
               return state.tags.filter(tag => {
                  return bit.tags.filter(bittag => {
                     return bittag.id === tag.id;
                  }).length;
               }).length;
            });
         }

         return (
            <div style={styles.body}>
               <Form model={this.model} style={{ color: '#2B90E8', padding: '0.5rem', maxWidth: '20rem' }} onChange={this.handleFormChange} labelSpan={2} labelStyle={{ color: '#00AF27' }}>
                  <SelectionInput label="Media" path="mediaType" items={mediaTypes} displayPath="name" valuePath="id" />
                  <TagInput label="Tags" path="tags" items={tags} />
               </Form>
               <ComicStrip mode="wrap" strip={content} />
            </div>
         );   
      }
      
   }
}

const styles = {
   body: {
      backgroundColor: '#444',
   },
   wrap: {
      display: 'flex',
      alignContent: 'flex-start',
      justifyContent: 'space-around',
      flexDirection: 'row',
      flexWrap: 'wrap',
      minHeight: '100vh',
   },
   feed: {
      width: '31rem',
      marginLeft: 'auto',
      marginRight: 'auto',
      
   },
   pan: {
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      maxHeight: '20rem',
   },
};

var testMediaStrip = [
   {
      uri: '2',
      prev: '1',
      next: '3',
      videos: [
         {
            src: 'http://www.w3schools.com/html/mov_bbb.mp4',
         }
      ],
      captions: [
         'Bunny!'
      ],
      images: [

      ]
   },

];
