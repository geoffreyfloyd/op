import React from 'react';
import requestStore from '../../stores/request-store';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './Request.scss';
//import GooeyHost from '../gooeys/GooeyHost';

var Request = React.createClass({
    /*************************************************************
     * DEFINITIONS
     *************************************************************/
    propTypes: {
        data: React.PropTypes.object,
    },
    getInitialState: function () {
        return this.props.data;
    },

    /*************************************************************
     * COMPONENT LIFECYCLE
     *************************************************************/
    componentDidMount: function () {
        requestStore.subscribe(this.handleStoreUpdate, this.props.data.id);
    },
    componentWillUpdate: function () {
        if (this.refs.responseContainer) {
            var node = this.refs.responseContainer;
            this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
        }
    },
    componentDidUpdate: function () {
        if (this.shouldScrollBottom) {
            var node = this.refs.responseContainer;
            node.scrollTop = node.scrollHeight;
        }
    },

    /*************************************************************
     * EVENT HANDLING
     *************************************************************/
    handleRequestClick: function () {
        var data = this.props.data;
        requestStore.repeat(data.id);
    },
    handleResponseClick: function () {
        var data = this.props.data;
        if (data.response) {
            console.log(data.response.result);
        }
    },
    handleStoreUpdate: function () {
        this.setState({
            ts: (new Date()).toISOString()
        });
    },
    handleRequestHoverChange: function (hovering) {
        this.setState({
            requestHovering: hovering
        });
    },

    /*************************************************************
    * RENDERING
    *************************************************************/
    renderTextResponse: function () {
        var data = this.props.data;
        if (!data.response.result) {
            return null;
        }
        var response = [];
        var lines = data.response.result.split('\r\n');
        lines.map(function (line, index) {
            response.push(<div key={index}><span>{line}</span></div>);
            // response.push(<br />);
        });
        return response;
    },
    renderHtmlResponse: function () {
        var data = this.props.data;
        if (!data.response.result) {
            return null;
        }
        var html = data.response.result;

        return (<span dangerouslySetInnerHTML={{__html: html}}></span>);
    },
    renderJsonResponse: function () {
        var data = this.props.data;
        if (!data.response.result) {
            return null;
        }
        var obj = typeof data.response.result === 'string' ? JSON.parse(data.response.result) : data.response.result;
        //var display = obj.mobileview.sections[0].text;

        // for (var prop in obj.query.pages) {
        //     if (obj.query.pages.hasOwnProperty(prop)) {
        //         display = obj.query.pages[prop].revisions[0]['*'];
        //         break;
        //     }
        // }
        return <span dangerouslySetInnerHTML={{__html: JSON.stringify(obj)}}></span>;
    },
   //  renderGooeyResponse: function () {
   //      var data = this.props.data;
   //      if (!data.response.result) {
   //          return null;
   //      }
   //      return (<GooeyHost gooey={data.response.result} />);
   //  },
    render: function () {
        var cmd, response;
        var data = this.props.data;

        /**
         * Text style based on status of request
         */
        var statusStyle = styles.waiting;
        if (data.response && data.response.status === 'OK') {
            if (data.context.processId) {
                // in a process - still expecting more responses
                statusStyle = styles.inprocess;
            }
            else {
                statusStyle = styles.ok;
            }
        }
        else if (data.response && data.response.status === 'ERR') {
            statusStyle = styles.err;
        }

        /**
         * Response media
         */
        if (data.response) {
            if (data.response.type === 'text') {
                response = this.renderTextResponse();
            }
            else if (data.response.type === 'json') {
                response = this.renderJsonResponse();
            }
            else if (data.response.type === 'html') {
                response = this.renderHtmlResponse();
            }
            // else if (data.response.type === 'gooey') {
            //     response = this.renderGooeyResponse();
            // }
        }
        response = <div ref="responseContainer" className={styles.response + ' ' + styles.scroll}>{response}</div>;

        cmd = [];
        if (data.cmd) {
            cmd.push(<span ref="cmd" className={statusStyle} onClick={this.handleRequestClick}>{this.state.cmd}</span>);
            cmd.push(<br />);
        }

        return (
            <div title={this.state.date} className={styles.container}>
                {cmd}
                {response}
            </div>
        );
    }
});

export default withStyles(Request, styles);
