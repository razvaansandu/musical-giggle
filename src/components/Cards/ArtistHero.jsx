"use client";
import { useState } from "react";
import styles from "./ArtistHero.module.css";

export default function ArtistHero({ artist }) {
  const [following, setFollowing] = useState(false);
  const [playing, setPlaying] = useState(false);

  if (!artist) return null;

  const name = artist.name;
  const listeners = artist.followers?.total;
  const image = artist.images?.[0]?.url || "/placeholder.png";
  const spotifyUrl = artist.external_urls?.spotify;
  const artistId = artist.id;

  const handlePlay = async () => {
    try {
      setPlaying(true);
      const res = await fetch(`/api/artist/top-tracks/${artistId}`);
      if (!res.ok) throw new Error("Errore nel caricamento delle tracce");
      
      const data = await res.json();
      const uris = data.tracks?.map(track => track.uri).filter(Boolean) || [];
      
      if (!uris.length) {
        console.error("Nessuna traccia trovata");
        setPlaying(false);
        return;
      }
      await fetch('/api/player/start-resume-playback', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uris }),
      });
    } catch (err) {
      console.error("Errore durante la riproduzione:", err);
      setPlaying(false);
    }
  };

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
          <button 
            className={styles.play} 
            onClick={handlePlay}
            disabled={playing}
          >
            {playing ? "Caricamento..." : "Play"}
          </button>
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