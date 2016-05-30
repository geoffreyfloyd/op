import React from 'react';
import FormMixin from './FormMixin';
import LabelMixin from './LabelMixin';

var InputGroup = React.createClass({
    /*************************************************************
     * DEFINITIONS
     *************************************************************/
    mixins: [FormMixin, LabelMixin],

    getInitialState: function () {
        return {
            visible: true
        };
    },

    /*************************************************************
     * API
     *************************************************************/
    setVisible: function (value) {
        if (this.isMounted()) {
            this.setState({
                visible: value
            });
        }
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
        if (React.Children.count(this.props.children) === 1) {
            return (
                <div style={Object.assign({}, styles.formGroup, this.state.visible ? {} : styles.hide)}>
                    {React.Children.map(this.props.children, function (child) {
                        return React.cloneElement(child, { handleVisible: this.setVisible });
                    }.bind(this))}
                </div>
            );
        }
        else {
            return (
                <div style={Object.assign({}, styles.formGroup, this.state.visible ? {} : styles.hide)}>
                    {this.renderLabel(
                        <div className="input-group" style={this.props.style}>
                            {React.Children.map(this.props.children, function (child, index) {
                                return (
                                    <div className="input-group-addon" style={Object.assign({padding: 0}, this.props.styleInput, this.getInputStyle(index))}>
                                        {React.cloneElement(child, Object.assign({}, this.getChildProps(child), { handleVisible: this.setVisible }))}
                                    </div>
                                );
                            }.bind(this))}
                        </div>
                    )}
                </div>
            );
        }
    }
});

/*************************************************************
 * STYLES
 *************************************************************/
var styles = {
    formGroup: {
        marginBottom: '15px'
    },
    hide: {
        display: 'none'
    }
};

export default InputGroup;
