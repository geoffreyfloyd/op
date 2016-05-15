import React from 'react';

var LabelMixin = {
    /*************************************************************
     * DEFINITIONS
     *************************************************************/
    propTypes: {
        label: React.PropTypes.string,
        labelExplain: React.PropTypes.string,
        labelStyle: React.PropTypes.object,
        id: React.PropTypes.string,
    },

    /*************************************************************
     * COMPONENT LIFECYCLE
     *************************************************************/
    componentDidUpdate: function () {
        if ($ && (this.props.labelExplain || this.props.info)) {
            $('[data-toggle="tooltip"]').tooltip();
        }
    },

    /*************************************************************
     * METHOD
     *************************************************************/
    renderLabel: function (rendered) {
        if (this.props.label) {

            return (
                <div style={styles.fieldWrap}>
                    <label data-toggle={this.props.labelExplain ? 'tooltip' : undefined} style={Object.assign({}, styles.controlLabel, this.props.labelStyle)} title="" data-original-title={this.props.labelExplain} htmlFor={this.props.field }>{this.props.label}</label>
                    <div style={styles.inputArea}>
                        {rendered}
                    </div>
                </div>
            );
        }
        else {
            return rendered;
        }
    },
};

var styles = {
    
    controlLabel: {
        width: '10rem',
        paddingTop: '0.45rem',
        paddingRight: '1rem',
        marginBottom: '0',
        textAlign: 'right',
    },
    fieldWrap: {
        display: 'flex'
    },
    inputArea: {
        flex: '1'
    }
}

export default LabelMixin;
