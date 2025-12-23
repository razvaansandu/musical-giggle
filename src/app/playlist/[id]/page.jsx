"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "../../home/home.module.css";

import SpotifyHeader from "../../../components/Header/SpotifyHeader";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Player from "../../../components/Player/Player";
import TrackList from "../../../components/TrackList/TrackList";
import Loader from "../../../components/Loader/Loader";
import ButtonShuffle from "../../../components/buttons/buttonShuffle";
import PlayButton from "../../../components/buttons/PlayButton";
import AddToLibraryButton from "../../../components/buttons/AddToLibraryButton";
import { useSpotifyFetch } from "../../../hooks/useSpotifyFetch"; 

export default function PlaylistPage() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [playbackState, setPlaybackState] = useState({ isShuffle: false, isPlaying: false });
  
  const { loading, error, spotifyFetch } = useSpotifyFetch();

  useEffect(() => {
    if (!id) return;

    const loadPlaylist = async () => {
      try {
        const plData = await spotifyFetch(`/playlists/${id}`);
        if (!plData) return;
        setPlaylist(plData);

        const allItems = [];
        let offset = 0;
        const limit = 100;

        while (true) {
          const data = await spotifyFetch(`/playlists/tracks/${id}?limit=${limit}&offset=${offset}`);
          if (!data) break;

          const items = data.items || [];
          allItems.push(...items);

          const total = data.total ?? allItems.length;
          offset += items.length;
          
          if (allItems.length >= total || items.length === 0) break;
        }

        setTracks(allItems.map(it => it.track || it));
      } catch (err) {
        console.error("Errore playlist:", err);
      }
    };

    loadPlaylist();
  }, [id, spotifyFetch]);

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
                    <AddToLibraryButton playlistId={playlist?.id} />
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
