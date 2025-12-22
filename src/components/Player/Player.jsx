"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import styles from "./Player.module.css";
import PlayButton from "../buttons/PlayButton";
import ButtonNextSong from "../buttons/buttonNextSong";
import ButtonPrevSong from "../buttons/songButtonFirst";
import StopButton from "../buttons/stopButton";
import VolumeButton from "../volume/Volume";
import ButtonShuffle from "../buttons/buttonShuffle";
import ButtonLoop from "../buttons/ButtonLoop";
import { MonitorPlay, ListMusic, Speaker, Disc } from "lucide-react"; 
import LikeButton from "../buttons/LikeButton";

export default function Player() {
  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");
  
  const [showLyrics, setShowLyrics] = useState(false);
  const [showNowPlaying, setShowNowPlaying] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showDevices, setShowDevices] = useState(false);
  
  const [queue, setQueue] = useState([]);
  const [devices, setDevices] = useState([]); 
  const [lyrics, setLyrics] = useState("");
  const [syncedLyrics, setSyncedLyrics] = useState([]);
  const [isSynced, setIsSynced] = useState(false);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [loadingLyrics, setLoadingLyrics] = useState(false);
  const [progress, setProgress] = useState(0);
  const [artistDetails, setArtistDetails] = useState(null);

  const activeLineRef = useRef(null);
  const queueRef = useRef(null);
  const deviceRef = useRef(null); 
  const seekTimeoutRef = useRef(null);
  const lyricsContentRef = useRef(null);
  const isProgrammaticScroll = useRef(false);

  const parseLrc = (lrc) => {
    const lines = lrc.split("\n");
    const result = [];
    for (const line of lines) {
      const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
      if (match) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        const rawMs = match[3];
        const ms = rawMs.length === 3 ? parseInt(rawMs, 10) : parseInt(rawMs, 10) * 10;
        
        const time = minutes * 60 * 1000 + seconds * 1000 + ms;
        const text = match[4].trim();
        if (text) result.push({ time, text });
      }
    }
    return result;
  };

  const handleSeek = (e) => {
    const newTime = parseInt(e.target.value, 10);
    setProgress(newTime);
    
    if (seekTimeoutRef.current) clearTimeout(seekTimeoutRef.current);
    
    seekTimeoutRef.current = setTimeout(async () => {
      try {
        await fetch(`/api/player/seek-to-position?position_ms=${newTime}`, { method: "PUT" });
      } catch (err) {
        console.error("Errore seek", err);
      }
    }, 500);
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

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

  const fetchArtistDetails = async (artistId) => {
    if (!artistId) return;
    try {
      const res = await fetch(`/api/artist/${artistId}`);
      if (res.ok) {
        const data = await res.json();
        setArtistDetails(data);
      }
    } catch (error) {
      console.error("Error fetching artist details:", error);
    }
  };

  const fetchCurrent = async () => {
    try {
      const res = await fetch("/api/player/get-playback-state");

      if (res.status === 204) {
        setCurrent(null);
        setIsPlaying(false);
        return;
      }

      const text = await res.text();
      if (!text) return;

      const data = JSON.parse(text);
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

  const fetchRecentlyPlayed = async () => {
    try {
      const res = await fetch("/api/player/get-recently-played-tracks?limit=1");
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0 && !current) {
          setCurrent(data.items[0].track);
        }
      }
    } catch (err) {
      console.error("Errore recently played", err);
    }
  };

  const fetchDevices = async () => {
    try {
      const res = await fetch("/api/player/get-available-devices");
      if (res.ok) {
        const data = await res.json();
        setDevices(data.devices || []);
      }
    } catch (err) {
      console.error("Errore nel recuperare i dispositivi", err);
      setDevices([]);
    }
  };

  // ✅ HANDLER CORRETTO PER CAMBIARE DISPOSITIVO
  const handleDeviceClick = async (deviceId) => {
    try {
      await fetch("/api/player/transfer-playback", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device_ids: [deviceId],
          play: true // Riprende la riproduzione sul nuovo dispositivo
        }),
      });
      setShowDevices(false);
      setTimeout(fetchCurrent, 1000); // Refresh stato dopo 1s
    } catch (err) {
      console.error("Errore nel trasferire la riproduzione", err);
    }
  };

  const toggleDevices = () => {
    if (!showDevices) {
      fetchDevices();
      setShowQueue(false); 
    }
    setShowDevices(!showDevices);
  };

  const fetchQueue = async () => {
    try {
      const res = await fetch("/api/player/get-user-queue");
      if (res.ok) {
        const data = await res.json();
        setQueue(data.queue || []);
      } else {
        setQueue([]);
      }
    } catch (err) {
      console.error("Errore fetch queue", err);
      setQueue([]);
    }
  };

  const toggleQueue = () => {
    if (!showQueue) {
      fetchQueue();
      setShowDevices(false); 
    }
    setShowQueue(!showQueue);
  };

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
      setIsShuffle(newState); 
      await fetch(`/api/player/toggle-shuffle?state=${newState}`, { method: "PUT" });
      fetchCurrent();
    } catch (err) {
      console.error("Errore shuffle", err);
      setIsShuffle(!isShuffle); 
    }
  };

  const handleRepeat = async (newMode) => {
    try {
      setRepeatMode(newMode); 
      await fetch(`/api/player/set-repeat-mode?state=${newMode}`, { method: "PUT" });
      fetchCurrent();
    } catch (err) {
      console.error("Errore repeat", err);
      fetchCurrent();
    }
  };

  const scrollToActiveLine = () => {
    setIsAutoScroll(true);
    if (activeLineRef.current) {
      isProgrammaticScroll.current = true;
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 500);
    }
  };

  const handleLyricsScroll = () => {
    if (!isProgrammaticScroll.current) {
      setIsAutoScroll(false);
    }
  };

  const handleUserInteraction = () => {
    setIsAutoScroll(false);
  };

  useEffect(() => { 
    if (showLyrics && current) {
      const artist = current.artists?.[0]?.name;
      const track = current.name;
      fetchLyrics(artist, track);
    }
  }, [current?.id, showLyrics]);

  useEffect(() => {
    if (showNowPlaying && current?.artists?.[0]?.id) {
      fetchArtistDetails(current.artists[0].id);
    }
  }, [current?.id, showNowPlaying]);

  const activeIndex = useMemo(() => {
    if (!isSynced || syncedLyrics.length === 0) return -1;
    return syncedLyrics.findIndex((line, i) => {
      return progress >= line.time && (i === syncedLyrics.length - 1 || progress < syncedLyrics[i+1].time);
    });
  }, [progress, syncedLyrics, isSynced]);

  useEffect(() => {
    if (showLyrics && isAutoScroll && activeIndex !== -1 && activeLineRef.current) {
      isProgrammaticScroll.current = true;
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 500);
    }
  }, [activeIndex, showLyrics, isAutoScroll]);

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
    fetchCurrent();
    fetchRecentlyPlayed();
    const interval = setInterval(fetchCurrent, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (queueRef.current && !queueRef.current.contains(e.target) && showQueue) {
        const btn = e.target.closest(`button[title="Coda"]`);
        if (!btn) setShowQueue(false);
      }
      if (deviceRef.current && !deviceRef.current.contains(e.target) && showDevices) {
        const btn = e.target.closest(`button[title="Dispositivi"]`);
        if (!btn) setShowDevices(false);
      }
    };
    
    if (showQueue || showDevices) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showQueue, showDevices]);

  if (!current) { 
    return <p></p>;
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
        <LikeButton trackId={current?.id} />
      </div>

      <div className={styles.center}>
        <div className={styles.controls}>
          <ButtonShuffle isShuffled={isShuffle} onToggle={handleShuffle} className={styles.iconBtn} />
          <ButtonPrevSong onPrev={handlePrev} className={styles.iconBtn} title="Previous" />

          {isPlaying ? (
            <StopButton onClick={handlePlayPause} className={styles.playBtn} />
          ) : (
            <PlayButton onClick={handlePlayPause} className={styles.playBtn} />
          )}

          <ButtonNextSong onNext={handleNext} className={styles.iconBtn} title="Next" />
          <ButtonLoop mode={repeatMode} onChange={handleRepeat} className={styles.iconBtn} />
        </div>
        
        <div className={styles.progressBarContainer}>
          <span className={styles.time}>{formatTime(progress)}</span>
          <input
            type="range"
            min="0"
            max={current?.duration_ms || 0}
            value={progress}
            onChange={handleSeek}
            className={styles.progressBar}
            style={{ '--progress-percent': `${(progress / (current?.duration_ms || 1)) * 100}%` }}
          />
          <span className={styles.time}>{formatTime(current?.duration_ms || 0)}</span>
        </div>
      </div>
      
      <div className={styles.right}>
        <button 
          className={`${styles.lyricsButton} ${showDevices ? styles.active : ''}`} 
          onClick={toggleDevices}
          title="Dispositivi" 
        >
          <Speaker size={16} />
        </button>

        <button 
          className={`${styles.lyricsButton} ${showQueue ? styles.active : ''}`} 
          onClick={toggleQueue}
          title="Coda" 
        >
          <ListMusic size={16} />
        </button>

        <button 
          className={`${styles.lyricsButton} ${showNowPlaying ? styles.active : ''}`} 
          onClick={() => {
            if (!showNowPlaying) setShowLyrics(false);
            setShowNowPlaying(!showNowPlaying);
          }}
          title="Cosa stai ascoltando" 
        >
          <Disc size={16} />
        </button>
        <button 
          className={`${styles.lyricsButton} ${showLyrics ? styles.active : ''}`}
          onClick={() => {
            if (!showLyrics) setShowNowPlaying(false);
            setShowLyrics(!showLyrics);
          }}
          title="Testo" 
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-mic-fill" viewBox="0 0 16 16">
            <path d="M13.426 2.574a2.831 2.831 0 0 0-4.797 1.55l3.247 3.247a2.831 2.831 0 0 0 1.55-4.797M10.5 8.118l-2.619-2.62L4.74 9.075 2.065 12.12a1.287 1.287 0 0 0 1.816 1.816l3.06-2.688 3.56-3.129zM7.12 4.094a4.331 4.331 0 1 1 4.786 4.786l-3.974 3.493-3.06 2.689a2.787 2.787 0 0 1-3.933-3.933l2.676-3.045z"></path> 
          </svg> 
        </button>
        <VolumeButton />

        {/* ✅ LISTA DISPOSITIVI FUNZIONANTE */}
        {showDevices && (
          <div ref={deviceRef} className={styles.queueDropdown} style={{right: '180px'}}>
            <div className={styles.queueHeader}>
              <span>Connetti a un dispositivo</span>
            </div>
            <div className={styles.queueList}>
              {devices.length > 0 ? (
                devices.map((device) => (
                  <div 
                    key={device.id} 
                    className={`${styles.queueItem} ${device.is_active ? styles.activeDevice : ''}`}
                    onClick={() => !device.is_active && handleDeviceClick(device.id)}
                    style={{ 
                      cursor: device.is_active ? 'default' : 'pointer', 
                      background: device.is_active ? 'rgba(29, 185, 84, 0.1)' : 'transparent' 
                    }}
                  >
                    <div className={styles.queueItemInfo}>
                      <div className={styles.queueItemTitle} style={{ color: device.is_active ? '#1DB954' : 'inherit' }}>
                        {device.name}
                      </div>
                      <div className={styles.queueItemArtist}>
                        {device.type} {device.is_active && '• Attivo'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.queueEmpty}>
                  Nessun dispositivo disponibile
                </div>
              )}
            </div>
          </div>
        )}

        {showQueue && (
          <div ref={queueRef} className={styles.queueDropdown}>
            <div className={styles.queueHeader}>
              <span>Prossime in coda</span>
            </div>
            <div className={styles.queueList}>
              {queue.length === 0 ? (
                <div className={styles.queueEmpty}>
                  Nessun brano in coda
                </div>
              ) : (
                queue.slice(0, 10).map((track, index) => (
                  <div key={`${track.id}-${index}`} className={styles.queueItem}>
                    <img 
                      src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url} 
                      alt={track.name}
                      className={styles.queueItemCover}
                    />
                    <div className={styles.queueItemInfo}>
                      <div className={styles.queueItemTitle}>{track.name}</div>
                      <div className={styles.queueItemArtist}>
                        {track.artists?.map(a => a.name).join(", ")}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div> 

      <div className={`${styles.nowPlayingOverlay} ${showNowPlaying ? styles.open : ''}`}>
        {current && (
          <div className={styles.nowPlayingContent}>
            <div className={styles.nowPlayingHeader}>Cosa stai ascoltando</div>
            
            <img 
              src={current.album?.images?.[0]?.url} 
              alt={current.album?.name} 
              className={styles.nowPlayingCover}
            />
            
            <div className={styles.nowPlayingTrackInfo}>
              <div className={styles.nowPlayingTitle}>{current.name}</div>
              <div className={styles.nowPlayingArtist}>{current.artists?.map(a => a.name).join(", ")}</div>
            </div>

            {current.album && (
              <div className={styles.nowPlayingSection}>
                <div className={styles.nowPlayingLabel}>Album</div>
                <div className={styles.nowPlayingValue}>{current.album.name}</div>
              </div>
            )}

            {artistDetails && (
              <div className={styles.nowPlayingArtistSection}>
                <div className={styles.nowPlayingLabel}>Info Artista</div>
                <div className={styles.artistCard}>
                  {artistDetails.images?.[0]?.url && (
                    <img 
                      src={artistDetails.images[0].url} 
                      alt={artistDetails.name} 
                      className={styles.artistImage}
                    />
                  )}
                  <div className={styles.artistName}>{artistDetails.name}</div>
                  {artistDetails.genres && artistDetails.genres.length > 0 && (
                    <div className={styles.artistGenres}>
                      {artistDetails.genres.slice(0, 3).join(", ")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={`${styles.lyricsOverlay} ${showLyrics ? styles.open : ''}`}>
        {current && (
          <div className={styles.lyricsHeader}>
            <div className={styles.lyricsTitle}>{current.name}</div>
            <div className={styles.lyricsArtist}>{current.artists?.map(a => a.name).join(", ")}</div>
          </div>
        )}
        <div 
          className={styles.lyricsContent} 
          ref={lyricsContentRef}
          onScroll={handleLyricsScroll}
          onWheel={handleUserInteraction}
          onTouchMove={handleUserInteraction}
        >
          {loadingLyrics ? "Caricamento testo...." : (
            isSynced ? (
              syncedLyrics.map((line, i) => {
                const isActive = i === activeIndex;
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
        {isSynced && !isAutoScroll && (
          <button className={styles.syncButton} onClick={scrollToActiveLine}> 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-music-note-beamed" viewBox="0 0 16 16">
              <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13s1.12-2 2.5-2 2.5.896 2.5 2m9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2"/>
              <path fillRule="evenodd" d="M14 11V2h1v9zM6 3v10H5V3z"/>
              <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4z"/>
            </svg>
             Sincronizza
          </button>
        )}
      </div>
    </div>
  );
}
