"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import styles from "../../home/home.module.css";

import SpotifyHeader from "../../../components/Header/SpotifyHeader";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Player from "../../../components/Player/Player";
import TrackCard from "../../../components/Cards/TrackCard";
import Loader from "../../../components/Loader/Loader";

export default function PlaylistPage() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [plRes, tracksRes] = await Promise.all([
          fetch(`/api/playlists/${id}`),
          fetch(`/api/playlists/tracks/${id}`),
        ]);

        const plJson = await plRes.json();
        const tracksJson = await tracksRes.json();

        if (!plRes.ok) throw new Error("Errore caricamento playlist");
        if (!tracksRes.ok) throw new Error("Errore caricamento brani playlist");

        setPlaylist(plJson);
        const items = tracksJson.items || [];
        setTracks(items.map((it) => it.track || it));
      } catch (err) {
        console.error(err);
        setError(err.message || "Errore caricamento playlist");
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
          {loading && (
            <div style={{ marginTop: 40 }}>
              <Loader />
            </div>
          )}

          {error && !loading && (
            <p style={{ color: "#f87171", marginBottom: "1rem" }}>{error}</p>
          )}

          {!loading && playlist && (
            <>
              <section className={styles.section}>
                <h2>{playlist.name}</h2>
                <p>{playlist.description}</p>
              </section>

              <section className={styles.section}>
                <h2>Tracks</h2>
                <div className={styles.grid}>
                  {tracks.map((t) => (
                    <TrackCard key={t.id} track={t} />
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
