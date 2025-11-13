"use client";
import { useState, useEffect } from "react";
import styles from "../home/home.module.css";
import SpotifyHeader from "@/components/SpotifyHeader";

function VolumeButton() {
  // invariato
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [playlist, setPlaylist] = useState(null);

  // live search da API
  useEffect(() => {
    if (query.length > 0) {
      fetch(`/api/search/playlists?q=${query}`)
        .then((res) => res.json())
        .then((data) => setResults(data.playlists || []))
        .catch((err) => console.error(err));
    } else {
      setResults([]);
    }
  }, [query]);

  // enter → carica la prima playlist trovata
  async function handleKeyDown(e) {
    if (e.key === "Enter" && results.length > 0) {
      const id = results[0].id; // prendi la prima playlist
      const res = await fetch(`/api/playlists/${id}`);
      const data = await res.json();
      setPlaylist(data);
    }
  }

  return (
    <div className={styles.container}>
      <SpotifyHeader />
      <div className={styles.content}>
        <nav className={styles.sidebar}>{/* menu invariato */}</nav>

        <main className={styles.mainContent}>
          {/* Barra di ricerca */}
          <div className={styles.searchBar}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search playlists..."
              className={styles.searchInput}
            />
          </div>

          {/* Risultati live */}
          {results.length > 0 && (
            <section className={styles.section}>
              <h2>Risultati</h2>
              <div className={styles.grid}>
                {results.map((item) => (
                  <div
                    key={item.id}
                    className={styles.card}
                    onClick={async () => {
                      const res = await fetch(`/api/playlists/${item.id}`);
                      const data = await res.json();
                      setPlaylist(data);
                    }}
                  >
                    <div
                      className={styles.cardImage}
                      style={{
                        backgroundImage: `url(${item.image})`,
                        backgroundSize: "cover",
                      }}
                    ></div>
                    <div className={styles.cardContent}>
                      <h3>{item.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Playlist caricata */}
          {playlist && (
            <section className={styles.section}>
              <h2>{playlist.name}</h2>
              <p>{playlist.description}</p>
              <ul>
                {playlist.tracks.map((t, i) => (
                  <li key={i}>
                    {t.name} — {t.artist}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <VolumeButton />
        </main>
      </div>
    </div>
  );
}
 