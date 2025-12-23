"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../home/home.module.css";

import SpotifyHeader from "../../components/Header/SpotifyHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import Player from "../../components/Player/Player";
import AlbumCard from "../../components/Cards/AlbumCard";
import Loader from "../../components/Loader/Loader";

export default function AlbumsPage() {
  const router = useRouter();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/albums/saved?limit=50");
        if (!res.ok) throw new Error("Errore nel caricamento degli album");

        const data = await res.json();
        const albumsData = (data.items ?? []).map(item => item.album).filter(Boolean);
        setAlbums(albumsData);
      } catch (err) {
        console.error("Errore:", err);
        setError(err.message || "Errore nel caricamento");
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  return (
    <div className={styles.container}>
      <SpotifyHeader />

      <div className={styles.content}>
        <Sidebar />
       
        <main className={styles.mainContent}>
          <h1>Your Saved Albums</h1>
          {loading && <Loader />}
          {error && <p style={{ color: "#f87171" }}>{error}</p>}
          {!loading && !error && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {albums.map((album, index) => (
                <AlbumCard
                  key={`${album.id || "album"}-${index}`}
                  album={album}
                  onClick={() => router.push(`/album/${album.id}`)}
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