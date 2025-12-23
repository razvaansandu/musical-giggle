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
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import { useContextMenu } from "../../hooks/useContextMenu";

export default function HomePage() {
  const router = useRouter();
  const { setSessionExpired } = useSessionManager();
  const contextMenu = useContextMenu();
  
  const [profile, setProfile] = useState(null);
  const [publicPlaylists, setPublicPlaylists] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  const [savedAlbums, setSavedAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
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
        const uniqueRecentTracks = recentItems.filter((track, index, self) => 
          self.findIndex(t => t.id === track.id) === index
        );
        setRecentTracks(uniqueRecentTracks);
        
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
                      onContextMenu={(e, track) => {
                        e.preventDefault();
                        contextMenu.handleContextMenu(e);
                        setSelectedTrack(track);
                      }}
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
                      onContextMenu={(e, album) => {
                        e.preventDefault();
                        contextMenu.handleContextMenu(e);
                        setSelectedAlbum(album);
                      }}
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
                      onContextMenu={(e, playlist) => {
                        e.preventDefault();
                        contextMenu.handleContextMenu(e);
                        setSelectedPlaylist(playlist);
                      }}
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
                    onContextMenu={(e, playlist) => {
                      e.preventDefault();
                      contextMenu.handleContextMenu(e);
                      setSelectedPlaylist(playlist);
                    }}
                  />
                ))}
              </ScrollRow>
            </>
          )}
        </main>
      </div>

      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        items={
          selectedTrack ? getTrackContextMenuItems() :
          selectedPlaylist ? getPlaylistContextMenuItems() :
          getAlbumContextMenuItems()
        }
        onClose={contextMenu.close}
      />

      <Player />
    </div>
  );

  function getTrackContextMenuItems() {
    if (!selectedTrack) return [];
    const track = selectedTrack;
    const trackName = track?.name ?? track?.track?.name ?? "Unknown";
    const trackId = track?.id ?? track?.track?.id ?? track?.uri;
    const artistIds = (track?.artists ?? track?.track?.artists ?? []).map(a => a.id);

    return [
      {
        id: "go-to-artist",
        label: "Vai all'artista",
        icon: "",
        action: () => {
          if (artistIds.length > 0) {
            router.push(`/artist/${artistIds[0]}`);
          }
        },
      },
      {
        id: "go-to-album",
        label: "Vai all'album",
        icon: "",
        action: () => {
          const albumId = track?.album?.id ?? track?.track?.album?.id;
          if (albumId) {
            router.push(`/album/${albumId}`);
          }
        },
      },
      { divider: true },
      {
        id: "copy-link",
        label: "Copia link",
        icon: "",
        action: () => {
          const link = `https://open.spotify.com/track/${trackId}`;
          navigator.clipboard.writeText(link);
        },
      },
      {
        id: "share",
        label: "Condividi",
        icon: "",
        action: () => {
          const link = `https://open.spotify.com/track/${trackId}`;
          navigator.clipboard.writeText(link);
        },
      },
    ];
  }

  function getPlaylistContextMenuItems() {
    if (!selectedPlaylist) return [];

    const playlist = selectedPlaylist;
    const playlistId = playlist.id;
    const playlistName = playlist.name;

    return [
      {
        id: "go-to-playlist",
        label: "Apri playlist",
        icon: "▶",
        action: () => {
          router.push(`/playlist/${playlistId}`);
        },
      },
      { divider: true },
      {
        id: "copy-link",
        label: "Copia link",
        icon: "",
        action: () => {
          const link = `https://open.spotify.com/playlist/${playlistId}`;
          navigator.clipboard.writeText(link);
        },
      },
      {
        id: "share",
        label: "Condividi",
        icon: "",
        action: () => {
          const link = `https://open.spotify.com/playlist/${playlistId}`;
          navigator.clipboard.writeText(link);
        },
      },
    ];
  }

  function getAlbumContextMenuItems() {
    if (!selectedAlbum) return [];

    const album = selectedAlbum;
    const albumId = album.id;
    const albumName = album.name;
    const artistIds = (album.artists || []).map(a => a.id);

    return [
      {
        id: "go-to-album",
        label: "Apri album",
        icon: "▶",
        action: () => {
          router.push(`/album/${albumId}`);
        },
      },
      { divider: true },
      {
        id: "go-to-artist",
        label: "Vai all'artista",
        icon: "",
        action: () => {
          if (artistIds.length > 0) {
            router.push(`/artist/${artistIds[0]}`);
          }
        },
      },
      { divider: true },
      {
        id: "copy-link",
        label: "Copia link",
        icon: "",
        action: () => {
          const link = `https://open.spotify.com/album/${albumId}`;
          navigator.clipboard.writeText(link);
        },
      },
      {
        id: "share",
        label: "Condividi",
        icon: "",
        action: () => {
          const link = `https://open.spotify.com/album/${albumId}`;
          navigator.clipboard.writeText(link);
        },
      },
    ];
  }
}