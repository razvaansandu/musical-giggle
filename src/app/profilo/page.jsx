"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";
import { useSessionManager } from "../../hooks/useSessionManager";

import SpotifyHeader from "../../components/Header/SpotifyHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import Player from "../../components/Player/Player";
import Loader from "../../components/Loader/Loader";
import ArtistCard from "../../components/Cards/ArtistCard";
import PlaylistCard from "../../components/Cards/PlaylistCard";
import ScrollRow from "../../components/ScrollRow/ScrollRow";

export default function ProfilePage() {
  const router = useRouter();
  const { setSessionExpired } = useSessionManager();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topArtistsThisMonth, setTopArtistsThisMonth] = useState([]);
  const [publicPlaylists, setPublicPlaylists] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/spotify/get-user-profile");

        if (!res.ok) {
          throw new Error("Errore nel recupero del profilo");
        }

        const data = await res.json();
        setProfile(data);

        const topArtistsRes = await fetch("/api/spotify/get-user-top?type=artists&time_range=short_term&limit=10");
        if (topArtistsRes.ok) {
          const topArtistsData = await topArtistsRes.json();
          setTopArtistsThisMonth(topArtistsData.items ?? []);
        }

        const playlistsRes = await fetch("/api/playlists/user?limit=10");
        if (playlistsRes.ok) {
          const playlistsData = await playlistsRes.json();
          setPublicPlaylists(playlistsData.items ?? []);
        }
      } catch (err) {
        console.error("Errore profilo:", err);
        if (err?.message?.includes("profilo") || err?.status === 401) {
          setSessionExpired();
        } else {
          setError(err?.message || "Errore nel caricamento del profilo");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setSessionExpired]);

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

          {!loading && profile && (
            <section className={styles.profileSection}>
              <div className={styles.header}>
                <div className={styles.avatarWrapper}>
                  {profile.images && profile.images.length > 0 ? (
                    <img
                      src={profile.images[0].url}
                      alt={profile.display_name}
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {profile.display_name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>


                <div>
                  <section>
                    <p className={styles.type}>Profilo</p>
                    <h1 className={styles.name}>{profile.display_name}</h1>
                    <p className={styles.meta}>
                      {profile.followers?.total ?? 0} follower ·{" "}
                      {profile.country || "Paese sconosciuto"} ·{" "}
                      {profile.product === "premium" ? "Premium" : "Free"}
                    </p>
                    {profile.email && (
                      <p className={styles.email}>{profile.email}</p>
                    )}
                  </section>
                </div>
              </div>


              <div>
                <ScrollRow title="Artisti top di questo mese" seeAllLink="/top-artists">
                  {topArtistsThisMonth.map((artist, index) => (
                    <ArtistCard
                      key={`${artist.id || "artist"}-${index}`}
                      artist={artist}
                      onClick={() => router.push(`/artist/${artist.id}`)}
                    />
                  ))}
                </ScrollRow>

              </div>


              <section className={styles.section}>
                <h2>Playlist pubbliche</h2>
                <div className={styles.grid}>
                  {publicPlaylists.map((playlist, index) => (
                    <PlaylistCard
                      key={`${playlist.id || "playlist"}-${index}`}
                      playlist={playlist}
                      onClick={() => router.push(`/playlist/${playlist.id}`)}
                    />
                  ))}
                </div>
              </section>
            </section>
          )}
        </main>
      </div>


      <Player />
    </div>

  );
}
