import React from 'react';
import those from 'those';
import TagListItem from './TagListItem';

export default class TagList extends React.Component {
   /*************************************************************
    * DEFINITIONS
    *************************************************************/
   static propTypes = {
      // Required Props
      tags: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
      // Optional Props
      selectedTags: React.PropTypes.arrayOf(React.PropTypes.string),
      selectionChanged: React.PropTypes.func,
      onTagUpdated: React.PropTypes.func,
      canAdd: React.PropTypes.bool
   };
   
   static defaultProps = {
      canAdd: false,
      selectedTags: []
   };

   /*************************************************************
    * RENDERING
    *************************************************************/
   render () {
      var {canAdd, onTagUpdated,  selectedTags, selectionChanged, tags} = this.props;

      var domTags = tags.map(tag => {
            return (
               <TagListItem key={tag.id}
                  tag={tag}
                  isSelected={those(selectedTags).has(tag.id) }
                  handleClick={selectionChanged ? selectionChanged.bind(null, tag.id) : undefined}
                  onTagUpdated={onTagUpdated} />
            );
         }
      );

      if (canAdd) {
         domTags.push(
            <TagListItem key="newtag"
               tag=""
               isSelected={false}
               handleClick={selectionChanged ? selectionChanged.bind(null, '') : undefined}
               onTagUpdated={onTagUpdated}/>
         );
      }

      return (
         <ul style={styles.tagList}>
            {domTags}
         </ul>
      );
   }
}

var styles = {
   tagList: {
      display: 'inline',
      margin: '0',
      padding: '2px',
      listStyle: 'none',
      border: 'none',
      overflow: 'hidden',
   }
};
