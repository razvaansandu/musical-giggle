"use client";

import styles from "./TrackList.module.css";

export default function TrackList({ tracks }) {
  // Funzione per formattare la durata in mm:ss
    const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Funzione per gestire il click su una traccia
  const handlePlay = async (track) => {
    try {
      const uri = track?.uri ?? track?.track?.uri;
      if (!uri) {
        console.warn("Nessuna URI per questa traccia:", track);
        return;
      }

      // Avvia la riproduzione della traccia selezionata
      await fetch("/api/player/start-resume-playback", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uris: [uri] }),
      });
    } catch (err) {
      console.error("Errore durante la riproduzione:", err);
    }
  };

  // Render della lista delle tracce
  return (
    <div className={styles.trackListContainer}>
      <div className={styles.trackListHeader}>
        <div className={styles.colIndex}>#</div>
        <div className={styles.colTitle}>Titolo</div>
        <div className={styles.colArtist}>Artista</div>
        <div className={styles.colAlbum}>Album</div>
        <div className={styles.colDuration}>Durata</div>
      </div>

      {/* Lista delle tracce */}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
