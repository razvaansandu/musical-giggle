"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./Player.module.css";
import { initWebPlayer, getDeviceId } from "../../lib/webPlayer";


export default function Player() {
  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeat, setRepeat] = useState("off");

  const intervalRef = useRef(null);

  const fetchCurrent = async () => {
    try {
      const res = await fetch("/api/player/get-currently-playing-track");

      if (res.status === 204) {
        setCurrent(null);
        setIsPlaying(false);
        return;
      }

      const data = await res.json();
      setCurrent(data.item);
      setIsPlaying(data.is_playing);
      setProgress(data.progress_ms);
      setDuration(data.item?.duration_ms || 0);
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

    intervalRef.current = setInterval(fetchCurrent, 1500);
    return () => clearInterval(intervalRef.current);
  }, []);

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

  const handleNext = async () => {
    try {
      await fetch("/api/player/skip-to-next", { method: "POST" });
      fetchCurrent();
    } catch (err) {
      console.error("Errore next", err);
    }
  };

  const handlePrev = async () => {
    try {
      await fetch("/api/player/skip-to-previous", { method: "POST" });
      fetchCurrent();
    } catch (err) {
      console.error("Errore previous", err);
    }
  };
  //Player prima che si clicchi la canzone
  if (!current) {
    return (
      <p className={styles.playerBar1}>cosa vuoi ascoltare?</p>

    )
  }

  const img = current?.album?.images?.[0]?.url;

  // Render del player
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
        <ButtonPrevSong></ButtonPrevSong>
        {isPlaying ? <StopButton></StopButton> : <PlayButton></PlayButton>}
        <ButtonNextSong></ButtonNextSong>
      </div>
      <div className={styles.right}>
        {/* qui in futuro puoi rimettere il tuo Volume.tsx */}
      </div>
    </div>
  );
} 
