"use client";

import { useEffect, useState } from "react";
import styles from "../home/home.module.css";

import SpotifyHeader from "../../components/Header/SpotifyHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import Player from "../../components/Player/Player";
import TrackList from "../../components/TrackList/TrackList";
import Loader from "../../components/Loader/Loader";

export default function RecentlyPlayedPage() {
  const [recentTracks, setRecentTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/player/get-recently-played-tracks?limit=50");
        if (!res.ok) throw new Error("Errore nel caricamento delle tracce recenti");

        const data = await res.json();
        const tracks = Array.isArray(data.items)
          ? data.items.map((i) => i.track)
          : [];
        // Remove duplicates based on track ID
        const uniqueTracks = tracks.filter((track, index, self) => 
          self.findIndex(t => t.id === track.id) === index
        );
        setRecentTracks(uniqueTracks);
      } catch (err) {
        console.error("Errore:", err);
        setError(err.message || "Errore nel caricamento");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyPlayed();
  }, []);

  return (
    <div className={styles.container}>
      <SpotifyHeader />

      <div className={styles.content}>
        <Sidebar />
       
        <main className={styles.mainContent}>
          <h1>Recently Played</h1>
          {loading && <Loader />}
          {error && <p style={{ color: "#f87171" }}>{error}</p>}
          {!loading && !error && <TrackList tracks={recentTracks} />}
        </main>
      </div> 
      <Player />
    </div>
  );
}