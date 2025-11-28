"use client";
import styles from './buttons.module.css';
import { useState, useEffect } from 'react';

export default function StopButton({ isPlaying = false, onClick }) {
  const [isPlay, setIsPlay] = useState(isPlaying);

  useEffect(() => {
    setIsPlay(isPlaying);
  }, [isPlaying]);

  const handleClick = () => {
    const next = !isPlay;
    setIsPlay(next);
    if (onClick) onClick(next);
  };

  return (
    <button
      className={`${styles.playButton} play`}
      onClick={handleClick}
      type="button"
      aria-pressed={isPlay}
      title={isPlay ? "Pause" : "Play"}
    >
      {isPlay ? (
       
        <svg height="24" width="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"/>
        </svg>
      ) : (
       <svg height="24" width="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M5.7 3a.7.7 0 00-.7.7v16.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V3.7a.7.7 0 00-.7-.7H5.7zm10 0a.7.7 0 00-.7.7v16.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V3.7a.7.7 0 00-.7-.7h-2.6z"/>
        </svg>
        
      )}
    </button>
    
  );
}
