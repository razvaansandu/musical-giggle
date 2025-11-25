"use client";

import Link from "next/link";
import styles from "./Card.module.css";

export default function PlaylistCard({ playlist, onClick }) {
  if (!playlist) return null;
// Ottieni l'immagine della playlist o usa un'immagine di default
  const img = playlist?.images?.[0]?.url || "/default-playlist.png";

  // Se onClick è fornito, usa button; altrimenti usa Link
  if (onClick) {
    return (
      <button
        type="button"
        className={styles.card}
        onClick={() => onClick()}
      >
        <div
          className={styles.imageWrapper}
          style={{ backgroundImage: `url(${img})` }}
        />
        <h3 className={styles.title}>{playlist.name}</h3>
        <p className={styles.subtitle}>
          {playlist.tracks?.total || 0} songs
        </p>
      </button>
    );
  }

  // Render della scheda della playlist
  return (
    <Link href={`/playlist/${playlist.id}`} className={styles.card}>
      <div
        className={styles.imageWrapper}
        style={{ backgroundImage: `url(${img})` }}
      />
      <h3 className={styles.title}>{playlist.name}</h3>
      <p className={styles.subtitle}>
        {playlist.tracks?.total || 0} songs
      </p>
    </Link>
  );
}
