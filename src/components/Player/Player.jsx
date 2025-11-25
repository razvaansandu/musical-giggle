"use client";

import { useEffect, useState } from "react";
import styles from "./Player.module.css";
import { initWebPlayer, getDeviceId } from "../../lib/webPlayer";

export default function Player() {
  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeDevice, setActiveDevice] = useState(null);

  // 1. RECUPERO DEVICE ATTIVO
  const fetchActiveDevice = async () => {
    try {
      const res = await fetch("/api/player/get-available-devices");
      const data = await res.json();

      const active = data.devices.find((d) => d.is_active);

      if (active) {
        setActiveDevice(active.id);
      } else {
        // se hai un Web Player disponibile lo setti come device
        const web = data.devices.find((d) => d.type === "Computer");
        if (web) setActiveDevice(web.id);
      }
    } catch (err) {
      console.error("Errore device", err);
    }
  };

  // 2. RECUPERO TRACK ATTUALE
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
      console.error("Errore fetchCurrent", err);
    }
  };

  // 3. INIZIALIZZAZIONE WEB PLAYER
  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      initWebPlayer(async () => {
        const cookie = document.cookie
          .split("; ")
          .find((r) => r.startsWith("auth_code="));
        return cookie?.split("=")[1] || "";
      });
    };

    const interval1 = setInterval(fetchCurrent, 2000);
    const interval2 = setInterval(fetchActiveDevice, 2000);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, []);

  // 4. PLAY/PAUSE LOGICA IBRIDA
  const handlePlayPause = async () => {
    try {
      const webDevice = getDeviceId();
      const device = activeDevice || webDevice;

      if (!device) {
        console.warn("Nessun device attivo");
        return;
      }

      if (isPlaying) {
        await fetch(`/api/player/pause-playback?device_id=${device}`, {
          method: "PUT",
        });
        setIsPlaying(false);
      } else {
        await fetch(`/api/player/start-resume-playback?device_id=${device}`, {
          method: "PUT",
        });
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Errore play/pause", err);
    }
  };

  // 5. NEXT
  const handleNext = async () => {
    try {
      const device = activeDevice || getDeviceId();
      await fetch(`/api/player/skip-to-next?device_id=${device}`, {
        method: "POST",
      });
      fetchCurrent();
    } catch (err) {
      console.error("Errore next", err);
    }
  };

  // 6. PREVIOUS
  const handlePrev = async () => {
    try {
      const device = activeDevice || getDeviceId();
      await fetch(`/api/player/skip-to-previous?device_id=${device}`, {
        method: "POST",
      });
      fetchCurrent();
    } catch (err) {
      console.error("Errore previous", err);
    }
  };

  // UI
  if (!current) {
    return (
      <div className={styles.playerBar}>
        <div className={styles.empty}>
          Nessun brano in riproduzione. Usa una track per iniziare.
        </div>
      </div>
    );
  }

  const img = current?.album?.images?.[0]?.url;

  return (
    <div className={styles.playerBar}>
      <div className={styles.left}>
        {img && <img src={img} alt={current.name} className={styles.cover} />}
        <div>
          <div className={styles.title}>{current.name}</div>
          <div className={styles.artist}>
            {current.artists?.map((a) => a.name).join(", ")}
          </div>
        </div>
      </div>

      <div className={styles.center}>
        <button onClick={handlePrev} className={styles.iconBtn}>
          &#9664;&#9664;
        </button>

        <button onClick={handlePlayPause} className={styles.playBtn}>
          {isPlaying ? "⏸" : "▶"}
        </button>

        <button onClick={handleNext} className={styles.iconBtn}>
          &#9654;&#9654;
        </button>
      </div>

      <div className={styles.right}></div>
    </div>
  );
}
