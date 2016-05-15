/**
 * ContentEditable
 */
(function (factory) {
    module.exports = exports = factory(
        require('react'),
        require('react-addons-pure-render-mixin'),
    );
}(function (React, PureRenderMixin) {
    var ContentEditable = React.createClass({
        /***********************************
        * DEFINITIONS
        ***********************************/
        mixins: [PureRenderMixin],

        /***********************************
        * EVENT HANDLING
        ***********************************/
        emitChange: function () {
            var html = this.getDOMNode().innerHTML;
            if (this.props.onChange && html !== this.lastHtml) {
                var brPattern = /<br\/>|<br>/g;
                var spPattern = /&nbsp;/g; // Non-breaking space
                this.props.onChange({
                    target: {
                        id: this.props.id || null,
                        value: (html || '').replace(brPattern, '\n').replace(spPattern, ' ')
                    }
                });
            }
            this.lastHtml = html;
        },

        /***********************************
        * RENDERING
        ***********************************/
        render: function () {
            var newlinePattern = /\n/g;
            var value = (this.props.html || '').replace(newlinePattern, '<br/>');
            return (
                <div
                    style={Object.assign({display: 'inline'}, this.props.style)}
                    onInput={this.emitChange}
                    onBlur={this.emitChange}
                    contentEditable
                    dangerouslySetInnerHTML={{__html: value}}></div>
            );
        }
    });

    return ContentEditable;
}));
