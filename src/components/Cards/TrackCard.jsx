"use client";

import styles from "./Card.module.css";

export default function TrackCard({ track }) {
  if (!track) return null;

  // Ottieni l'immagine della traccia o usa un'immagine di default
  const img = track?.album?.images?.[0]?.url || "/default-track.png";

  // Funzione per gestire il click sulla traccia
  const handlePlay = async () => {
    try {
      if (!track.uri) {
        console.warn("Nessuna URI per questa track:", track);
        return;
      }

      await fetch("/api/player/start-resume-playback", {
        method: "PUT",              //  se nel tuo route hai usato POST, cambia in "POST"
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: [track.uri],        // play solo quella traccia
        }),
      });
    } catch (err) {
      console.error("Errore avvio riproduzione", err);
    }
  };

  // Render della scheda della traccia
  return (
    <button
      type="button"
      className={styles.card}
      onClick={handlePlay}
    >
      {/* Immagine della traccia */}
      <div
        className={styles.imageWrapper}
        style={{ backgroundImage: `url(${img})` }}
      />
      <h3 className={styles.title}>{track.name}</h3>
      <p className={styles.subtitle}>
        {track.artists?.map((a) => a.name).join(", ") || "Unknown Artist"}
      </p>
    </button>
  );
}
