"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./Player.module.css";
import { initWebPlayer, getDeviceId } from "../../lib/webPlayer";
import PlayButton from "../buttons/PlayButton";
import ButtonNextSong from "../buttons/buttonNextSong";
import ButtonPrevSong from "../buttons/songButtonFirst";
import StopButton from "../buttons/stopButton";
import VolumeButton from "../volume/Volume";
import ButtonShuffle from "../buttons/buttonShuffle";
import ButtonLoop from "../buttons/ButtonLoop";
import ButtonAddToPlaylist from "../buttons/ButtonAddToPlaylist";


export default function Player() {
  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");
  const [showLyrics, setShowLyrics] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [lyrics, setLyrics] = useState("");
  const [syncedLyrics, setSyncedLyrics] = useState([]);
  const [isSynced, setIsSynced] = useState(false);
  const [loadingLyrics, setLoadingLyrics] = useState(false);
// testo panebianco
  const fetchLyrics = async (artist, track) => {
    if (!artist || !track) return;
    setLoadingLyrics(true);
    setSyncedLyrics([]);
    setIsSynced(false);
    try {
      const res = await fetch(`/api/lyrics?artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}`);
      const data = await res.json();
      
      if (data.synced) {
        setSyncedLyrics(parseLrc(data.lyrics));
        setIsSynced(true);
      } else {
        setLyrics(data.lyrics || "Testo non disponibile.");
        setIsSynced(false);
      }
    } catch (error) {
      console.error("Error fetching lyrics:", error);
      setLyrics("Errore nel caricamento del testo.");
      setIsSynced(false);
    } finally {
      setLoadingLyrics(false);
    }
  };

  useEffect(() => { 
    if (showLyrics && current) {
      const artist = current.artists?.[0]?.name;
      const track = current.name;
      fetchLyrics(artist, track);
    }
  }, [current?.id, showLyrics]);

  const fetchCurrent = async () => {
    try {
      const res = await fetch("/api/player/get-playback-state");

      if (res.status === 204) {
        setCurrent(null);
        setIsPlaying(false);
        return;
      }

      const data = await res.json();
      setCurrent(data.item || null);
      setIsPlaying(data.is_playing || false);
      setIsShuffle(data.shuffle_state || false);
      setRepeatMode(data.repeat_state || "off");
      if (data.progress_ms) {
        setProgress(data.progress_ms);
      }
    } catch (err) {
      console.error("Errore stato player", err);
    }
  };

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((p) => p + 1000);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

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

  const handleShuffle = async () => {
    try {
      const newState = !isShuffle;
      setIsShuffle(newState); // Optimistic update
      await fetch(`/api/player/toggle-shuffle?state=${newState}`, { method: "PUT" });
      fetchCurrent();
    } catch (err) {
      console.error("Errore shuffle", err);
      setIsShuffle(!isShuffle); // Revert on error
    }
  };

  const handleRepeat = async (newMode) => {
    try {
      setRepeatMode(newMode); // Optimistic update
      await fetch(`/api/player/set-repeat-mode?state=${newMode}`, { method: "PUT" });
      fetchCurrent();
    } catch (err) {
      console.error("Errore repeat", err);
      // Revert logic could be complex here, just refetch
      fetchCurrent();
    }
  };

  const deviceId = getDeviceId();

  if (deviceId) {
    return (
      <div className={styles.playerBar}>
        <div className={styles.empty}> Sto inizializzando il player...</div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className={styles.playerBar}>
        <div className={styles.empty}>
          Nessun brano in riproduzione. Clicca una track per iniziare 
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
        <div>
          {/* <ButtonAddToPlaylist/>   */}
          </div>
            
      </div>

      <div className={styles.left}>
        <button onClick={ButtonLoop} className={styles.iconBtn}>
          <ButtonLoop />
        </button>
        <button onClick={handlePrev} className={styles.iconBtn} aria-label="Previous">
          <ButtonPrevSong />
        </button>

        <button onClick={handlePlayPause} className={styles.playBtn} aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? <StopButton /> : <PlayButton />}
        </button>

        <button onClick={handleNext} className={styles.iconBtn} aria-label="Next">
          <ButtonNextSong />
        </button>
        <button onClick={ButtonShuffle} className={styles.iconBtn}>
          <ButtonShuffle />
        </button>
        {/* button per le lyrics */}
         <button
        className={`${styles.iconBtn} ${showLyrics ? styles.active : ''}`}
        onClick={() => setShowLyrics(!showLyrics)}
        title="Testo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-mic-fill" viewBox="0 0 16 16">

          <path d="M13.426 2.574a2.831 2.831 0 0 0-4.797 1.55l3.247 3.247a2.831 2.831 0 0 0 1.55-4.797M10.5 8.118l-2.619-2.62L4.74 9.075 2.065 12.12a1.287 1.287 0 0 0 1.816 1.816l3.06-2.688 3.56-3.129zM7.12 4.094a4.331 4.331 0 1 1 4.786 4.786l-3.974 3.493-3.06 2.689a2.787 2.787 0 0 1-3.933-3.933l2.676-3.045z"></path>

        </svg>
      </button>
      </div>
      
     
      <div>
        <VolumeButton></VolumeButton>
      </div>


      {showVideo && current && (
        <YouTubePlayer 
          query={`${current.artists?.[0]?.name} ${current.name}`} 
          onClose={() => setShowVideo(false)} 
        />
      )}

      <div className={`${styles.lyricsOverlay} ${showLyrics ? styles.open : ''}`}>
        {current && (
          <div className={styles.lyricsHeader}>
            <div className={styles.lyricsTitle}>{current.name}</div>
            <div className={styles.lyricsArtist}>{current.artists?.map(a => a.name).join(", ")}</div>
          </div>
        )}
        <div className={styles.lyricsContent}>
          {loadingLyrics ? "Caricamento testo..." : (
            isSynced ? (
              syncedLyrics.map((line, i) => {
                // Determine if this line is active
                // It is active if progress >= line.time AND (it's the last line OR progress < nextLine.time)
                const isActive = progress >= line.time && (i === syncedLyrics.length - 1 || progress < syncedLyrics[i+1].time);
                return (
                  <div 
                    key={i} 
                    ref={isActive ? activeLineRef : null}
                    className={`${styles.lyricsLine} ${isActive ? styles.lyricsLineActive : ''}`}
                    onClick={() => handleSeek({ target: { value: line.time } })}
                  >
                    {line.text}
                  </div>
                )
              })
            ) : lyrics
          )}
        </div>
      </div>
    </div>
  );
} 
