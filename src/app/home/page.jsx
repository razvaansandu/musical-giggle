"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./home.module.css";
import { useSessionManager } from "../../hooks/useSessionManager";

import SpotifyHeader from "../../components/Header/SpotifyHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import Player from "../../components/Player/Player";
import ScrollRow from "../../components/ScrollRow/ScrollRow";
import PlayerDebug from "../../components/PlayerDebug";

import TrackCard from "../../components/Cards/TrackCard";
import PlaylistCard from "../../components/Cards/PlaylistCard";
import AlbumCard from "../../components/Cards/AlbumCard";
import Loader from "../../components/Loader/Loader";

export default function HomePage() {
  const router = useRouter();
  const { setSessionExpired } = useSessionManager();
  const [profile, setProfile] = useState(null);
  const [publicPlaylists, setPublicPlaylists] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  const [savedAlbums, setSavedAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [ 
          profileRes,
          playlistsRes,
          albumsRes,
          recentRes,
        ] = await Promise.all([
          fetch("/api/spotify/get-user-profile"),
          fetch("/api/playlists/user?limit=50"),
          fetch("/api/albums/saved?limit=50"),
          fetch("/api/player/get-recently-played-tracks?limit=20"),
        ]);

        if (!profileRes.ok) throw new Error("Errore profilo utente");
        if (!playlistsRes.ok) throw new Error("Errore playlist utente");

        const profileJson = await profileRes.json();
        const playlistsJson = await playlistsRes.json();
        const albumsJson = albumsRes.ok ? await albumsRes.json() : { items: [] };
        const recentJson = await recentRes.json();

        console.log("PROFILE:", profileJson);
        console.log("PLAYLISTS:", playlistsJson);
        console.log("ALBUMS:", albumsJson);
        console.log("RECENT:", recentJson);

        setProfile(profileJson);

        const allPlaylists = playlistsJson.items ?? playlistsJson ?? [];
        const userOwnedPlaylists = allPlaylists.filter(pl => 
          pl.owner?.id === profileJson.id || pl.owner?.display_name === profileJson.display_name
        );
        const publicPlaylistsFiltered = allPlaylists.filter(pl => 
          pl.public === true && (pl.owner?.id !== profileJson.id && pl.owner?.display_name !== profileJson.display_name)
        );

        setUserPlaylists(userOwnedPlaylists);
        setPublicPlaylists(publicPlaylistsFiltered);

        const recentItems = Array.isArray(recentJson.items)
          ? recentJson.items.map((i) => i.track)
          : [];
        setRecentTracks(recentItems);
        
        const albums = (albumsJson.items ?? []).map(item => item.album).filter(Boolean);
        setSavedAlbums(albums);
      } catch (err) {
        console.error("Errore nella home:", err);
        if (err.message.includes("profilo")) {
          setSessionExpired();
        } else {
          setError(err.message || "Errore nel caricamento della home");
        }
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
              <ScrollRow title="Ascoltati di recente" seeAllLink="/recently-played">
                {recentTracks.length > 0 ? (
                  recentTracks.map((track, index) => (
                    <TrackCard
                      key={`${track.id || "track"}-${index}`}
                      track={track}
                      playOnly={true}
                    />
                  ))
                ) : (
                  <p style={{ color: 'var(--text-secondary)' }}>Nessun brano ascoltato di recente</p>
                )}
              </ScrollRow>

              <ScrollRow title="I tuoi album" seeAllLink="/albums">
                {savedAlbums.length > 0 ? (
                  savedAlbums.map((album, index) => (
                    <AlbumCard
                      key={`${album.id || "album"}-${index}`}
                      album={album}
                      onClick={() => router.push(`/album/${album.id}`)}
                    />
                  ))
                ) : (
                  <p style={{ color: 'var(--text-secondary)' }}>Nessun album salvato</p>
                )}
              </ScrollRow>

              {publicPlaylists.length > 0 && (
                <ScrollRow title="Playlist Pubbliche">
                  {publicPlaylists.map((pl, index) => (
                    <PlaylistCard
                      key={`${pl.id || "public-playlist"}-${index}`}
                      playlist={pl}
                      onClick={() => router.push(`/playlist/${pl.id}`)}
                    />
                  ))}
                </ScrollRow>
              )}

              <ScrollRow 
                title="Le tue playlist"
                seeAllLink="/playlists"
              >
                {userPlaylists.map((pl, index) => (
                  <PlaylistCard
                    key={`${pl.id || "playlist"}-${index}`}
                    playlist={pl}
                    onClick={() => router.push(`/playlist/${pl.id}`)}
                  />
                ))}
              </ScrollRow>
            </>
          )}
        </main>
      </div> 
      <Player />
      <PlayerDebug />
    </div>
  );
}
