"use client";

import Link from "next/link";
import styles from "./Card.module.css";

export default function AlbumCard({ album }) {
  if (!album) return null;

  const img = album?.images?.[0]?.url || "/default-album.png";

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
