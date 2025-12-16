"use client";

import { useState } from "react";
import styles from "./SongDetailsModal.module.css";

export default function SongDetailsModal({ track, onClose }) {
  const [lyrics, setLyrics] = useState(null);
  const [loadingLyrics, setLoadingLyrics] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  if (!track) return null;

  const img = track.album?.images?.[0]?.url || "/default-track.png";
  const artistName = track.artists?.map((a) => a.name).join(", ") || "Unknown Artist";

  const handlePlay = async () => {
    try {
      if (!track.uri) {
        console.warn("Nessuna URI per questa traccia:", track);
        return;
      }

      await fetch("/api/player/start-resume-playback", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: [track.uri],
        }),
      });
      onClose();
    } catch (err) {
      console.error("Errore avvio riproduzione:", err);
    }
  };

  const handleLyrics = async () => {
    if (showLyrics) {
      setShowLyrics(false);
      return;
    }

    setShowLyrics(true);
    if (!lyrics) {
      setLoadingLyrics(true);
      try {
        const res = await fetch(`/api/lyrics?artist=${encodeURIComponent(track.artists?.[0]?.name)}&track=${encodeURIComponent(track.name)}`);
        const data = await res.json();
        setLyrics(data.lyrics || "Testo non disponibile.");
      } catch (error) {
        console.error("Error fetching lyrics:", error);
        setLyrics("Errore nel caricamento del testo.");
      } finally {
        setLoadingLyrics(false);
      }
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <div className={styles.header}>
          <img src={img} alt={track.name} className={styles.coverImage} />
          <div className={styles.info}>
            <h2 className={styles.title}>{track.name}</h2>
            <p className={styles.artist}>{artistName}</p>
            <p className={styles.album}>{track.album?.name}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.playButton} onClick={handlePlay}>
            <span>▶</span> Play
          </button>
          <button className={`${styles.lyricsButton} ${showLyrics ? styles.active : ''}`} onClick={handleLyrics}>
            Lyrics
          </button>
        </div>

        {showLyrics && (
          <div className={styles.lyricsContainer}>
            {loadingLyrics ? (
              <p className={styles.lyricsText}>Caricamento testo...</p>
            ) : (
              <pre className={styles.lyricsText}>{lyrics}</pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
