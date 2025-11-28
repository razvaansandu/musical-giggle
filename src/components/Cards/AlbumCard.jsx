"use client";

import Link from "next/link";
import styles from "./Card.module.css";

export default function AlbumCard({ album, onClick }) {
  if (!album) return null;

  const img = album?.images?.[0]?.url || "/default-album.png";

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
        <h3 className={styles.title}>{album.name}</h3>
        <p className={styles.subtitle}>
          {album.artists?.map((a) => a.name).join(", ")}
        </p>
      </button>
    );
  }

  return (
    <Link href={`/album/${album.id}`} className={styles.card}>
      <div
        className={styles.imageWrapper}
        style={{ backgroundImage: `url(${img})` }}
      />
      <h3 className={styles.title}>{album.name}</h3>
      <p className={styles.subtitle}>
        {album.artists?.map((a) => a.name).join(", ")}
      </p>
    </Link>
  );
}
