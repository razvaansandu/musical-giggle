"use client";

import { useEffect, useState } from "react";
import styles from "./Player.module.css";
import { initWebPlayer, getDeviceId } from "../../lib/webPlayer";

export default function Player() {
  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchCurrent = async () => {
    try {
      const res = await fetch("/api/player/get-currently-playing-track");

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
    window.onSpotifyWebPlaybackSDKReady = () => {
      initWebPlayer(async () => {
        const cookie = document.cookie
          .split("; ")
          .find(r => r.startsWith("auth_code="));
        return cookie?.split("=")[1] || "";
      });
    };

    const interval = setInterval(fetchCurrent, 2000);
    return () => clearInterval(interval);
  }, []);

  // ▶ PLAY / PAUSE
  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await fetch("/api/player/pause-playback", { method: "PUT" });
        setIsPlaying(false);
      } else {
        await fetch("/api/player/start-resume-playback", { method: "PUT" });
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Errore play/pause", err);
    }
  };

  // ▶ NEXT
  const handleNext = async () => {
    try {
      await fetch("/api/player/skip-to-next", { method: "POST" });
      fetchCurrent();
    } catch (err) {
      console.error("Errore next", err);
    }
  };

  // ▶ PREVIOUS
  const handlePrev = async () => {
    try {
      await fetch("/api/player/skip-to-previous", { method: "POST" });
      fetchCurrent();
    } catch (err) {
      console.error("Errore previous", err);
    }
  };

  // ------------- FIX MESSAGGIO ERRATO -------------
  const deviceId = getDeviceId();

  // 1) Player non pronto → mostra solo "inizializzo"
  if (!deviceId) {
    return (
      <div className={styles.playerBar}>
        <div className={styles.empty}>🎧 Sto inizializzando il player...</div>
      </div>
    );
  }

  // 2) Device pronto ma nessuna traccia in playback
  if (!current) {
    return (
      <div className={styles.playerBar}>
        <div className={styles.empty}>
          Nessun brano in riproduzione. Clicca una track per iniziare 💿
        </div>
      </div>
    );
  }

  const img = current?.album?.images?.[0]?.url;

  // ------------- PLAYER UI -------------
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
        <button onClick={handlePrev} className={styles.iconBtn} aria-label="Previous">
          &#9664;&#9664;
        </button>

        <button onClick={handlePlayPause} className={styles.playBtn} aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? "⏸" : "▶"}
        </button>

        <button onClick={handleNext} className={styles.iconBtn} aria-label="Next">
          &#9654;&#9654;
        </button>
      </div>

      <div className={styles.right}></div>
    </div>
  );
}
