// src/components/VideoPlayer.jsx
import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const VideoPlayer = ({ src, poster, alt }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if the browser supports HLS natively (e.g., Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native support, no need for hls.js
      video.src = src;
    } else if (Hls.isSupported()) {
      // Use hls.js to play the stream
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      
      // Cleanup on component unmount
      return () => {
        hls.destroy();
      };
    } else {
        console.error("This browser does not support HLS playback.");
    }
  }, [src]); // Re-run effect if the video src changes

  return (
    <video
      ref={videoRef}
      poster={poster}
      controls
      playsInline
      className="bluesky-video"
      aria-label={alt || 'Embedded video'}
    >
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;