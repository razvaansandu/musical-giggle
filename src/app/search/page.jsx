"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import styles from "../home/home.module.css";

import SpotifyHeader from "../../components/Header/SpotifyHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import Player from "../../components/Player/Player";

import TrackCard from "../../components/Cards/TrackCard";
import ArtistCard from "../../components/Cards/ArtistCard";
import AlbumCard from "../../components/Cards/AlbumCard";
import PlaylistCard from "../../components/Cards/PlaylistCard";
import Loader from "../../components/Loader/Loader";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;

    const doSearch = async () => {
      setLoading(true);

      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();

      setTracks(data.tracks?.items || []);
      setArtists(data.artists?.items || []);
      setAlbums(data.albums?.items || []);
      setPlaylists(data.playlists?.items || []);

      setLoading(false);
    };

    doSearch();
  }, [q]);

  return (
    <div className={styles.container}>
      <SpotifyHeader />

      <div className={styles.content}>
        <Sidebar />

        <main className={styles.mainContent}> 
          <h1 className="">Results For: “{q}”</h1>   
          {!loading && ( 
            <>
              {tracks.length > 0 && (
                <section className={styles.section}>
               
                  <div className={styles.grid}>
                    {tracks.map(t => (
                      <TrackCard key={t.id} track={t} />
                    ))}
                  </div>
                </section>
              )}

              {artists.length > 0 && (
                <section className={styles.section}>
                  <h2>Artists</h2>
                  <div className={styles.grid}>
                    {artists.map(a => (
                      <ArtistCard key={a.id} artist={a} />
                    ))}
                  </div>
                </section>
              )}

              {playlists.length > 0 && (
                <section className={styles.section}>
                  <h2>Playlists</h2>
                  <div className={styles.grid}>
                    {playlists
                      .filter(p => p && p.id)   
                      .map(p => (
                        <PlaylistCard key={p.id} playlist={p} />
                      ))}
                  </div>
                </section>
              )}

              {albums.length > 0 && (
                <section className={styles.section}>
                  <h2>Albums</h2>
                  <div className={styles.grid}>
                    {albums.map(al => (
                      <AlbumCard
                        key={al.id}
                        album={al}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {loading && <Loader />}
        </main>
      </div>

      <Player />
    </div>
  );
}
