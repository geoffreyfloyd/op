import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import doozy from '../../doozy';

var TagListItem = React.createClass({
   /*************************************************************
    * DEFINITIONS
    *************************************************************/
   mixins: [PureRenderMixin],
   propTypes: {
      // required
      tag: React.PropTypes.object.isRequired,

      // optional
      handleClick: React.PropTypes.func,
      isSelected: React.PropTypes.bool,
   },

   /*************************************************************
    * COMPONENT LIFECYCLE
    *************************************************************/
   getDefaultProps: function () {
      return {
         isSelected: false
      };
   },

   /*************************************************************
    * EVENT HANDLING
    *************************************************************/
   handleClick: function () {
      if (typeof this.props.handleClick === 'function') {
         this.props.handleClick();
      }
   },

   /*************************************************************
    * RENDERING
    *************************************************************/
   render: function () {
      var {tag, isSelected} = this.props;
      var appendClassname = isSelected ? ' ' + 'selected' : '';
      var domTag = <span> {tag.name}</span>;

      return (
         <li onClick={this.handleClick} style={styles.getListItemStyle(isSelected)} >
            <i style={{color: '#000'}} className={'fa ' + styles.getClassNameFromTagKind(tag.kind) }></i>{domTag}
         </li>
      );
   },
});

/*************************************************************
 * STYLING
 *************************************************************/
var styles = {
   getListItemStyle: function (isSelected) {
      var s = {
         cursor: 'pointer',
         borderRadius: '4px',
         display: 'inline-block',
         padding: '2px 5px',
         margin: '0 0 2px 2px',
         border: '1px solid $clrBsDefault2'
      };
      if (isSelected) {
         s.backgroundColor = '#1b9dec';
         s.color = '#eee';
      }
      return s;
   },
   getClassNameFromTagKind: function (kind) {
      switch (kind) {
         case ('Focus'): // part of (relevant to)
            return 'fa-eye';
         case ('Place'): // where
            return 'fa-anchor';
         case ('Goal'): // to what end
            return 'fa-trophy';
         case ('Need'): // why
            return 'fa-recycle';
         case ('Box'): // when
            return 'fa-cube';
         default:
            return 'fa-tag';
      }
   },
};

module.exports = TagListItem;
