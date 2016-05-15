import React from 'react';
import InputMixin from './InputMixin';
import LabelMixin from './LabelMixin';

var TextInput = React.createClass({
    /*************************************************************
     * DEFINITIONS
     *************************************************************/
    mixins: [InputMixin, LabelMixin],
    propTypes: {
        // OPTIONAL
        focus: React.PropTypes.bool,
        placeholder: React.PropTypes.string,
        style: React.PropTypes.object,
        type: React.PropTypes.oneOf(['text','password','number','date','memo']),
    },

    getDefaultProps: function () {
        return {
            type: 'text'
        };
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
        this.current = { value: this.props.defaultValue !== undefined ? this.props.defaultValue : null };
    },
    componentDidMount: function () {
        if (this.props.focus) {
            this.refs.input.focus();
            this.refs.input
        }
        if (this.props.type === 'memo') {
            autoGrow(this.refs.input);
        }
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.defaultValue !== this.props.defaultValue) {
            this.current.value = nextProps.defaultValue;
        }
    },
    
    handleFocus: function () {
        moveCursorToEnd(this.refs.input);
    },
    
    handleGrowChange: function () {
        autoGrow(this.refs.input);
        this.handleChange({ target: { value: this.refs.input.val } });
    },
    
    /*************************************************************
     * INPUT MIXIN
     *************************************************************/
    valueProvider: function (e) {
        if (e.target.value === undefined || e.target.value === '' || e.target.value === null) {
            return null;
        }
        else if (this.props.type === 'number' && typeof e.target.value === 'string') {
            return parseInt(e.target.value, 10);
        }
        else {
            return e.target.value;
        }
    },
    
    /*************************************************************
     * RENDERING
     *************************************************************/
    render: function () {
        // Even though current value is null,
        // we don't set the input to null because
        // that causes it to pull in the default value again
        var value = this.current.value || '';

        var input;
        if (this.props.type === 'memo') {
            input = (
                <textarea
                    ref="input"
                    readOnly={this.state.readOnly} 
                    style={Object.assign({}, styles.formControl, this.props.style, this.hasChanged() ? styles.changed : {}, this.state.visible ? {} : styles.hide)} 
                    autoComplete="off" 
                    id={this.props.field}
                    value={value}
                    defaultValue={this.props.defaultValue} 
                    onChange={this.handleGrowChange} 
                    onFocus={this.handleFocus}
                    placeholder={this.props.placeholder} />
            );
        }
        else {
            input = (
                <input 
                    ref="input"
                    readOnly={this.state.readOnly} 
                    style={Object.assign({}, styles.formControl, this.props.style, this.hasChanged() ? styles.changed : {}, this.state.visible ? {} : styles.hide)} 
                    autoComplete="off" 
                    id={this.props.field} 
                    type={this.props.type} 
                    value={value}
                    defaultValue={this.props.defaultValue} 
                    onChange={this.handleChange } 
                    placeholder={this.props.placeholder} />
            );
        }
        
        input = this.renderLabel(input);
        return input;
    }
});

function moveCursorToEnd(el) {
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}

/*************************************************************
 * STYLES
 *************************************************************/
var styles = {
    changed: {
        borderColor: '#ffff00',
        boxShadow: 'inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(175, 175, 0, .6)'
    },
    hide: {
        display: 'none'
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
    }
};

function autoGrow (textArea) {
    textArea.style.overflowX = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
}

export default TextInput;
