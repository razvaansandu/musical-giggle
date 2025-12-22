"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import styles from "../../home/home.module.css";

import SpotifyHeader from "../../../components/Header/SpotifyHeader";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Player from "../../../components/Player/Player";
import TrackList from "../../../components/TrackList/TrackList";
import Loader from "../../../components/Loader/Loader";

export default function PlaylistPage() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
          const res = await fetch(url, { signal: controller.signal });
          if (res.status === 429 && retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
            return fetchWithRetry(url, retries - 1, delay * 2);
          }
          return res;
        };

        const plRes = await fetchWithRetry(`/api/playlists/${id}`);
        if (plRes.status === 401) {
          setSessionExpired();
          return;
        }
        if (!plRes.ok) throw new Error(`Errore caricamento playlist: ${plRes.status}`);
        const plJson = await plRes.json();

        const allItems = [];
        let offset = 0;
        const limit = 100; 

        while (true) {
          const res = await fetchWithRetry(
            `/api/playlists/tracks/${id}?limit=${limit}&offset=${offset}`
          );
          if (res.status === 401) {
            setSessionExpired();
            return;
          }
          if (!res.ok) throw new Error("Errore caricamento brani playlist");
          const json = await res.json();

          const items = json.items || [];
          allItems.push(...items);

          const total = json.total ?? allItems.length;

          offset += items.length;
          if (allItems.length >= total || items.length === 0) break;
          
          await new Promise(r => setTimeout(r, 100));
          if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
        }

        setPlaylist(plJson);
        setTracks(allItems.map((it) => it.track || it));
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error(err);
        setError(err.message || "Errore caricamento playlist");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => controller.abort();
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
              <section className={styles.hero}>
                <div className={styles.heroImageWrapper}>
                  <img
                    src={playlist.images?.[0]?.url || "/placeholder.png"}
                    alt={playlist.name}
                    className={styles.heroImage}
                  />
                </div>

                <div className={styles.heroText}>
                  <p className={styles.heroType}>Playlist</p>
                  <h1 className={styles.heroTitle}>{playlist.name}</h1>
                  <p className={styles.heroFollowers}>
                    {playlist.description || "No description"}
                  </p>
                  <p className={styles.heroFollowers}>
                    {tracks.length} tracks
                  </p>
                </div>
              </section>

              <section className={styles.section}>
                <h2>Brani</h2>
                <TrackList tracks={tracks} />
              </section>
            </>
          )}
        </main>
      </div>

      <Player />
    </div>
  );
}
