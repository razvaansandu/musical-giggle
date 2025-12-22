"use client";

import styles from "./TrackList.module.css";
import ContextMenu from "../ContextMenu/ContextMenu";
import { useState } from "react";
import { useContextMenu } from "../../hooks/useContextMenu";
import LikeButton from "../buttons/LikeButton";
import { useRouter } from "next/navigation";

export default function TrackList({ tracks }) {
  const [selectedTrack, setSelectedTrack] = useState(null);
  const contextMenu = useContextMenu();
  const router = useRouter();

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handlePlay = async (clickedTrack) => {
    try {
      const uri = clickedTrack?.uri ?? clickedTrack?.track?.uri;
      if (!uri) {
        console.warn("Nessuna URI per questa traccia:", clickedTrack);
        return;
      }

      const allUris = tracks
        .map((t) => t?.uri ?? t?.track?.uri)
        .filter(Boolean);

      const clickedIndex = allUris.indexOf(uri);

      let orderedUris;
      if (clickedIndex !== -1) {
        orderedUris = [
          ...allUris.slice(clickedIndex),
          ...allUris.slice(0, clickedIndex),
        ];
      } else {
        orderedUris = allUris;
      }

      console.log(`Avvio coda con ${orderedUris.length} tracce`);

      await fetch("/api/player/start-resume-playback", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uris: orderedUris }), 
      });

      console.log("Coda creata correttamente!");
    } catch (err) {
      console.error("Errore durante la riproduzione:", err);
    }
  };

  return (
    <div className={styles.trackListContainer}>
      <div className={styles.trackListHeader}>
        <div className={styles.colIndex}>#</div>
        <div className={styles.colTitle}>Titolo</div>
        <div className={styles.colArtist}>Artista</div>
        <div className={styles.colAlbum}>Album</div>
        <div className={styles.colDuration}>Durata</div>
        <div className={styles.colLike}></div>
      </div>

      <div className={styles.trackListBody}>
        {tracks.map((track, index) => {
          const stableId = track?.id ?? track?.track?.id ?? track?.uri ?? `track-${index}`;
          const imageUrl = track?.album?.images?.[0]?.url ?? track?.track?.album?.images?.[0]?.url ?? "/placeholder.png";
          const name = track?.name ?? track?.track?.name ?? "Unknown";
          const artists = (track?.artists ?? track?.track?.artists) || [];
          const albumName = track?.album?.name ?? track?.track?.album?.name ?? "-";
          const duration = track?.duration_ms ?? track?.track?.duration_ms ?? 0;

          return (
            <div
              key={stableId}
              className={styles.trackRow}
              onClick={() => handlePlay(track)}
              onContextMenu={(e) => {
                e.preventDefault();
                contextMenu.handleContextMenu(e);
                setSelectedTrack(track);
              }}
            >
              <div className={styles.colIndex}>{index + 1}</div>
              <div className={styles.colTitle}>
                <img
                  src={imageUrl}
                  alt={name}
                  className={styles.trackImage}
                />
                <div className={styles.trackName}>{name}</div>
              </div>
              <div className={styles.colArtist}>
                {artists.map((a) => a.name).join(", ")}
              </div>
              <div className={styles.colAlbum}>{albumName}</div>
              <div className={styles.colDuration}>
                {formatDuration(duration)}
              </div>
              <div className={styles.colLike} onClick={(e) => e.stopPropagation()}>
                <LikeButton trackId={stableId} />
              </div>
            </div>
          );
        })}
      </div>

      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        items={getTrackContextMenuItems()}
        onClose={contextMenu.close}
      />
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
        id: "play-now",
        label: "Riproduci",
        icon: "▶",
        action: () => handlePlay(track), 
      },
      {
        id: "add-to-queue",
        label: "Aggiungi alla coda",
        icon: "",
        action: async () => {
          try {
            const uri = track?.uri ?? track?.track?.uri;
            if (!uri) throw new Error("URI della traccia non trovata");
            const res = await fetch(`/api/player/add-item-to-playback-queue?uri=${encodeURIComponent(uri)}`, {
              method: "POST",
            });
            if (res.ok) {
              console.log("Traccia aggiunta alla coda");
            } else {
              throw new Error("Errore nell'aggiungere alla coda");
            }
          } catch (err) {
            console.error(err);
          }
        },
      },
      {
        id: "add-to-playlist",
        label: "Aggiungi a una playlist",
        icon: "",
        action: () => {
          console.log("Aggiungi a playlist:", trackId);
        },
      },
      {
        id: "like",
        label: "Salva nel tuo profilo",
        icon: "",
        action: async () => {
          try {
            const res = await fetch("/api/tracks/saved", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ids: [trackId] }),
            });
            if (res.ok) {
              console.log("Brano salvato");
            } else {
              throw new Error("Errore nel salvare il brano");
            }
          } catch (err) {
            console.error(err);
          }
        },
      },
      {
        id: "unlikely",
        label: "Rimuovi dai tuoi salvataggi",
        icon: "",
        action: async () => {
          try {
            const res = await fetch("/api/tracks/saved", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ids: [trackId] }),
            });
            if (res.ok) {
              console.log("✅ Brano rimosso");
            } else {
              throw new Error("Errore nel rimuovere il brano");
            }
          } catch (err) {
            console.error(err);
          }
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
      {
        id: "go-to-album",
        label: "Vai all'album",
        icon: "",
        action: () => {
          const albumId = track?.album?.id ?? track?.track?.album?.id;
          if (albumId) {
            router.push(`/albums/${albumId}`);
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
      { divider: true },
      {
        id: "report",
        label: "Segnala",
        icon: "",
        danger: true,
        action: () => {
          console.log("Segnala brano:", trackId);
        },
      },
    ];
  }
}
