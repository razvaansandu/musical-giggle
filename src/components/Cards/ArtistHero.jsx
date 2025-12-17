"use client";
import { useState } from "react";
import styles from "./ArtistHero.module.css";

export default function ArtistHero({ artist }) {
  const [following, setFollowing] = useState(false);

  if (!artist) return null;

  const name = artist.name;
  const listeners = artist.followers?.total;
  const image = artist.images?.[0]?.url || "/placeholder.png";
  const spotifyUrl = artist.external_urls?.spotify;

  return (
    <header className={styles.hero} role="banner">
      <div className={styles.imageContainer}>
        <img src={image} alt={name} className={styles.heroImage} />
      </div>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>{name}</h1>

        <p className={styles.subtitle}>
          <span>{listeners?.toLocaleString()} ascoltatori mensili</span>
        </p>   

        <div className={styles.actions}>
          <a className={styles.play} href={spotifyUrl} target="_self" rel="noreferrer">
            Play 
          </a>
          <button
            className={styles.follow}
            onClick={() => setFollowing((s) => !s)}
            aria-pressed={following}
          >
            {following ? "Segui già" : "Segui"}
          </button>
        </div>
      </div>
    </header>
  );
}