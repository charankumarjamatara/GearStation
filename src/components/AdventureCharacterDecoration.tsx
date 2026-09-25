import React, { useEffect, useRef } from 'react';
import './AdventureCharacterDecoration.css';
import adventureRiderVideo from '../assets/cute-elements1.mp4';

const AdventureCharacterDecoration: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.play().catch(() => {});
    }
  }, []);

  return (
    <div className="adventure-char-wrapper" aria-hidden="true" role="presentation">
      <div className="adventure-char-container">
        <div className="adventure-char-track-area">
          {/* Walking character with horizontal translation & smooth fade */}
          <div className="adventure-char-walker">
            <video
              ref={videoRef}
              className="adventure-char-video"
              src={adventureRiderVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>
          {/* Persistent Red Walking Line */}
          <div className="adventure-char-line"></div>
        </div>
      </div>
    </div>
  );
};

export default AdventureCharacterDecoration;
