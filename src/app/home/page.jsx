"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./home.module.css";
import { useSessionManager } from "../../hooks/useSessionManager";

import SpotifyHeader from "../../components/Header/SpotifyHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import Player from "../../components/Player/Player";
import ScrollRow from "../../components/ScrollRow/ScrollRow";

import TrackCard from "../../components/Cards/TrackCard";
import PlaylistCard from "../../components/Cards/PlaylistCard";
import AlbumCard from "../../components/Cards/AlbumCard";
import Loader from "../../components/Loader/Loader";
import ButtonAddToPlaylist from "../../components/buttons/ButtonAddToPlaylist";

export default function HomePage() {
  const router = useRouter();
  const { setSessionExpired } = useSessionManager();
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState([]);
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

        // Filtra le playlist: solo pubbliche e playlist dell'utente
        const allPlaylists = playlistsJson.items ?? playlistsJson ?? [];
        const userOwnedPlaylists = allPlaylists.filter(pl => 
          pl.owner?.id === profileJson.id || pl.owner?.display_name === profileJson.display_name
        );
        const publicPlaylists = allPlaylists.filter(pl => 
          pl.public === true && (pl.owner?.id !== profileJson.id && pl.owner?.display_name !== profileJson.display_name)
        );

        setPlaylists(allPlaylists);
        setUserPlaylists(userOwnedPlaylists);
        setPublicPlaylists(publicPlaylists);

        // Brani recentemente ascoltati
        const recentItems = Array.isArray(recentJson.items)
          ? recentJson.items.map((i) => i.track)
          : [];
        setRecentTracks(recentItems);
        
        // Albums are wrapped in { album: {...} } objects
        const albums = (albumsJson.items ?? []).map(item => item.album).filter(Boolean);
        setSavedAlbums(albums);
      } catch (err) {
        console.error("Errore nella home:", err);
        // Se c'è un errore nel caricamento del profilo, significa che la sessione è scaduta
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              <div className={styles.filterButtons}>
                <button 
                  className={`${styles.buttonGabry} ${activeFilter === 'all' ? styles.buttonGabryActive : ''}`}
                  onClick={() => setActiveFilter('all')}
                > 
                  Tutto  
                </button> 
                <button 
                  className={`${styles.buttonGabry} ${activeFilter === 'playlists' ? styles.buttonGabryActive : ''}`}
                  onClick={() => setActiveFilter('playlists')}
                > 
                  Playlist  
                </button> 
                <button 
                  className={`${styles.buttonGabry} ${activeFilter === 'albums' ? styles.buttonGabryActive : ''}`}
                  onClick={() => setActiveFilter('albums')}
                > 
                  Album   
                </button>  
                <button 
                  className={`${styles.buttonGabry} ${activeFilter === 'artists' ? styles.buttonGabryActive : ''}`}
                  onClick={() => setActiveFilter('artists')}
                > 
                  Artist   
                </button>  
              </div>

              {activeFilter === 'all' && (
                <>
                  <ScrollRow title="Recently played" seeAllLink="/search">
                    {recentTracks.map((track, index) => (
                      <TrackCard
                        key={`${track.id || "track"}-${index}`}
                        track={track}
                        onClick={() => router.push(`/track/${track.id}`)}
                      />
                    ))}
                  </ScrollRow>
            <>
              {/* RECENTLY PLAYED */}
              <ScrollRow title="Ascoltati di recente">
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

              {/* YOUR ALBUMS */}
              <ScrollRow title="I tuoi album" seeAllLink="/search">
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

              {/* PUBLIC PLAYLISTS */}
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

              {/* YOUR PLAYLISTS */}
              <ScrollRow 
                title="Le tue playlist" 
                rightElement={
                  <ButtonAddToPlaylist
                    onSuccess={(created) => {
                      setUserPlaylists((prev) => [created, ...(prev || [])]);
                    }}
                  />
                }
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
    </div>
  );
}
