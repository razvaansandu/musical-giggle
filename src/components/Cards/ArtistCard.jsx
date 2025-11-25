"use client";

import Link from "next/link";
import styles from "./Card.module.css";

export default function ArtistCard({ artist }) {
  if (!artist) return null;

  const img = artist?.images?.[0]?.url || "/default-artist.png";

  return (
    <Link href={`/artist/${artist.id}`} className={styles.card}>
      <div
        className={styles.imageWrapper}
        style={{
          backgroundImage: `url(${img})`,
          borderRadius: "50%",
        }}
      />
      <h3 className={styles.title}>{artist.name}</h3>
      <p className={styles.subtitle}>Artist</p>
    </Link>
  );
} 
