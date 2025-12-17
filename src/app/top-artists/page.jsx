"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../home/home.module.css";

import SpotifyHeader from "../../components/Header/SpotifyHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import Player from "../../components/Player/Player";
import ArtistCard from "../../components/Cards/ArtistCard";
import Loader from "../../components/Loader/Loader";

export default function TopArtistsPage() {
  const router = useRouter();
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/spotify/get-user-top?type=artists&limit=50");
        if (!res.ok) throw new Error("Errore nel caricamento dei top artists");

        const data = await res.json();
        setTopArtists(data.items ?? []);
      } catch (err) {
        console.error("Errore:", err);
        setError(err.message || "Errore nel caricamento");
      } finally {
        setLoading(false);
      }
    };

    fetchTopArtists();
  }, []);

  return (
    <div className={styles.container}>
      <SpotifyHeader />

      <div className={styles.content}>
        <Sidebar />
       
        <main className={styles.mainContent}>
          <h1>Your Top Artists</h1>
          {loading && <Loader />}
          {error && <p style={{ color: "#f87171" }}>{error}</p>}
          {!loading && !error && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {topArtists.map((artist, index) => (
                <ArtistCard
                  key={`${artist.id || "artist"}-${index}`}
                  artist={artist}
                  onClick={() => router.push(`/artist/${artist.id}`)}
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