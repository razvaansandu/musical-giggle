"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/apiClient";
import styles from "./library.module.css";

export default function LibraryPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.library.get().then(setData).catch(console.error);
  }, []);

  if (!data) return <main className={styles.container}>Loading library…</main>;

  const { playlists, albums } = data;

  return (
    <main className={styles.container}>
      <h1>Your Library</h1>

      <section className={styles.section}>
        <h2>Playlists</h2>
        <div className={styles.grid}>
          {playlists.map(pl => (
            <a
              key={pl.id}
              href={pl.external_urls?.spotify}
              target="_blank"
              rel="noreferrer"
              className={styles.card}
            >
              <img
                src={pl.images?.[0]?.url}
                className={styles.cover}
              />
              <div className={styles.info}>
                <h3>{pl.name}</h3>
                <p>{pl.tracks?.total} tracks</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Saved Albums</h2>
        <div className={styles.grid}>
          {albums.map(item => {
            const album = item.album;
            return (
              <a
                key={album.id}
                href={`/album/${album.id}`}
                className={styles.card}
              >
                <img
                  src={album.images?.[0]?.url}
                  className={styles.cover}
                />
                <div className={styles.info}>
                  <h3>{album.name}</h3>
                  <p>{album.artists.map(a => a.name).join(", ")}</p>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </main>
  );
}
