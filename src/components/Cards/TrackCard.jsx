"use client";

import styles from "./Card.module.css";

export default function TrackCard({ track, onClick }) {
  if (!track) return null;

  const img = track?.album?.images?.[0]?.url || "/default-track.png";

  const handleClick = () => {
    console.log("Track clicked:", track.id);
    debugger
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      type="button"
      className={styles.card}
      onClick={handleClick}
    >
      <div
        className={styles.imageWrapper}
        style={{ backgroundImage: `url(${img})` }}
      />       <h3 className={styles.title}>{track.name}</h3>
      <p className={styles.subtitle}>
        {track.artists?.map((a) => a.name).join(", ") || "Unknown Artist"}
      </p>
    </button>
  );
}
