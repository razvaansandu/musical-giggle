"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../home/home.module.css";

import SpotifyHeader from "../../components/Header/SpotifyHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import Player from "../../components/Player/Player";
import PlaylistCard from "../../components/Cards/PlaylistCard";
import Loader from "../../components/Loader/Loader";

export default function PlaylistsPage() {
  const router = useRouter();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/playlists/user?limit=50");
        if (!res.ok) throw new Error("Errore nel caricamento delle playlist");

        const data = await res.json();
        setPlaylists(data.items ?? []);
      } catch (err) {
        console.error("Errore:", err);
        setError(err.message || "Errore nel caricamento");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <div className={styles.container}>
      <SpotifyHeader />

      <div className={styles.content}>
        <Sidebar />
       
        <main className={styles.mainContent}>
          <h1>Your Playlists</h1>
          {loading && <Loader />}
          {error && <p style={{ color: "#f87171" }}>{error}</p>}
          {!loading && !error && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {playlists.map((pl, index) => (
                <PlaylistCard
                  key={`${pl.id || "playlist"}-${index}`}
                  playlist={pl}
                  onClick={() => router.push(`/playlist/${pl.id}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div> 
      <Player />
    </div>
  );
}