import React from 'react';
import InputMixin from './InputMixin';
import LabelMixin from './LabelMixin';

var SelectionInput = React.createClass({
    /*************************************************************
     * DEFINITIONS
     *************************************************************/
    mixins: [InputMixin, LabelMixin],
    propTypes: {
        // items, displayPath, and valuePath are required
        // if this.props.children is null
        items: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.func // callback signature: input::ReactElement, frmChg::object{FormChangeEventArgs}, update::func{array}
        ]),
        displayPath: React.PropTypes.string,
        valuePath: React.PropTypes.string,

        // OPTIONAL
        focus: React.PropTypes.bool,
        style: React.PropTypes.object,
        size: React.PropTypes.number,
        type: React.PropTypes.oneOf(['string','number'])
    },

    getInitialState: function () {
        return {
            items: this.props.items === undefined || typeof this.props.items === 'function' ? [] : this.props.items,
            readOnly: this.props.readOnly === undefined || typeof this.props.readOnly === 'function' ? false : this.props.readOnly,
            visible: this.props.visible === undefined || typeof this.props.visible === 'function' ? true : this.props.visible
        };
    },

    /*************************************************************
     * COMPONENT LIFECYCLE
     *************************************************************/
    componentWillMount: function () {
        this.current = {
            value: this.props.defaultValue !== undefined ? this.props.defaultValue : null
        };
    },
    componentDidMount: function () {
        if (this.props.focus) {
            this.refs.input.focus();
        }
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
    renderOptions: function () {
        var valuePath = this.props.valuePath;
        var displayPath = this.props.displayPath;

        return this.state.items.map(function (item, index) {
            // Get value and diplay
            var value = item;
            var display = item;
            if (valuePath) {
                value = item[valuePath];
            }
            if (displayPath) {
                display = item[displayPath];
            }

            return (
                <option key={index} value={value}>{display}</option>
            );
        });
    },
    render: function () {
        var value = this.current.value;
        // Use given children or render children from items prop
        var options = this.props.children || this.renderOptions();
        var input = (
            <select ref="input" readOnly={this.state.readOnly} style={Object.assign({}, styles.formControl, this.props.style, this.hasChanged() ? styles.changed : {}, this.state.visible ? {} : styles.hide)} size={this.props.size} id={this.props.field} value={value} defaultValue={this.props.defaultValue} onChange={this.handleChange}>
                {options}
            </select>
        );
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

export default SelectionInput;
