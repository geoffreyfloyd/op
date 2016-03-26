import React from 'react';
import {Editor, ContentState, EditorState, RichUtils, CompositeDecorator} from 'draft-js';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './Prompt.scss';
import requestStore from '../../stores/request-store';
import babble from 'babble';
import those from 'those';

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

const createNewEditorState = (text) => {
   if (text) {
      return EditorState.createWithContent(ContentState.createFromText(text),
         new CompositeDecorator([
            {
               strategy: hashtagStrategy,
               component: withStyles(HashtagSpan, styles),
            }
         ])
      );
   }
   else {
      return EditorState.createEmpty(
         new CompositeDecorator([
            {
               strategy: hashtagStrategy,
               component: withStyles(HashtagSpan, styles),
            }
         ])
      );
   }
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
   
   componentDidUpdate() {
      
   }

   _updateHistory() {
      var { commitHistory } = this.state;
      var cmd = this.state.editorState.getCurrentContent().getPlainText().trim();
      commitHistory = those(commitHistory).flick(cmd).flip();
      commitHistory.push(cmd);
      commitHistory.reverse();
      return commitHistory;
   }

   _onReturn() {
      var commitHistory = this._updateHistory();
      
      //
      var text = this.state.editorState.getCurrentContent().getPlainText('\n');
      this._handleSendRequest(text);
      
      this.setState({
         commitHistory: commitHistory,
         editorState: EditorState.moveFocusToEnd(createNewEditorState())
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
      var editorState = createNewEditorState(this.state.commitHistory[historyIndex]);
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
      var editorState = createNewEditorState(this.state.commitHistory[historyIndex]);
      this.setState({
         historyIndex: historyIndex,
         editorState: editorState
      });
   }
   
   _handleSendRequest(hoomanInput) {
      // send request
      requestStore.send(hoomanInput, this.props.sessionId, this._handleResponseReady);
   }
   
   _handleResponseReady(req) {
      console.log(req);
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
