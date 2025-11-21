"use client";

import styles from "./Card.module.css";
import { playTrack } from "../../lib/webPlayer";

export default function TrackCard({ track }) {
  if (!track) return null;

  const img = track?.album?.images?.[0]?.url || "/default-track.png";

  

  const handlePlay = async () => {
  if (!track.uri) return console.warn("Track senza URI!", track);
  await playTrack(track.uri);
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
