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

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/albums/${id}`);
        if (!res.ok) throw new Error("Errore caricamento album");
        
        const data = await res.json();
        setAlbum(data);

        const albumTracks = (data.tracks?.items || []).map(track => ({
            ...track,
            album: data 
        }));

        setTracks(albumTracks);
      } catch (err) {
        console.error(err);
        setError(err.message || "Errore caricamento album");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const [isShuffle, setIsShuffle] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleShuffle = async (next) => {
    try {
      const newState = typeof next === 'boolean' ? next : !isShuffle;
      setIsShuffle(newState);
      await fetch(`/api/player/toggle-shuffle?state=${newState}`, { method: 'PUT' });
    } catch (err) {
      console.error('Errore shuffle', err);
      setIsShuffle(prev => !prev);
    }
  };

  const handlePlayAll = async (play) => {
    try {
      setIsPlaying(play);
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
      setIsPlaying(!play);
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
                    {album.artists?.map(a => a.name).join(", ")} • {new Date(album.release_date).getFullYear()}
                  </p>
                  <p className={styles.heroFollowers}>
                    {tracks.length} tracks
                  </p>
                </div>
              </section>

              <section className={styles.section}>
                <h2>Brani</h2>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '12px 0' }}>
                  <ButtonShuffle isShuffled={isShuffle} onToggle={handleShuffle} />
                  <PlayButton isPlaying={isPlaying} onClick={handlePlayAll} />
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

      <Player/>
    </div>
  );
}
