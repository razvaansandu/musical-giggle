"use client";

import { useEffect, useState } from "react";
import styles from "./artist.module.css";
import { api } from "../../../lib/apiClient";

export default function ArtistPage({ params }) {
  const { id } = params;
  const [data, setData] = useState(null);

  useEffect(() => {
    api.artist.get(id).then(setData).catch(console.error);
  }, [id]);

  if (!data) return <main className={styles.loading}>Loading artist…</main>;

  const { artist, topTracks, albums } = data;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <img src={artist.images?.[0]?.url} className={styles.avatar} />
        <div>
          <p className={styles.label}>Artist</p>
          <h1 className={styles.name}>{artist.name}</h1>
          <p className={styles.meta}>
            {artist.followers?.total?.toLocaleString()} followers ·{" "}
            {artist.genres?.slice(0, 3).join(" · ")}
          </p>
        </div>
      </header>

      <section className={styles.section}>
        <h2>Popular</h2>
        <ul className={styles.tracks}>
          {topTracks.map(track => (
            <li key={track.id} className={styles.trackRow}>
              <span>{track.name}</span>
              <span className={styles.duration}>
                {Math.floor(track.duration_ms / 60000)}:
                {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, "0")}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Albums</h2>
        <div className={styles.albumsGrid}>
          {albums.map(album => (
            <a
              key={album.id}
              href={`/album/${album.id}`}
              className={styles.albumCard}
            >
              <img src={album.images?.[0]?.url} className={styles.albumCover} />
              <div className={styles.albumInfo}>
                <h3>{album.name}</h3>
                <p>{album.release_date?.slice(0, 4)}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
