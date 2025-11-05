"use client";
import { useState } from "react";
import styles from "./ArtistHero.module.css";
/* Componente Hero per la pagina artista */
export default function ArtistHero({ name, listeners, image, spotifyUrl }) {
  const [following, setFollowing] = useState(false);
/* Rendering del componente Hero */
  return (
    <header
      className={styles.hero}
      style={{ backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/d/d8/Linkin_Park_-_From_Zero_Lead_Press_Photo_-_James_Minchin_III.jpg')` }}
      role="banner"
    >
      {/* Overlay per l'effetto visivo */}
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.badge} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="#1db954" aria-hidden="true">
            <path d="M12 0a12 12 0 1 0 .001 24.001A12 12 0 0 0 12 0zm-1.2 17.1l-4.8-4.8 1.6-1.6 3.2 3.2 6.4-6.4 1.6 1.6-8 8z" />
          </svg>
          <span>Artista verificato</span>
        </div>

        <h1 className={styles.title}>{name}</h1>
        {/* Sottotitolo con numero di ascoltatori mensili */}
        <p className={styles.subtitle}>
          <span>{listeners?.toLocaleString()} ascoltatori mensili</span>
        </p>

        <div className={styles.actions}>
          <a className={styles.play} href={spotifyUrl} target="_blank" rel="noreferrer">
            Play
          </a>
          {/* Bottone per seguire o smettere di seguire l'artista */}
          <button
            className={styles.follow}
            onClick={() => setFollowing((s) => !s)}
            aria-pressed={following}
          >
            {following ? "Seguito" : "Segui"}
          </button>
        </div>
      </div>
    </header>
  );
}