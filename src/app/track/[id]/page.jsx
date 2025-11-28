"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import SpotifyHeader from "../../../components/Header/SpotifyHeader";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Player from "../../../components/Player/Player";
import Loader from "../../../components/Loader/Loader";

export default function TrackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const trackId = params.id;

  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/tracks/${trackId}`);
        if (!res.ok) throw new Error("Traccia non trovata");
        const data = await res.json();
        setTrack(data);
      } catch (err) {
        console.error("Errore:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (trackId) {
      fetchTrack();
    }
  }, [trackId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <SpotifyHeader />
        <div className={styles.content}>
          <Sidebar />
          <main className={styles.mainContent}>
            <Loader />
          </main>
        </div>
        <Player />
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className={styles.container}>
        <SpotifyHeader />
        <div className={styles.content}>
          <Sidebar />
          <main className={styles.mainContent}>
            <div className={styles.error}>
              <h2>{error || "Traccia non trovata"}</h2>
              <button onClick={() => router.back()}>← Indietro</button>
            </div>
          </main>
        </div>
        <Player />
      </div>
    );
  }

  const imageUrl = track.album?.images?.[0]?.url || "/default-track.png";
  const artistNames = track.artists?.map((a) => a.name).join(", ") || "Unknown";
  const duration = Math.floor(track.duration_ms / 60000);
  const seconds = Math.floor((track.duration_ms % 60000) / 1000);

  return (
    <div className={styles.container}>
      <SpotifyHeader />

      <div className={styles.content}>
        <Sidebar />

        <main className={styles.mainContent}>
          {/* GRADIENT BACKGROUND */}
          <div 
            className={styles.gradientBg}
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(100,100,100,0.8) 0%, rgba(18,18,18,1) 100%)`
            }}
          />

          {/* HERO SECTION */}
          <section className={styles.heroSection}>
            <div className={styles.heroGrid}>
              {/* Image - Left */}
              <div className={styles.imageContainer}>
                <img 
                  src={imageUrl} 
                  alt={track.name} 
                  className={styles.image} 
                />
              </div>

              {/* Info - Right */}
              <div className={styles.infoContainer}>
                <p className={styles.type}>SINGOLO</p>
                
                <h1 className={styles.title}>{track.name}</h1>
                
                <div className={styles.artistSection}>
                  <p className={styles.artistLabel}>di</p>
                  <p className={styles.artists}>{artistNames}</p>
                </div>

                {track.album && (
                  <p className={styles.album}>
                    Album: <span className={styles.albumName}>{track.album.name}</span>
                  </p>
                )}

                {/* CONTROLS */}
                <div className={styles.controls}>
                  <button className={styles.playBtn} title="Play">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                  <button className={styles.likeBtn} title="Add to Liked">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                  <button className={styles.moreBtn} title="More">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5" r="2"/>
                      <circle cx="12" cy="12" r="2"/>
                      <circle cx="12" cy="19" r="2"/>
                    </svg>
                  </button>
                </div>

                {/* STATS */}
                <div className={styles.statsContainer}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>POPOLARITÀ</span>
                    <span className={styles.statValue}>{track.popularity}%</span>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progress}
                        style={{ width: `${track.popularity}%` }}
                      />
                    </div>
                  </div>

                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>DATA RILASCIO</span>
                    <span className={styles.statValue}>
                      {track.album?.release_date || "N/A"}
                    </span>
                  </div>

                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>DURATA</span>
                    <span className={styles.statValue}>
                      {duration}:{String(seconds).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <Player />
    </div>
  );
}
