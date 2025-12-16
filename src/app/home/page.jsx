"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./home.module.css";

import SpotifyHeader from "../../components/Header/SpotifyHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import Player from "../../components/Player/Player";
import ScrollRow from "../../components/ScrollRow/ScrollRow";

import ArtistCard from "../../components/Cards/ArtistCard";
import TrackCard from "../../components/Cards/TrackCard";
import PlaylistCard from "../../components/Cards/PlaylistCard";
import AlbumCard from "../../components/Cards/AlbumCard";
import Loader from "../../components/Loader/Loader";
import ButtonAddToPlaylist from "../../components/buttons/ButtonAddToPlaylist";

export default function HomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [savedAlbums, setSavedAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

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
          albumsRes,
        ] = await Promise.all([
          fetch("/api/spotify/get-user-profile"),
          fetch("/api/spotify/get-user-top?type=artists&limit=20"),
          fetch("/api/spotify/get-user-top?type=tracks&limit=20"),
          fetch("/api/player/get-recently-played-tracks?limit=50"),
          fetch("/api/playlists/user?limit=50"),
          fetch("/api/albums/saved?limit=50"),
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
        const albumsJson = albumsRes.ok ? await albumsRes.json() : { items: [] };

        console.log("PROFILE:", profileJson);
        console.log("TOP ARTISTS:", topArtistsJson);
        console.log("TOP TRACKS:", topTracksJson);
        console.log("RECENT:", recentJson);
        console.log("PLAYLISTS:", playlistsJson);
        console.log("ALBUMS:", albumsJson);

        setProfile(profileJson);

        setTopArtists(topArtistsJson.items ?? []);
        setTopTracks(topTracksJson.items ?? []);

        const recentItems = Array.isArray(recentJson.items)
          ? recentJson.items.map((i) => i.track)
          : [];
        setRecentTracks(recentItems);

        setPlaylists(playlistsJson.items ?? playlistsJson ?? []);
        
        // Albums are wrapped in { album: {...} } objects
        const albums = (albumsJson.items ?? []).map(item => item.album).filter(Boolean);
        setSavedAlbums(albums);
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

              {/* FILTERED CONTENT */}
              {activeFilter === 'all' && (
                <>
                  {/* RECENTLY PLAYED */}
                  <ScrollRow title="Recently played" seeAllLink="/recently-played">
                    {recentTracks.map((track, index) => (
                      <TrackCard
                        key={`${track.id || "track"}-${index}`}
                        track={track}
                        onClick={() => router.push(`/track/${track.id}`)}
                      />
                    ))}
                  </ScrollRow>

                  {/* YOUR ALBUMS */}
                  <ScrollRow title="Your albums" seeAllLink="/albums">
                    {savedAlbums.map((album, index) => (
                      <AlbumCard
                        key={`${album.id || "album"}-${index}`}
                        album={album}
                        onClick={() => router.push(`/album/${album.id}`)}
                      />
                    ))}
                  </ScrollRow> 

                  {/* YOUR PLAYLISTS */}
                  <ScrollRow 
                    title="Your playlists" 
                    seeAllLink="/playlists"
                    rightElement={
                      <ButtonAddToPlaylist
                        onSuccess={(created) => {
                          setPlaylists((prev) => [created, ...(prev || [])]);
                        }}
                      />
                    }
                  >
                    {playlists.map((pl, index) => (
                      <PlaylistCard
                        key={`${pl.id || "playlist"}-${index}`}
                        playlist={pl}
                        onClick={() => router.push(`/playlist/${pl.id}`)}
                      />
                    ))}
                  </ScrollRow>

                  {/* TOP ARTISTS */}
                  <ScrollRow title="Your top artists" seeAllLink="/top-artists">
                    {topArtists.map((artist, index) => (
                      <ArtistCard
                        key={`${artist.id || "artist"}-${index}`}
                        artist={artist}
                        onClick={() => router.push(`/artist/${artist.id}`)}
                      />
                    ))}
                  </ScrollRow>

                  {/* TOP TRACKS */}
                  <ScrollRow title="Your top tracks" seeAllLink="/top-tracks">
                    {topTracks.map((track, index) => (
                      <TrackCard
                        key={`${track.id || "top-track"}-${index}`}
                        track={track}
                        onClick={() => router.push(`/track/${track.id}`)}
                      />
                    ))}
                  </ScrollRow>
                </>
              )}

              {activeFilter === 'playlists' && (
                <ScrollRow 
                  title="Your playlists" 
                  seeAllLink="/playlists"
                  rightElement={
                    <ButtonAddToPlaylist
                      onSuccess={(created) => {
                        setPlaylists((prev) => [created, ...(prev || [])]);
                      }}
                    />
                  }
                >
                  {playlists.map((pl, index) => (
                    <PlaylistCard
                      key={`${pl.id || "playlist"}-${index}`}
                      playlist={pl}
                      onClick={() => router.push(`/playlist/${pl.id}`)}
                    />
                  ))}
                </ScrollRow>
              )}

              {activeFilter === 'albums' && (
                <ScrollRow title="Your saved albums" seeAllLink="/albums">
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
              )}

              {activeFilter === 'artists' && (
                <ScrollRow title="Your top artists" seeAllLink="/top-artists">
                  {topArtists.map((artist, index) => (
                    <ArtistCard
                      key={`${artist.id || "artist"}-${index}`}
                      artist={artist}
                      onClick={() => router.push(`/artist/${artist.id}`)}
                    />
                  ))}
                </ScrollRow>
              )}
            </>
          )}
        </main>
      </div> 
      <Player />
    </div>
  );
}
