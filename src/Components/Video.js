import React from 'react'
import ReactDOM from 'react-dom';
import './Video.css'

// videos shown in posts are handled separately
function Video(props) {
  // click on particular video will toggle mute status , default all videos are muted
    const handleClick = (e) => {
      e.preventDefault();
      e.target.muted = !e.target.muted;
    }
    // when video ends, automatially next video will starts to play
    const handleScroll = (e) => {
      let next = ReactDOM.findDOMNode(e.target).parentNode.nextSibling
      if(next){
        next.scrollIntoView()
        e.target.muted = true
      }
    }
  return (
    <video src={props.src} onEnded={handleScroll} className="videos-styling" muted="muted" onClick={handleClick}>
    </video>
  )
}

export default Video