import React from 'react';
import ComicAnimation from './comic-animation';
import ComicImage from './comic-image';
import ComicCaption from './comic-caption';
import ComicVideo from './comic-video';
import ComicText from './comic-text';
import those from 'those';
import ReactDOM from 'react-dom';

export default class ComicPane extends React.Component {
    constructor (props) {
        super(props);
        this.handleMediaClick = this.handleMediaClick.bind(this);
        this.handleClearFocusClick = this.handleClearFocusClick.bind(this);
        this.state = {
            focusOn: null,
        };
    }
    
    componentDidUpdate () {
        if (this.props.active) {
            // Scroll into view
            ReactDOM.findDOMNode(this).scrollIntoView(true);
        }
    }
    
    handleMediaClick (kind) {
        // Give attention to this media item, and get others out of the way
        this.setState({
            focusOn: kind,
        });
    }
    
    handleClearFocusClick () {
        this.setState({
            focusOn: null,
        });
    }
    
    arrangeMedia () {
        var media;
        var images = [];
        var texts = [];
        var videos = [];
        
        // Inject click handler to manage media focus
        var clones = React.Children.map(this.props.children, (child, index) => {
            var props = {
                key: index,
                uri: this.props.uri,
                active: this.props.active,
                onDone: this.props.onDone,
            };
            
            var kind;
            var { focusOn } = this.state;
            if (child.type === ComicImage) {
                kind = 'image';
            }
            else if (child.type === ComicVideo) {
                kind = 'video';
            }
            else if (child.type === ComicText) {
                kind = 'text';
            }
            props.onClick = this.handleMediaClick.bind(null, kind);
            
            return React.cloneElement(child, props)
        });
        
        // Organize the kinds of media into categories
        React.Children.forEach(clones, child => {
            if (child.type === ComicImage) {
                images.push(child);
            }
            else if (child.type === ComicVideo) {
                videos.push(child);
            }
            else if (child.type === ComicText) {
                texts.push(child);
            }
        });

        if (images.length > 1) {
            media = [
                (<ComicAnimation fps={0.5}>{images}</ComicAnimation>),
                ...videos,
                ...texts,
            ];
        }
        else {
            media = [
                ...images,
                ...videos,
                ...texts,
            ];    
        }
        
        return media;
    }
    
    renderPane() {
        var inactiveOverlay;
        if (!this.props.active) {
           inactiveOverlay = <div style={styles.inactive} onClick={this.props.onClick} />;
        }

        return (
            <div style={styles[this.props.mode]}>
                <div style={styles.pane} onClick={this.handlePaneClick}>
                    {this.arrangeMedia()}
                </div>
                <ComicCaption>{this.props.caption}</ComicCaption>
                {inactiveOverlay}
            </div>
        );

    }
    
    render() {
        return this.renderPane();
    }
}

const styles = {
    pane: {
        height: '20rem',
        width: '30rem',
        margin: '0.25rem',
        background: '#ddd',
    },
    pan: { 
        position: 'relative',
        display: 'inline' 
    },
    feed: {
        position: 'relative',
        display: 'block' 
    },
    wrap: {
        position: 'relative',
    },
    inactive: {
        cursor: 'pointer',
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 100,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    }
};
