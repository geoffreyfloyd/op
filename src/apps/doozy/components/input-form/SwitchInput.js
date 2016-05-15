import React from 'react';
import InputMixin from './InputMixin';
import LabelMixin from './LabelMixin';

var SwitchInput = React.createClass({
    /*************************************************************
     * DEFINITIONS
     *************************************************************/
    mixins: [InputMixin, LabelMixin],
    propTypes: {
        // Optional
        focus: React.PropTypes.bool,
        info: React.PropTypes.string,
        style: React.PropTypes.object
    },

    getInitialState: function () {
        return {
            readOnly: this.props.readOnly === undefined || typeof this.props.readOnly === 'function' ? false : this.props.readOnly,
            visible: this.props.visible === undefined || typeof this.props.visible === 'function' ? true : this.props.visible
        };
    },

    /*************************************************************
     * COMPONENT LIFECYCLE
     *************************************************************/
    componentWillMount: function () {
        this.current = { value: this.props.defaultValue !== undefined ? this.props.defaultValue : false };
    },
    componentDidMount: function () {
        if (this.props.focus) {
            this.refs.input.focus();
        }
    },

    /*************************************************************
     * INPUT MIXIN
     *************************************************************/
    valueProvider: function (event) {
        return event.target.checked;
    },

    /*************************************************************
     * EVENT HANDLING
     *************************************************************/
    handleToggleClick: function () {
        // Ignore click (img element does not have a readOnly property)
        if (this.state.readOnly) {
            return;
        }

        this.handleChange({ target: { checked: !this.current.value }});
    },

    /*************************************************************
     * RENDERING
     *************************************************************/
    render: function () {
        var value = this.current.value;
        var input = (<input ref="input" readOnly={this.state.readOnly} style={Object.assign({}, styles.formControl, this.props.style, this.hasChanged() ? styles.changed : {}, this.state.visible ? {} : styles.hide)} id={this.props.field} type="checkbox" checked={value} defaultValue={this.props.defaultValue} title={this.props.info} data-original-title={this.props.info} onChange={this.handleChange } />);

        input = this.renderLabel(input);
        return input;
    }
});

/*************************************************************
 * STYLES
 *************************************************************/
var styles = {
    changed: {
        borderColor: '#ffff00',
        boxShadow: 'inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(175, 175, 0, .6)'
    },
    formControl: {
        display: 'block',
        width: '100%',
        height: '34px',
        padding: '6px 12px',
        fontSize: '14px',
        lineHeight: '1.42857143',
        color: '#555',
        backgroundColor: '#fff',
        backgroundImage: 'none',
        border: '1px solid #ccc',
        borderRadius: '4px',
        WebkitBoxShadow: 'inset 0 1px 1px rgba(0,0,0,.075)',
        boxShadow: 'inset 0 1px 1px rgba(0,0,0,.075)',
        WebkitTransition: 'border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s',
        OTransition: 'border-color ease-in-out .15s,box-shadow ease-in-out .15s',
        transition: 'border-color ease-in-out .15s,box-shadow ease-in-out .15s',
    },
    hide: {
        display: 'none'
    },
};

export default SwitchInput;
