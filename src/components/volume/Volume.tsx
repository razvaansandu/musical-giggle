import styles from './volume.module.css';
import { useState, useEffect, useRef } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

export default function VolumeButton() {
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(50);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      try {
        const volToSend = isMuted ? 0 : volume;
        await fetch(`/api/player/set-volume?volume_percent=${volToSend}`, {
          method: 'PUT',
        });
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    }, 200); 
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [volume, isMuted]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = Number(e.target.value);
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
    if (newVol === 0) {
      setIsMuted(true);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume || 50);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const getIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={20} strokeWidth={1.5} />;
    if (volume < 50) return <Volume1 size={20} strokeWidth={1.5} />;
    return <Volume2 size={20} strokeWidth={1.5} />;
  };

  return (
    <div className={styles.container}>
      <button 
        className={styles.iconButton} 
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {getIcon()}
      </button>
      
      <div className={styles.sliderContainer}>
        <input
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className={styles.slider}
          style={{
            '--volume-percent': `${isMuted ? 0 : volume}%`
          } as React.CSSProperties}
          aria-label="Volume"
        />
      </div>
    </div>
  ); 
} 