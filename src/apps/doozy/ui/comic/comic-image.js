import React from 'react';

export default class ComicImage extends React.Component {
    render() {
        return (
            <div style={styles.container}>
               <img style={styles.image} src={this.props.src} onClick={this.props.onClick} />
            </div>
        );
    }
}

const styles = {
    container: {
        background: 'white',
        height: '100%',
        width: '100%',
        textAlign: 'center',
    },
    image: {
        display: 'block',
        verticalAlign: 'middle',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxHeight: '100%',
        maxWidth: '100%',
        
    },
};
