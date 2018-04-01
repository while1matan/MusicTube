import React from 'react';
import './Marquee.css';

export default function Marquee(props){
    return (
        <div className="marquee">
            <span>{props.text}</span>
        </div>
    );
}