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
  const [tracks, setTracks] = useState([]);
  const [playbackState, setPlaybackState] = useState({ isShuffle: false, isPlaying: false });
  
  // ✅ USA IL HOOK - gestisce loading/error automaticamente
  const { loading, spotifyFetch } = useSpotifyFetch();

  // ✅ SEMPLICE - usaSpotifyFetch gestisce tutto (retry, 429, AbortController)
  useEffect(() => {
    const loadTracks = async () => {
      try {
        const allItems = [];
        let offset = 0;

        while (true) {
          const data = await spotifyFetch(`/tracks/saved?limit=50&offset=${offset}`);
          if (!data) break; // Hook gestisce errori

          const items = data.items || [];
          allItems.push(...items);

          if (!data.next || items.length < 50) break;
          offset += 50;
        }

        setTracks(allItems.map(it => it.track || it));
      } catch (err) {
        console.error("Errore liked songs:", err);
      }
    };

    loadTracks();
  }, [spotifyFetch]);

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
                  <span>{tracks.length} brani</span>
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
          </div>
        </main>
      </div>

      <Player />
    </div>
  );
}
