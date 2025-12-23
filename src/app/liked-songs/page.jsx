"use client";

import { useEffect, useState } from "react";
import styles from "../home/home.module.css";
import { Heart } from "lucide-react";

import SpotifyHeader from "../../components/Header/SpotifyHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import Player from "../../components/Player/Player";
import TrackList from "../../components/TrackList/TrackList";
import ButtonShuffle from "../../components/buttons/buttonShuffle";
import PlayButton from "../../components/buttons/PlayButton";
import { useSpotifyFetch } from "../../hooks/useSpotifyFetch";

export default function LikedSongs() {
  const [total, sTotal] = useState(0);
  const [tracks, setTracks] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [playbackState, setPlaybackState] = useState({ isShuffle: false, isPlaying: false });
  
  const { loading, spotifyFetch } = useSpotifyFetch();

  const loadTracks = async () => {
    try {
      const offset = page * 50;
      const data = await spotifyFetch(`/tracks/saved?limit=50&offset=${offset}`);
      sTotal(data.total);
      if (!data) return;

      const items = data.items || [];
      
      if (page === 0) {
        setTracks(items.map(it => it.track || it));
      } else {
        setTracks(prev => [...prev, ...items.map(it => it.track || it)]);
      }
      
      if (!data.next || items.length < 50) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Errore caricamento:", err);
    }
  };

  useEffect(() => {
    loadTracks();
  }, [page, spotifyFetch]);

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
          <div className={styles.heroAlbumSection}>
            <div className={styles.heroAlbumContainer}>
              <div className={styles.heroAlbumImage}>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, #450af5, #8e8e8e)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Heart size={80} fill="white" color="white" />
                </div>
              </div>

              <div className={styles.heroAlbumText}>
                <span className={styles.heroAlbumType}>Playlist</span>
                <h1 className={styles.heroAlbumTitle} style={{ fontSize: "4rem" }}>
                  Brani che ti piacciono
                </h1>
                <div className={styles.heroAlbumMeta}>
                  <span style={{ fontWeight: "bold", color: "white" }}>Tu</span>
                  <span className={styles.heroAlbumDot}>•</span>
                  <span>{total} brani</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
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
            </div>
            
            <TrackList tracks={tracks} />

            {hasMore && (
              <button 
                onClick={() => setPage(prev => prev + 1)} 
                disabled={loading}
                style={{  
                  margin: '20px 0', 
                  padding: '12px 24px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Caricamento...' : 'Carica altre'}
              </button>
            )}
          </div>
        </main>
      </div>

      <Player />
    </div>
  );
}
