"use client";

import { useEffect, useState } from "react";
import styles from "./Player.module.css";
import { initWebPlayer, getDeviceId } from "../../lib/webPlayer";
import PlayButton from "../buttons/PlayButton";
import ButtonNextSong from "../buttons/buttonNextSong";
import ButtonPrevSong from "../buttons/songButtonFirst";
import StopButton from "../buttons/stopButton";
import VolumeButton from "../volume/Volume";
import ButtonShuffle from "../buttons/buttonShuffle";


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

  const deviceId = getDeviceId();

  if (deviceId) {
    return (
      <div className={styles.playerBar}>
        <div className={styles.empty}>🎧 Sto inizializzando il player...</div>
      </div>
    );
  }

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
       <ButtonPrevSong/>
        </button>

        <button onClick={handlePlayPause} className={styles.playBtn} aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? <StopButton/> : <PlayButton/>}
        </button>

        <button onClick={handleNext} className={styles.iconBtn} aria-label="Next">
          <ButtonNextSong/>
        </button>
        <button onClick={handleNext} className={styles.iconBtn}>
          <ButtonShuffle/>
        </button>
      </div>
      <div>
          <VolumeButton></VolumeButton>
      </div>

      <div className={styles.right}></div>
    </div>
  );
}
