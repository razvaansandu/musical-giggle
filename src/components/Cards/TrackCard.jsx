"use client";

import styles from "./Card.module.css";

export default function TrackCard({ 
  track, 
  onClick,          
  allTracks = null,  
  playOnly = false   
}) {
  if (!track) return null;

  const img = track?.album?.images?.[0]?.url || 
              track?.track?.album?.images?.[0]?.url || 
              "/default-track.png";
  
  const name = track?.name || track?.track?.name || "Unknown";
  const artists = (track?.artists || track?.track?.artists || []);

  const handlePlay = async () => {
    if (onClick) {
      onClick();
      return;
    }

    if (playOnly) {
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
        console.error("Errore avvio riproduzione:", err);
      }
      return;
    }

    try {
      const uri = track?.uri ?? track?.track?.uri;
      if (!uri) {
        console.warn("Nessuna URI per questa traccia:", track);
        return;
      }

      let uris;

      if (allTracks && allTracks.length > 0) {
        const allUris = allTracks
          .map(t => t?.uri ?? t?.track?.uri)
          .filter(Boolean);
        
        const clickedIndex = allUris.indexOf(uri);

        if (clickedIndex !== -1) {
          uris = [
            ...allUris.slice(clickedIndex),
            ...allUris.slice(0, clickedIndex),
          ];
          console.log(`Coda con ${uris.length} tracce`);
        } else {
          uris = [uri];
        }
      } else {
        uris = [uri];
        console.log("Singola traccia (nessun allTracks passato)");
      }

      await fetch("/api/player/start-resume-playback", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uris }),
      });

    } catch (err) {
      console.error("Errore avvio riproduzione:", err);
    }
  };

  return (
    <button type="button" className={styles.card} onClick={handlePlay}>
      <div
        className={styles.imageWrapper}
        style={{ backgroundImage: `url(${img})` }}
      />
      <h3 className={styles.title}>{name}</h3>
      <p className={styles.subtitle}>
        {artists.map((a) => a.name).join(", ") || "Unknown Artist"}
      </p>
    </button>
  );
}
