import React from 'react';
import {Editor, EditorState, RichUtils, CompositeDecorator} from 'draft-js';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './Prompt.scss';

const HASHTAG_REGEX = /\#[\w\u0590-\u05ff]+/g;

function hashtagStrategy(contentBlock, callback) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}
//{color: 'rgba(95, 184, 138, 1.0)'}
const HashtagSpan = (props) => {
  return <span {...props} className={styles.hashtag}>{props.children}</span>;
};

const createNewEditorState = () => {
   return EditorState.createEmpty(
      new CompositeDecorator([
         {
            strategy: hashtagStrategy,
            component: withStyles(HashtagSpan, styles),
         }
      ])
   )
}

export default class Prompt extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         historyIndex: -1,
         commitHistory: [],
         editorState: createNewEditorState()
      };
      this.onChange = (editorState) => {
         this.setState({ editorState });
      }
   }

   _onReturn() {
      var { commitHistory } = this.state;
      commitHistory.push(this.state.editorState);
      this.setState({
         commitHistory: commitHistory,
         editorState: createNewEditorState()
      });
      return true;
   }
   
   _onKeyCommand(command) {
      const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
      if (newState) {
         this.onChange(newState);
         return true;
      }
      return false;
   }
   
   _onUpArrow() {
      var historyIndex = this.state.historyIndex + 1
      if (historyIndex > this.state.commitHistory.length - 1) {
         historyIndex = this.state.commitHistory.length - 1;
      }
      var editorState = this.state.commitHistory[historyIndex] || createNewEditorState();
      this.setState({
         historyIndex: historyIndex,
         editorState: editorState
      });
   }
   
   _onDownArrow() {
      var historyIndex = this.state.historyIndex - 1;
      if (historyIndex < -1) {
         historyIndex = -1;
      }
      var editorState = this.state.commitHistory[historyIndex] || createNewEditorState();
      this.setState({
         historyIndex: historyIndex,
         editorState: editorState
      });
   }

   render() {
      const {editorState} = this.state;
      return (
         <div className={styles.inputcontainer}>
            <Editor editorState={editorState} onChange={this.onChange} 
               handleKeyCommand={this._onKeyCommand.bind(this)}
               handleReturn={this._onReturn.bind(this)}
               onUpArrow={this._onUpArrow.bind(this)}
               onDownArrow={this._onDownArrow.bind(this)} />
         </div>
      );
   }
}
