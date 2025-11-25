"use client";

import { useEffect, useState } from "react";
import styles from "./home.module.css";

import SpotifyHeader from "../../components/Header/SpotifyHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import Player from "../../components/Player/Player";

import ArtistCard from "../../components/Cards/ArtistCard";
import TrackCard from "../../components/Cards/TrackCard";
import PlaylistCard from "../../components/Cards/PlaylistCard";
import Loader from "../../components/Loader/Loader";

export default function HomePage() {
  const [profile, setProfile] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          profileRes,
          topArtistsRes,
          topTracksRes,
          recentRes,
          playlistsRes,
        ] = await Promise.all([
          fetch("/api/spotify/get-user-profile"),
          fetch("/api/spotify/get-user-top?type=artists&limit=6"),
          fetch("/api/spotify/get-user-top?type=tracks&limit=6"),
          fetch("/api/player/get-recently-played-tracks"),
          fetch("/api/playlists/user"),
        ]);

        if (!profileRes.ok) throw new Error("Errore profilo utente");
        if (!topArtistsRes.ok) throw new Error("Errore top artist");
        if (!topTracksRes.ok) throw new Error("Errore top brani");
        if (!recentRes.ok) throw new Error("Errore recently played");
        if (!playlistsRes.ok) throw new Error("Errore playlist utente");

        const profileJson = await profileRes.json();
        const topArtistsJson = await topArtistsRes.json();
        const topTracksJson = await topTracksRes.json();
        const recentJson = await recentRes.json();
        const playlistsJson = await playlistsRes.json();

        console.log("PROFILE:", profileJson);
        console.log("TOP ARTISTS:", topArtistsJson);
        console.log("TOP TRACKS:", topTracksJson);
        console.log("RECENT:", recentJson);
        console.log("PLAYLISTS:", playlistsJson);

        setProfile(profileJson);

        setTopArtists(topArtistsJson.items ?? []);
        setTopTracks(topTracksJson.items ?? []);

        const recentItems = Array.isArray(recentJson.items)
          ? recentJson.items.map((i) => i.track)
          : [];
        setRecentTracks(recentItems);

        setPlaylists(playlistsJson.items ?? playlistsJson ?? []);
      } catch (err) {
        console.error("Errore nella home:", err);
        setError(err.message || "Errore nel caricamento della home");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

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
            <p style={{ color: "#f87171", marginBottom: "1rem" }}>
              {error}
            </p>
          )}

          {!loading && (
            <>
             
              {/* RECENTLY PLAYED */}
              <section className={styles.section}>
                <h2>Recently played</h2>
                <div className={styles.grid}>
                  {recentTracks.slice(0, 8).map((track, index) => (
                    <TrackCard
                      key={`${track.id || "track"}-${index}`}
                      track={track}
                    />
                  ))}
                </div>
              </section>

              {/* TOP ARTISTS */}
              <section className={styles.section}>
                <h2>Your top artists</h2>
                <div className={styles.grid}>
                  {topArtists.slice(0, 6).map((artist, index) => (
                    <ArtistCard
                      key={`${artist.id || "artist"}-${index}`}
                      artist={artist}
                    />
                  ))}
                </div>
              </section>

              {/* TOP TRACKS */}
              <section className={styles.section}>
                <h2>Your top tracks</h2>
                <div className={styles.grid}>
                  {topTracks.slice(0, 6).map((track, index) => (
                    <TrackCard
                      key={`${track.id || "top-track"}-${index}`}
                      track={track}
                    />
                  ))}
                </div>
              </section>

              {/* PLAYLISTS */}
              <section className={styles.section}>
                <h2>Your playlists</h2>
                <div className={styles.grid}>
                  {playlists.slice(0, 8).map((pl, index) => (
                    <PlaylistCard
                      key={`${pl.id || "playlist"}-${index}`}
                      playlist={pl}
                    />
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
