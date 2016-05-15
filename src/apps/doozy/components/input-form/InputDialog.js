import React from 'react';
import FormMixin from './FormMixin';
import LabelMixin from './LabelMixin';
import InputGroup from './InputGroup';
        
var InputDialog = React.createClass({
    /*************************************************************
     * DEFINITIONS
     *************************************************************/
    mixins: [FormMixin, LabelMixin],
    propTypes: {
        // OPTIONAL
        info: React.PropTypes.string, // popup tooltip message
        title: React.PropTypes.string, // title of dialog
        toggleButton: React.PropTypes.element, // An element to use to toggle the dialog
    },

    getInitialState: function () {
        return {
            show: false
        };
    },

    /*************************************************************
     * PUBLIC METHODS
     *************************************************************/
    toggle: function () {
        if (this.isMounted()) {
            this.setState({
                show: !this.state.show
            });
        }
    },

    /*************************************************************
     * EVENT HANDLING
     *************************************************************/
    handleDialogClick: function (e) {
        // Toggle it closed
        this.toggle();

        // Prevent form submit
        e.preventDefault();
    },

    /*************************************************************
     * RENDERING
     *************************************************************/
    getInputStyle: function (index) {
        var propName = 'styleInput' + String(index + 1);
        var style = this.props[propName];
        if (style) {
            return style;
        }
        else {
            return;
        }
    },

    render: function () {
        var toggleButton, info, title;
        var unique = (this.props.field || 'dlg-grp') + '_' + (this.props.bindingContext && this.props.bindingContext._rowIndex !== undefined ? this.props.bindingContext._rowIndex : '');
        
        // Render toggle button
        if (this.props.toggleButton) {
            toggleButton = React.cloneElement(this.props.toggleButton, { key: unique + '_toggle', onClick: this.handleDialogClick });
        }

        // Render title header
        if (this.props.title) {
            title = <h4 key={unique + '_title'}>{this.props.title}</h4>;
        }

        // Render info tooltip
        if (this.props.info) {
            info = (<span key={unique + '_info'}className="glyphicon glyphicon-info-sign" data-toggle={this.props.info ? 'tooltip' : undefined} title={this.props.info} data-original-title={this.props.info} style={{float: 'right', fontSize: '1.2rem'}}></span>);
        }
        
        return (
            <div>
                {toggleButton}
                <div style={Object.assign((this.state.show ? {} : {display: 'none'}), styles.backdrop)}>
                    <div style={styles.container}>
                        {info}{title}
                        {this.renderLabel(
                            React.Children.map(this.props.children, function (child, index) {
                                // Wrap the Inputs in InputGroup containers
                                return (<InputGroup key={unique + '_' + index}>{React.cloneElement(child, this.getChildProps(child))}</InputGroup>);
                            }.bind(this))
                        )}
                        <button key={unique + '_addbtn'} type="button" style={{width: '40%', fontSize: '1.2rem'}} onClick={this.handleDialogClick}>OK</button>
                    </div>
                </div>
            </div>
        );
    }
});

/*************************************************************
 * STYLES
 *************************************************************/
var styles = {
    backdrop: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        zIndex: '101'
    },
    container: {
        fontSize: '2rem',
        borderRadius: '1rem',
        backgroundColor: '#fafafa',
        position: 'relative',
        margin: '2rem auto',
        padding: '2rem',
        maxWidth: '40rem'
    }
};

export default InputDialog;
