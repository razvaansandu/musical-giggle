"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import styles from "../../home/home.module.css";

import SpotifyHeader from "../../../components/Header/SpotifyHeader";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Player from "../../../components/Player/Player";
import TrackCard from "../../../components/Cards/TrackCard";
import PlaylistCard from "../../../components/Cards/PlaylistCard";
import AlbumCard from "../../../components/Cards/AlbumCard";
import Loader from "../../../components/Loader/Loader";

export default function ArtistPage() {
  const { id } = useParams();

  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [artistRes, topRes, albumsRes] = await Promise.all([
          fetch(`/api/artist/${id}`),
          fetch(`/api/artist/top-tracks/${id}`),
          fetch(`/api/artist/albums/${id}`),
        ]);

        const artistJson = await artistRes.json();
        const topJson = await topRes.json();
        const albumsJson = await albumsRes.json();

        if (!artistRes.ok) throw new Error("Errore caricamento artista");
        if (!topRes.ok) throw new Error("Errore caricamento top tracks");
        if (!albumsRes.ok) throw new Error("Errore caricamento albums");

        setArtist(artistJson);
        setTopTracks(topJson.tracks || []);
        setAlbums(albumsJson.items || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Errore caricamento artista");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className={styles.container}>
      <SpotifyHeader />

      <div className={styles.content}>
        <Sidebar />

        <main className={styles.mainContent}>
          {loading && <Loader />}
          {error && !loading && <p style={{ color: "#f87171" }}>{error}</p>}

          {!loading && artist && (
            <>
              <section className={styles.hero}>
                <div className={styles.heroImageWrapper}>
                  <img
                    src={artist.images?.[0]?.url || "/placeholder.png"}
                    className={styles.heroImage}
                    alt={artist.name}
                  />
                </div>

                <div className={styles.heroText}>
                  <p className={styles.heroType}>Artist</p>
                  <h1 className={styles.heroTitle}>{artist.name}</h1>
                  <p className={styles.heroFollowers}>
                    {artist.followers?.total.toLocaleString()} followers
                  </p>
                </div>
              </section>

              <section className={styles.section}>
                <h2>Top tracks</h2>
                <div className={styles.grid}>
                  {topTracks.map((t) => (
                    <TrackCard key={t.id} track={t} />
                  ))}
                </div>
              </section>

              <section className={styles.section}>
                <h2>Albums</h2>
                <div className={styles.grid}>
                  {albums.map((a) => (
                  <AlbumCard key={a.id} album={a} />
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      <Player />
    </div>
  );
}
