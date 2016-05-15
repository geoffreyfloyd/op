import React from 'react';
import FormMixin from './FormMixin';
import InputGroup from './InputGroup';

var InputForm = React.createClass({
    /*************************************************************
     * DEFINITIONS
     *************************************************************/
    mixins: [FormMixin],
    propTypes: {
        // OPTIONAL
        onChange: React.PropTypes.func, // form change event callback
        info: React.PropTypes.string, // popup tooltip message
        title: React.PropTypes.string, // title of form
    },

    getInitialState: function () {
        return {
            errors: []
        };
    },

    /*************************************************************
     * COMPONENT LIFECYCLE
     *************************************************************/
    componentDidMount: function () {
        // Assemble form change event args
        var frmChgEventArgs = {
            form: this.getForm(),
            hasChanged: this.hasChanged(),
            isValid: this.isValid(),
            val: null,  // no changes, just initializing
            id: null,   // ''
            index: null // ''
        };

        // Trickle-down event
        this.relayDependencyValueChange(frmChgEventArgs);

        // No bubble up for initialization
    },

    componentDidUpdate: function () {
        if ($ && this.props.info) {
            $('[data-toggle="tooltip"]').tooltip();
        }
    },

    /*************************************************************
     * EVENT HANDLING
     *************************************************************/
    handleChange: function (value, id, index) {
        // Assemble form change event args
        var frmChgEventArgs = {
            form: this.getForm(),
            hasChanged: this.hasChanged(),
            isValid: this.isValid(),
            val: value,
            id: id,
            index: index
        };

        // Trickle-down event
        this.relayDependencyValueChange(frmChgEventArgs);

        // Bubble-up event
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(frmChgEventArgs);
        }
    },

    /*************************************************************
     * RENDERING
     *************************************************************/
    render: function () {
        var errors, info, title;
        
        // Render title header
        if (this.props.title) {
            title = <h4>{this.props.title}</h4>;
        }

        // Render info tooltip
        if (this.props.info) {
            info = (<span className="glyphicon glyphicon-info-sign" data-toggle={this.props.info ? 'tooltip' : undefined} title={this.props.info} data-original-title={this.props.info} style={{float: 'right', fontSize: '1.2rem'}}></span>);
        }

        // Render errors
        if (this.state.errors.length > 0) {
            errors = (
                <div className="validation-summary-errors text-danger" dataValmsgSummary="true">
                    <ul>
                        {this.state.errors.map(function (error) {
                            return (
                                <li>{error}</li>
                            );
                        })}
                    </ul>
                </div>
            );
        }

        return (
            <form style={Object.assign({}, styles.form, this.props.style)} action={this.props.action || ''} className={this.props.className || 'form-horizontal'} method={this.props.method} role="form">
                {info}
                {title}
                {errors}
                {React.Children.map(this.props.children, function (child) {
                    // Don't wrap input groups and any children that don't have a field
                    if (child.type.displayName === 'InputGroup' || child.props.field === undefined) {
                        return React.cloneElement(child, this.getChildProps(child));
                    }
                    else {
                        return (<InputGroup>{React.cloneElement(child, this.getChildProps(child))}</InputGroup>);
                    }
                }.bind(this))}
                {/* hidden input included to ensure that the enter key submit quirk 
                that occurs when there is only one <input> in the form is avoided */}
                <input type="text" style={{display: 'none'}} />
            </form>
        );
    }
});

var styles = {
   form: {
       padding: '1rem'
   } 
};

export default InputForm;
