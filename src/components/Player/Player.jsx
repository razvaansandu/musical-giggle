"use client";

import { useEffect, useState } from "react";
import styles from "./Player.module.css";

export default function Player() {
  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchCurrent = async () => {
    try {
      const res = await fetch("/api/player/get-currently-playing-track");

      // 204 = nessun brano in riproduzione
      if (res.status === 204) {
        setCurrent(null);
        setIsPlaying(false);
        return;
      }

      const data = await res.json();
      setCurrent(data.item || null);
      setIsPlaying(data.is_playing || false);
    } catch (err) {
      console.error("Errore stato player", err);
    }
  };

  useEffect(() => {
    fetchCurrent();
    const id = setInterval(fetchCurrent, 5000); // aggiorna ogni 5s
    return () => clearInterval(id);
  }, []);

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await fetch("/api/player/pause-playback", {
          method: "PUT",        // se nel route hai messo POST, cambia anche qui
        });
        setIsPlaying(false);
      } else {
        await fetch("/api/player/start-resume-playback", {
          method: "PUT",        // idem sopra
        });
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Errore play/pause", err);
    }
  };

  const handleNext = async () => {
    try {
      await fetch("/api/player/skip-to-next", {
        method: "POST",
      });
      fetchCurrent();
    } catch (err) {
      console.error("Errore next", err);
    }
  };

  const handlePrev = async () => {
    try {
      await fetch("/api/player/skip-to-previous", {
        method: "POST",
      });
      fetchCurrent();
    } catch (err) {
      console.error("Errore previous", err);
    }
  };

  if (!current) {
    return null;
  }

  const img = current?.album?.images?.[0]?.url;

  return (
    <div className={styles.playerBar}>
      <div className={styles.left}>
        {img && (
          <img
            src={img}
            alt={current.name}
            className={styles.cover}
          />
        )}
        <div>
          <div className={styles.title}>{current.name}</div>
          <div className={styles.artist}>
            {current.artists?.map((a) => a.name).join(", ")}
          </div>
        </div>
      </div>

      <div className={styles.center}>
        <button
          onClick={handlePrev}
          className={styles.iconBtn}
          aria-label="Previous"
        >
          &#9664;&#9664;
        </button>

        <button
          onClick={handlePlayPause}
          className={styles.playBtn}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <button
          onClick={handleNext}
          className={styles.iconBtn}
          aria-label="Next"
        >
          &#9654;&#9654;
        </button>
      </div>

      <div className={styles.right}>
        {/* qui in futuro puoi rimettere il tuo Volume.tsx */}
      </div>
    </div>
  );
}
