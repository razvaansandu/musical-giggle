"use client";

import { useEffect, useState } from "react";
import styles from "../home/home.module.css";

import SpotifyHeader from "../../components/Header/SpotifyHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import Player from "../../components/Player/Player";
import TrackList from "../../components/TrackList/TrackList";
import Loader from "../../components/Loader/Loader";

export default function TopTracksPage() {
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/spotify/get-user-top?type=tracks&limit=50");
        if (!res.ok) throw new Error("Errore nel caricamento dei top tracks");

        const data = await res.json();
        setTopTracks(data.items ?? []);
      } catch (err) {
        console.error("Errore:", err);
        setError(err.message || "Errore nel caricamento");
      } finally {
        setLoading(false);
      }
    };

    fetchTopTracks();
  }, []);

  return (
    <div className={styles.container}>
      <SpotifyHeader />

      <div className={styles.content}>
        <Sidebar />
       
        <main className={styles.mainContent}>
          <h1>Your Top Tracks</h1>
          {loading && <Loader />}
          {error && <p style={{ color: "#f87171" }}>{error}</p>}
          {!loading && !error && <TrackList tracks={topTracks} />}
        </main>
      </div> 
      <Player />
    </div>
  );
}