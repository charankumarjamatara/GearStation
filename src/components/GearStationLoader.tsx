import React, { useEffect, useState, useRef } from 'react';
import logoImg from '../assets/logo_gearstation.jpg';
import './GearStationLoader.css';

interface GearStationLoaderProps {
  onComplete?: () => void;
  minDuration?: number; // Minimum display duration in ms (default 1800ms)
}

export const GearStationLoader: React.FC<GearStationLoaderProps> = ({
  onComplete,
  minDuration = 1800
}) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'exiting' | 'hidden'>('loading');
  const startTimeRef = useRef(Date.now());
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let animationFrameId: number;

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const linearRatio = Math.min(elapsed / minDuration, 1);

      // Smooth progressive easing: continuous gradual increase to 100%
      const eased = Math.min(100, Math.round((1 - Math.pow(1 - linearRatio, 2.2)) * 100));
      setProgress(eased);

      if (linearRatio < 1) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        // Start graceful reveal transition
        const exitTimer = setTimeout(() => {
          setPhase('exiting');
          const removeTimer = setTimeout(() => {
            setPhase('hidden');
            if (onCompleteRef.current) {
              onCompleteRef.current();
            }
          }, 450);
          return () => clearTimeout(removeTimer);
        }, 160);
        return () => clearTimeout(exitTimer);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [minDuration]);

  if (phase === 'hidden') {
    return null;
  }

  return (
    <div 
      className={`gs-loader-overlay ${phase === 'exiting' ? 'gs-loader-exit' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy={phase === 'loading'}
      aria-label="Loading Gear Station.co"
    >
      <div className="gs-loader-stage">
        
        {/* Static Brand Logo */}
        <div className="gs-logo-container">
          <div className="gs-logo-wrap">
            <img 
              src={logoImg} 
              alt="Gear Station.co" 
              className="gs-logo-img" 
            />
          </div>
        </div>

        {/* Progress Bar & Status Text */}
        <div className="gs-loader-bottom">
          <div className="gs-progress-track-wrapper">
            <div 
              className="gs-progress-bar-fill" 
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
          <span className="gs-loader-msg">
            LOADING YOUR NEXT ADVENTURE...
          </span>
        </div>

      </div>
    </div>
  );
};

export default GearStationLoader;
