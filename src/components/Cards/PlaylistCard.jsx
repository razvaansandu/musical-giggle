"use client";

import styles from "./Card.module.css";
import { useRouter } from "next/navigation";

export default function PlaylistCard({ playlist, onClick, onContextMenu }) {
  const router = useRouter();
  
  if (!playlist) return null;
  const img = playlist?.images?.[0]?.url || "/default-playlist.png";

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (onContextMenu) {
      onContextMenu(e, playlist);
    }
  };

  if (onClick) {
    return (
      <button
        type="button"
        className={styles.card}
        onClick={() => onClick()}
        onContextMenu={handleContextMenu}
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

  return (
    <div 
      className={styles.card}
      onClick={() => router.push(`/playlist/${playlist.id}`)}
      onContextMenu={handleContextMenu}
      style={{ cursor: 'pointer' }}
    >
      <div
        className={styles.imageWrapper}
        style={{ backgroundImage: `url(${img})` }}
      />
      <h3 className={styles.title}>{playlist.name}</h3>
      <p className={styles.subtitle}>
        {playlist.tracks?.total || 0} songs
      </p>
    </div>
  );
}
