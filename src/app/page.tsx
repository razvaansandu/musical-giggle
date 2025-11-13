"use client";
import { useEffect, useState } from "react";
import SpotifyHeader from "@/components/SpotifyHeader";
import MiniCard from "@/components/MiniCard";
import styles from "./home.module.css";
import { api } from "../lib/apiClient";

export default function Home() {
  const [recently, setRecently] = useState([]);
  const [dailyMix, setDailyMix] = useState([]);

  useEffect(() => {
    api.home.get().then((data) => {
      setRecently(data.recentlyPlayed);
      setDailyMix(data.dailyMix);
    });
  }, []);

  return (
    <div className={styles.container}>
      <SpotifyHeader />

      <div className={styles.content}>
        <nav className={styles.sidebar}>
          <a href="/" className={styles.menuItem}>🏠 Home</a>
          <a href="/search" className={styles.menuItem}>🔍 Search</a>
          <a href="/library" className={styles.menuItem}>📚 Library</a>
          <a href="/genres" className={styles.menuItem}>🎨 Genres</a>
        </nav>

        <main className={styles.mainContent}>
          <section className={styles.section}>
            <h2>Recently Played</h2>
            <div className={styles.grid}>
              {recently.map(item => (
                <MiniCard
                  key={item.played_at}
                  title={item.track.name}
                  subtitle={item.track.artists.map(a => a.name).join(", ")}
                  image={item.track.album.images?.[0]?.url}
                  link={`/album/${item.track.album.id}`}
                />
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2>Made For You</h2>
            <div className={styles.grid}>
              {dailyMix.map(artist => (
                <MiniCard
                  key={artist.id}
                  title={artist.name}
                  subtitle="Daily Mix"
                  image={artist.images?.[0]?.url}
                  link={`/artist/${artist.id}`}
                />
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
