"use client";

import styles from "./Card.module.css";

export default function TrackCard({ track }) {
  if (!track) return null;

  const img = track?.album?.images?.[0]?.url || "/default-track.png";

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
          uris: [track.uri],   // ✔ usa la tua API corretta
        }),
      });

    } catch (err) {
      console.error("Errore avvio riproduzione:", err);
    }
  };

  return (
    <button
      type="button"
      className={styles.card}
      onClick={handlePlay}
    >
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
