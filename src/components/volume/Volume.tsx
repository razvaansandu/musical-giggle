import styles from './volume.module.css';
import { useState, useRef } from 'react';

export default function VolumeButton() {
  const [volume, setVolume] = useState(75);
  const prevVolume = useRef(75);

  function toggleMute() {
    if (volume > 0) {
      prevVolume.current = volume;
      setVolume(0);
    } else {
      setVolume(prevVolume.current || 75);
    }
  }

  return (
    <div className={styles.volumeWrapper}>
      <button
        className={styles.volumeButton}
        onClick={toggleMute}
        aria-label={volume === 0 ? 'Unmute' : 'Mute'}
        title={volume === 0 ? 'Unmute' : 'Mute'}
      >
        {volume === 0 ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 9v6h4l5 5V4l-5 5H5z" fill="currentColor" />
            <line x1="16" y1="8" x2="20" y2="16" stroke="currentColor" strokeWidth="2" />
            <line x1="20" y1="8" x2="16" y2="16" stroke="currentColor" strokeWidth="2" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 9v6h4l5 5V4l-5 5H5z" fill="currentColor" />
            <path d="M15.5 12c0-1.5-.9-2.8-2.2-3.4v6.8c1.3-.6 2.2-1.9 2.2-3.4z" fill="currentColor" />
            <path d="M17.5 12c0 2.2-1.3 4.1-3.2 4.9v-9.8c1.9.8 3.2 2.7 3.2 4.9z" fill="currentColor" />
          </svg>
        )}
      </button>

      <div className={styles.volumePopover} role="group" aria-label="Volume control">
        <div className={styles.sliderContainer}>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className={styles.volumeSlider}
            aria-label="Volume slider"
          />
        </div>
      </div>
    </div>
  );
}