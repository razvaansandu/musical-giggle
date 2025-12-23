"use client";

import Link from "next/link";
import styles from "./Card.module.css";
import { useRouter } from "next/navigation";

export default function AlbumCard({ album, onClick, onContextMenu }) {
  const router = useRouter();
  
  if (!album) return null;

  const img = album?.images?.[0]?.url || "/default-album.png";

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (onContextMenu) {
      onContextMenu(e, album);
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
        <h3 className={styles.title}>{album.name}</h3>
        <p className={styles.subtitle}>
          {album.artists?.map((a) => a.name).join(", ")}
        </p>
      </button>
    );
  }

  return (
    <div 
      className={styles.card}
      onClick={() => router.push(`/album/${album.id}`)}
      onContextMenu={handleContextMenu}
      style={{ cursor: 'pointer' }}
    >
      <div
        className={styles.imageWrapper}
        style={{ backgroundImage: `url(${img})` }}
      />
      <h3 className={styles.title}>{album.name}</h3>
      <p className={styles.subtitle}>
        {album.artists?.map((a) => a.name).join(", ")}
      </p>
    </div>
  );
}
