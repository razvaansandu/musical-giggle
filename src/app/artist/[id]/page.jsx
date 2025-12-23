"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import styles from "../../home/home.module.css";

import SpotifyHeader from "../../../components/Header/SpotifyHeader";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Player from "../../../components/Player/Player";
import AlbumCard from "../../../components/Cards/AlbumCard";
import ArtistHero from "../../../components/Cards/ArtistHero";
import TrackList from "../../../components/TrackList/TrackList";
import Loader from "../../../components/Loader/Loader";
import ScrollRow from "../../../components/ScrollRow/ScrollRow";
import ContextMenu from "../../../components/ContextMenu/ContextMenu";
import { useContextMenu } from "../../../hooks/useContextMenu"; 
 
export default function ArtistPage() { 
  const { id } = useParams();
  const router = useRouter();
  const contextMenu = useContextMenu();

  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [artistRes, topRes, albumsRes] = await Promise.all([
          fetch(`/api/artist/${id}`),
          fetch(`/api/artist/top-tracks/${id}`),
          fetch(`/api/artist/albums/${id}`),
        ]);

        const artistJson = await artistRes.json();
        const topJson = await topRes.json();
        const albumsJson = await albumsRes.json();

        if (!artistRes.ok) throw new Error("Errore caricamento artista");
        if (!topRes.ok) throw new Error("Errore caricamento top tracks");
        if (!albumsRes.ok) throw new Error("Errore caricamento albums");

        setArtist(artistJson);
        setTopTracks(topJson.tracks || []);
        setAlbums(albumsJson.items || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Errore caricamento artista");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className={styles.container}>
      <SpotifyHeader />

      <div className={styles.content}>
        <Sidebar />

        <main className={styles.mainContent}>
          {loading && <Loader />}
          {error && !loading && <p style={{ color: "#f87171" }}>{error}</p>}

          {!loading && artist && (
            <>
              <ArtistHero artist={artist} />

              <section className={styles.section}>
                <h2>Popular</h2>
                <TrackList tracks={topTracks.slice(0, 5)} />
              </section>

              <section className={styles.section}>
                <h2>Albums</h2>
                <ScrollRow>
                  {albums.map((a) => (
                    <AlbumCard 
                      key={a.id} 
                      album={a}
                      onClick={() => router.push(`/album/${a.id}`)}
                      onContextMenu={(e, album) => {
                        e.preventDefault();
                        contextMenu.handleContextMenu(e);
                        setSelectedAlbum(album);
                      }}
                    />
                  ))}
                </ScrollRow>
              </section>
            </>
          )}
        </main>
      </div>

      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        items={getAlbumContextMenuItems()}
        onClose={contextMenu.close}
      />

      <Player />
    </div>
  );

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
  }}