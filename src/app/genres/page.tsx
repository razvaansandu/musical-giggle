"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/apiClient";

import styles from "./genres.module.css";

export default function GenresPage() {
  const [genres, setGenres] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    api.categories.list().then(setGenres).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selected) return;
    api.recommendations.byGenre(selected).then(setTracks).catch(console.error);
  }, [selected]);

  return (
    <main className={styles.container}>
      <h1>Genres & Moods</h1>
      <p className={styles.subtitle}>Pick a genre and discover fresh tracks</p>

      <div className={styles.grid}>
        {genres.map(cat => (
          <button
            key={cat.id}
            className={`${styles.genreCard} ${
              selected === cat.id ? styles.genreCardActive : ""
            }`}
            onClick={() => setSelected(cat.id)}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {selected && (
        <section className={styles.tracksSection}>
          <h2>Recommended for {selected}</h2>
          <div className={styles.tracksGrid}>
            {tracks.map(track => (
              <div key={track.id} className={styles.trackCard}>
                <img
                  src={track.album.images?.[0]?.url}
                  className={styles.trackCover}
                />
                <h3>{track.name}</h3>
                <p>{track.artists.map(a => a.name).join(", ")}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
