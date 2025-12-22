"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import styles from "../../home/home.module.css";

import SpotifyHeader from "../../../components/Header/SpotifyHeader";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Player from "../../../components/Player/Player";
import TrackList from "../../../components/TrackList/TrackList";
import ButtonShuffle from "../../../components/buttons/buttonShuffle";
import PlayButton from "../../../components/buttons/PlayButton";
import AddToLibraryButton from "../../../components/buttons/AddToLibraryButton";

import Loader from "../../../components/Loader/Loader";

export default function AlbumPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [playbackState, setPlaybackState] = useState({ isShuffle: false, isPlaying: false });

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

  const fetchPlaybackState = async () => {
    try {
      const res = await fetch("/api/player/get-playback-state");
      if (res.status === 204) {
        setPlaybackState({ isShuffle: false, isPlaying: false });
        return;
      }
      const text = await res.text();
      if (text) {
        const data = JSON.parse(text);
        setPlaybackState({
          isShuffle: data.shuffle_state || false,
          isPlaying: data.is_playing || false
        });
      }
    } catch (err) {
      console.error("Errore fetch playback state:", err);
    }
  };

  useEffect(() => {
    fetchPlaybackState();
    const interval = setInterval(fetchPlaybackState, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleShuffle = async () => {
    try {
      const newState = !playbackState.isShuffle;
      await fetch(`/api/player/toggle-shuffle?state=${newState}`, { method: 'PUT' });
    } catch (err) {
      console.error('Errore shuffle', err);
    }
  };

  const handlePlayAll = async () => {
    try {
      if (!tracks || !tracks.length) return;
      const uris = tracks.map(t => t.uri).filter(Boolean);
      if (!uris.length) return;
      
      await fetch('/api/player/start-resume-playback', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uris }),
      });
    } catch (err) {
      console.error('Errore play', err);
    }
  };

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

          {!loading && album && (
            <>
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

              <section className={styles.section}>
                <h2>Brani</h2>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '12px 0' }}>
                  <ButtonShuffle 
                    isShuffled={playbackState.isShuffle} 
                    onToggle={handleShuffle} 
                  />
                  <PlayButton 
                    isPlaying={playbackState.isPlaying} 
                    onClick={handlePlayAll} 
                  />
                  <div>
                    <AddToLibraryButton albumId={album?.id} />
                  </div>
                </div>
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
