import React from 'react';

export default function YoutubePlayer(props) {
    return (
        <iframe
            id="ytplayer"
            title="YouTube Player"
            src={"https://www.youtube-nocookie.com/embed/" + props.vid + "?rel=0&amp;showinfo=0"}
            frameBorder="0"
            allow="encrypted-media"
            allowFullScreen>
        </iframe>
    );
}