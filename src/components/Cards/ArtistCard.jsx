"use client";

import styles from "./Card.module.css";
import { useRouter } from "next/navigation";

export default function ArtistCard({ artist, onClick, onContextMenu }) {
  const router = useRouter();
  
  if (!artist) return null;

  const img = artist?.images?.[0]?.url || "/default-artist.png";

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (onContextMenu) {
      onContextMenu(e, artist);
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
        >
          <img src={img} alt={artist.name} className={styles.artistImage} />
        </div>
        <h3 className={styles.title}>{artist.name}</h3>
        <p className={styles.subtitle}>Artist</p>
      </button>
    );
  }

  return (
    <div 
      className={styles.card}
      onClick={() => router.push(`/artist/${artist.id}`)}
      onContextMenu={handleContextMenu}
      style={{ cursor: 'pointer' }}
    >
      <div
        className={styles.imageWrapper}
      >
        <img src={img} alt={artist.name} className={styles.artistImage} />
      </div>
      <h3 className={styles.title}>{artist.name}</h3>
      <p className={styles.subtitle}>Artist</p>
    </div>
  );
} 
