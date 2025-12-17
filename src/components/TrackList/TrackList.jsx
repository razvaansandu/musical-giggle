"use client";

import styles from "./TrackList.module.css";
import ContextMenu from "../ContextMenu/ContextMenu";
import { useState } from "react";
import { useContextMenu } from "../../hooks/useContextMenu";
import LikeButton from "../buttons/LikeButton";

export default function TrackList({ tracks }) {
  const [selectedTrack, setSelectedTrack] = useState(null);
  const contextMenu = useContextMenu();
    const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handlePlay = async (track) => {
    try {
      const uri = track?.uri ?? track?.track?.uri;
      if (!uri) {
        console.warn("Nessuna URI per questa traccia:", track);
        return;
      }

      await fetch("/api/player/start-resume-playback", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uris: [uri] }),
      });
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
              key={`${stableId}-${index}`}
              className={styles.trackRow}
              onClick={() => handlePlay(track)}
              onContextMenu={(e) => {
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
        action: async () => {
          try {
            const uri = track?.uri ?? track?.track?.uri;
            if (!uri) throw new Error("URI della traccia non trovata");
            const res = await fetch("/api/player/start-resume-playback", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ uris: [uri] }),
            });
            if (res.ok) {
              console.log("▶ Riproduzione avviata");
            } else {
              throw new Error("Errore nell'avviare la riproduzione");
            }
          } catch (err) {
            console.error(err);
            alert("Errore: " + err.message);
          }
        },
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
              console.log(" Traccia aggiunta alla coda");
              alert("Brano aggiunto alla coda");
            } else {
              throw new Error("Errore nell'aggiungere alla coda");
            }
          } catch (err) {
            console.error(err);
            alert("Errore: " + err.message);
          }
        },
      },
      {
        id: "add-to-playlist",
        label: "Aggiungi a una playlist",
        icon: "",
        action: () => {
          console.log("Aggiungi a playlist:", trackId);
          alert("Funzionalità non ancora implementata. Accedi al menu delle playlist per aggiungere il brano.");
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
              console.log(" Brano salvato");
              alert("Brano aggiunto ai tuoi salvataggi");
            } else {
              throw new Error("Errore nel salvare il brano");
            }
          } catch (err) {
            console.error(err);
            alert("Errore: " + err.message);
          }
        },
      },
      {
        id: "unlike",
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
              console.log(" Brano rimosso");
              alert("Brano rimosso dai tuoi salvataggi");
            } else {
              throw new Error("Errore nel rimuovere il brano");
            }
          } catch (err) {
            console.error(err);
            alert("Errore: " + err.message);
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
          } else {
            alert("Artista non disponibile");
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
          } else {
            alert("Album non disponibile");
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
          alert("Link copiato!");
        },
      },
      {
        id: "share",
        label: "Condividi",
        icon: "",
        action: () => {
          const link = `https://open.spotify.com/track/${trackId}`;
          navigator.clipboard.writeText(link);
          alert("Link copiato!");
        },
      },
      { divider: true },
      {
        id: "report",
        label: "Segnala",
        icon: "",
        danger: true,
        action: () => {
          alert("Grazie per la segnalazione. Il nostro team la analizzerà presto.");
          console.log("Segnala brano:", trackId);
        },
      },
    ];
  }
}
