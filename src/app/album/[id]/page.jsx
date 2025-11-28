"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import styles from "../../home/home.module.css";

import SpotifyHeader from "../../../components/Header/SpotifyHeader";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Player from "../../../components/Player/Player";
import Card from "../../../components/Cards/Card";
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
          <section className={styles.heroAlbumSection}>
            <div className={styles.heroAlbumContainer}>
              <div className={styles.heroAlbumImage}>
                <img
                  src={album.images?.[0]?.url || "/placeholder.png"}
                  alt={album.name}
                  className={styles.heroAlbumImg}
                />
              </div>

              <div className={styles.heroAlbumText}>
                <span className={styles.heroAlbumType}>Album</span>
                <h1 className={styles.heroAlbumTitle}>{album.name}</h1>
                <div className={styles.heroAlbumMeta}>
                  <span>{album.artists?.map((a) => a.name).join(", ")}</span>
                  <span className={styles.heroAlbumDot}>•</span>
                  <span>{album.release_date}</span>
                  <span className={styles.heroAlbumDot}>•</span>
                  <span>{album.total_tracks} songs</span>
                </div>
              </div>
            </div>
          </section>

          {/* --- TRACKLIST HEADER --- */}
          <section className={styles.tracklistHeader}>
            <div className={styles.tracklistHeaderLeft}>
              <span className={styles.tracklistNumber}>#</span>
              <span className={styles.tracklistTitle}>TITLE</span>
            </div>
            <div className={styles.tracklistHeaderRight}>
              <span className={styles.tracklistDuration}>DURATION</span>
            </div>
          </section>

          {/* --- TRACKLIST --- */}
          <section className={styles.tracklist}>
            {tracks.map((t, i) => (
              <Card key={t.id} item={t} index={i + 1} />
            ))}
          </section>

        </main>
      </div>

      <Player />
    </div>
  );
}
