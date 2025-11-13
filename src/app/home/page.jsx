"use client";
import { useEffect, useState } from "react";
import styles from "./home.module.css";
import SpotifyHeader from "../../components/SpotifyHeader";
import SearchTestPage from "../search/page";
import MiniCard from "../../components/MiniCard";
import Link from "next/link";
import { api } from "@/lib/apiClient";

export default function Home() {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [dailyMix, setDailyMix] = useState([]);

  useEffect(() => {
    let mounted = true;
    api.home
      .get()
      .then((data) => {
        if (!mounted) return;
        // Support multiple possible shapes from the backend
        setRecentlyPlayed(data.recentlyPlayed || data.items || data.albums || []);
        setDailyMix(data.dailyMix || data.daily || []);
      })
      .catch((err) => {
        console.error("Errore fetching home data:", err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className={styles.container}>
      <SearchTestPage />
      <SpotifyHeader />
      <div className={styles.content}>
        <nav className={styles.sidebar}>
          <div className={styles.menu}>
            <div className={styles.menuItem}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z" fill="currentColor" />
              </svg>
              <span>Home</span>
            </div>
            <div className={styles.menuItem}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z" fill="currentColor" />
              </svg>
              <span>Search</span>
            </div>
            <div className={styles.menuItem}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M14.5 2.134a1 1 0 0 1 1 0l6 3.464a1 1 0 0 1 .5.866V21a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V3a1 1 0 0 1 .5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H3zm1-2h4V4H4v16z" fill="currentColor" />
              </svg>
              <span>Your Library</span>
            </div>
          </div>
          <div className={styles.playlists}>
            <h2>Playlists</h2>
            <div className={styles.playlistItem}>
              <div className={styles.createPlaylist}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z" fill="currentColor" />
                </svg>
                <span>Create Playlist</span>
              </div>
            </div>
          </div>
        </nav>

        <main className={styles.mainContent}>
          <section className={styles.section}>
            <h2>Recently played</h2>
            <div className={styles.grid}>
              {recentlyPlayed && recentlyPlayed.length > 0 ? (
                recentlyPlayed.map((album) => (
                  <div key={album.id || album.uri || Math.random()} className={styles.card}>
                    <Link href={`/albums/${album.id || (album.uri && album.uri.split(":").pop())}`}>
                      <a>
                        {album.images && album.images[0] ? (
                          <img src={album.images[0].url} alt={album.name} className={styles.cardImage} />
                        ) : (
                          <div className={styles.cardImage}></div>
                        )}
                        <div className={styles.cardContent}>
                          <h3>{album.name || album.title}</h3>
                          <p>{album.artists ? (Array.isArray(album.artists) ? album.artists.map(a=>a.name).join(', ') : album.artists) : ''}</p>
                        </div>
                      </a>
                    </Link>
                  </div>
                ))
              ) : (
                // fallback placeholders
                [1, 2, 3, 4, 5, 6, 7].map((item) => (
                  <div key={item} className={styles.card}>
                    <div className={styles.cardImage}></div>
                    <div className={styles.cardContent}>
                      <h3>Album {item}</h3>
                      <p>Artist</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className={styles.section}>
            <h2>Made for you</h2>
            <div className={styles.grid}>
              {dailyMix && dailyMix.length > 0 ? (
                dailyMix.map((mix, idx) => (
                  <div key={mix.id || idx} className={styles.card}>
                    <div className={styles.cardImage}></div>
                    <div className={styles.cardContent}>
                      <h3>{mix.name || `Daily Mix ${idx + 1}`}</h3>
                      <p>custom mix</p>
                    </div>
                  </div>
                ))
              ) : (
                [1, 2, 3, 4, 5, 6, 7].map((item) => (
                  <div key={item} className={styles.card}>
                    <div className={styles.cardImage}></div>
                    <div className={styles.cardContent}>
                      <h3>Daily Mix {item}</h3>
                      <p>custom mix</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <MiniCard />
        </main>
      </div>
    </div>
  );
}