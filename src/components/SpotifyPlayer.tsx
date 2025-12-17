"use client";

import React from "react";
import { useSpotify } from "../context/SpotifyContext";
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart } from "lucide-react";
import styles from "./SpotifyPlayer.module.css";

export default function SpotifyPlayer() {
  const {
    isReady,
    isPlaying,
    isPremium,
    currentTrack,
    position,
    duration,
    volume,
    togglePlayPause,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
  } = useSpotify();

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isPremium) {
    return (
      <div className={styles.playerContainer}>
        <div className={styles.freeTierMessage}>
          <h2>🎵 Web Playback Non Disponibile</h2>
          <p>Su iPhone/iPad devi usare l'app Spotify ufficiale.</p>
          <p>Su desktop, fai l'upgrade a Premium.</p>
          <a href="https://www.spotify.com/premium" target="_blank" rel="noopener noreferrer">
            Upgrade
          </a>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className={styles.playerContainer}>
        <div className={styles.loadingMessage}>
          <p>⏳ Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.playerContainer}>
      <div className={styles.trackInfo}>
        {currentTrack ? (
          <>
            <div className={styles.trackImage}>
              {currentTrack.album?.images?.[0]?.url && (
                <img src={currentTrack.album.images[0].url} alt={currentTrack.name} />
              )}
            </div>
            <div className={styles.trackDetails}>
              <h3 className={styles.trackName}>{currentTrack.name}</h3>
              <p className={styles.trackArtist}>
                {currentTrack.artists?.map((a) => a.name).join(", ")}
              </p>
            </div>
            <button className={styles.likeButton} title="Aggiungi ai Mi piace">
              <Heart size={20} />
            </button>
          </>
        ) : (
          <p className={styles.noTrack}>Nessun brano</p>
        )}
      </div>

      {currentTrack && (
        <div className={styles.progressContainer}>
          <span className={styles.time}>{formatTime(position)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={position || 0}
            onChange={(e) => seek(Number(e.target.value))}
            className={styles.progressBar}
          />
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>
      )}

      <div className={styles.controls}>
        <button onClick={previousTrack} className={styles.controlButton} title="Precedente">
          <SkipBack size={24} />
        </button>
        <button
          onClick={togglePlayPause}
          className={`${styles.controlButton} ${styles.playButton}`}
          title={isPlaying ? "Pausa" : "Play"}
        >
          {isPlaying ? <Pause size={32} /> : <Play size={32} />}
        </button>
        <button onClick={nextTrack} className={styles.controlButton} title="Prossimo">
          <SkipForward size={24} />
        </button>
      </div>

      <div className={styles.volumeContainer}>
        <Volume2 size={20} />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className={styles.volumeSlider}
        />
        <span className={styles.volumeLabel}>{volume}%</span>
      </div>
    </div>
  );
}
