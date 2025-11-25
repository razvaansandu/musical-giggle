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

  const handleSeek = async (ms) => {
    try {
      const newPos = Math.max(0, progress + ms);

      await fetch(`/api/player/seek-to-position?position_ms=${newPos}`, {
        method: "PUT"
      });

      setProgress(newPos);
    } catch (err) {
      console.error("Errore seek", err);
    }
  };

  // Controllo se il deviceId è disponibile
  const deviceId = getDeviceId();
  if (!deviceId) {
    return (
      <div className={styles.playerBar}>
        <div className={styles.empty}>
          Sto inizializzando il Web Player...
        </div>
      </div>
    );
  }

  // Controllo se c'è un brano in riproduzione
  if (!current) {
    return (
      <div className={styles.playerBar}>
        <div className={styles.empty}>Nessun brano in riproduzione.</div>
      </div>
    );
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
        <button onClick={() => handleSeek(-10000)} className={styles.iconBtn}>
          -10s
        </button>

        <button onClick={handlePrev} className={styles.iconBtn}>
          ⏮
        </button>

        <button onClick={handlePlayPause} className={styles.playBtn}>
          {isPlaying ? "⏸" : "▶"}
        </button>

        <button onClick={handleNext} className={styles.iconBtn}>
          ⏭
        </button>

        <button onClick={() => handleSeek(+10000)} className={styles.iconBtn}>
          +10s
        </button>

      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${(progress / duration) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
