"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import styles from "../../home/home.module.css";

import SpotifyHeader from "../../../components/Header/SpotifyHeader";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Player from "../../../components/Player/Player";
import TrackCard from "../../../components/Cards/TrackCard";
import Loader from "../../../components/Loader/Loader";

export default function AlbumPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return; 

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/albums/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error("Errore caricamento album");

        setAlbum(data);
        setTracks(data.tracks?.items || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Errore caricamento album");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p style={{ color: "#f87171" }}>{error}</p>;
console.log(tracks); 
  return (  
    
    <div className={styles.container}>
      <SpotifyHeader />

      <div className={styles.content}>
        <Sidebar />

        <main className={styles.mainContent}>

          {/* --- HERO ALBUM --- */}
          <section className={styles.hero}>
            <div className={styles.heroImageWrapper}>
              <img
                src={album.images?.[0]?.url || "/placeholder.png"}
                alt={album.name}
                className={styles.heroImage}
              />
            </div>

            <div className={styles.heroText}>
              <p className={styles.heroType}>Album</p>
              <h1 className={styles.heroTitle}>{album.name}</h1>
              <p className={styles.heroFollowers}>
                {album.release_date} • {album.total_tracks} tracks
              </p>
              <p className={styles.heroFollowers}>
                {album.artists?.map((a) => a.name).join(", ")}
              </p>
            </div>
          </section>

          {/* --- TRACKLIST --- */}
          <section className={styles.section}>
            <h2>Tracks</h2>
            <div className={styles.grid}>
              {tracks.map((t) => (
                <TrackCard key={t.id} track={t} />
              ))}
            </div>
          </section>

        </main>
      </div>

      <Player />
    </div>
  );
}
