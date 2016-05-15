import React from 'react';
import doozy from '../doozy';
import RelativeTime from './RelativeTime';

var FocusListItem = React.createClass({
    /*************************************************************
     * EVENT HANDLING
     *************************************************************/
    handleFocusClick: function (item) {
        if (this.props.handleFocusClick) {
            this.props.handleFocusClick(item);
        }
    },

    /*************************************************************
     * RENDERING HELPERS
     *************************************************************/
    calcFocusTitle: function (tag) {
        // if (tag.focusKind === 'Role') {
        //     if (doozy.hasPossessiveNoun(tag.name)) {
        //         return 'You\'re ' + tag.name;
        //     }
        //     else {
        //         return 'You\'re ' + (doozy.startsWithAVowel(tag.name) ? 'an' : 'a') + ' ' + focus.name;
        //     }
        // }
        // else if (tag.focusKind === 'Path') {
        //     return 'You\'re on a path of ' + tag.name;
        // }
        return tag.name;
    },

    /*************************************************************
     * RENDERING
     *************************************************************/
    render: function () {
        var data = this.props.data;
        var latestDate = data.latestEntry !== undefined && data.latestEntry !== null ? data.latestEntry.date : null;

        return (
            <li key={data.id}>
                <a onClick={this.handleFocusClick.bind(null, data)} style={menuItemStyle}>
                    <div>
                        <img style={imageStyle} src={'/my/doozy/tag/' + data.name + '/icon.png'} />
                        <div style={{display: 'inline-block', verticalAlign: 'top'}}>
                            <div>{this.calcFocusTitle(data)}</div>
                            <div style={{fontSize: '14px'}}>{'last acted '}<RelativeTime accuracy="d" isoTime={latestDate} /></div>
                        </div>
                    </div>
                </a>
            </li>
        );
    }
});

/*************************************************************
 * STYLING
 *************************************************************/
var menuItemStyle = {
    display: 'block',
    padding: '3px 5px',
    borderBottom: '1px solid #e0e0e0',
    clear: 'both',
    fontWeight: '400',
    lineHeight: '1.42857143',
    color: '#333',
    whiteSpace: 'nowrap',
    cursor: 'pointer'
};

var imageStyle = {
    maxHeight: '50px',
    width: '50px',
    paddingRight: '5px',
    display: 'inline',
    verticalAlign: 'inherit'
};

export default FocusListItem;
