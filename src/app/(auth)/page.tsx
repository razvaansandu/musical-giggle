'use client';
import { useState, useRef } from 'react';
import styles from './home/home.module.css';
import SpotifyHeader from 'components/SpotifyHeader'; 
import MiniCard from 'components/MiniCard';

// Componente principale 
function MainContent() { 
  return (
    <main className={styles.mainContent}>
      <div className={styles.recentlyPlayed}>
      </div>
    </main> 
  );
}

// funzione del volume
function VolumeButton() {
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
          //bottone mutato
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

export default function Home() { 
  return (
    <div className={styles.container}>
      
      <div className={styles.content}>

        {/* Prime 3 icone del menu */} 
        <nav className={styles.sidebar}>
          <div className={styles.menu}>
            <div className={styles.menuItem}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z" fill="currentColor"/>
              </svg> 
              <span>Home</span>
            </div>
            <div className={styles.menuItem}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z" fill="currentColor"/>
              </svg>
              <span>Search</span>
            </div>
            <div className={styles.menuItem}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M14.5 2.134a1 1 0 0 1 1 0l6 3.464a1 1 0 0 1 .5.866V21a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V3a1 1 0 0 1 .5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H3zm1-2h4V4H4v16z" fill="currentColor"/>
              </svg>
              <span>Your Library</span>
            </div>
          </div>
          <div className={styles.playlists}>
            { /* Icone del menu Playlist */ }
            <h2>Playlists</h2>
            <div className={styles.playlistItem}>
              <div className={styles.createPlaylist}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z" fill="currentColor"/>
                </svg>
                <span>Create Playlist</span>
              </div>
            </div>
          </div>
        </nav>

        <main className={styles.mainContent}>
          {/* array playlist */}
          <section className={styles.section}>
            <h2>Recently played</h2>
            <div className={styles.grid}>
              {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                <div key={item} className={styles.card}>
                  <div className={styles.cardImage}></div>
                  <div className={styles.cardContent}>
                    <h3>Playlist {item}</h3>
                    <p>Description</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* array daily mix */}
          <section className={styles.section}>
            <h2>Made for you</h2>
            <div className={styles.grid}>
              {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                <div key={item} className={styles.card}>
                  <div className={styles.cardImage}></div>
                  <div className={styles.cardContent}>
                    <h3>Daily Mix {item}</h3>
                    <p>custom mix</p>
                  </div>
                </div> 
              ))}
            </div>
          </section>
          {/* Funzine bottone volume */} 
          </main> 
      </div>
      <MiniCard> </MiniCard>
    </div>
  );
}
 