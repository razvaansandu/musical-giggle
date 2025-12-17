"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './YouTubePlayer.module.css';
import { X, Loader2, GripHorizontal } from 'lucide-react';

export default function YouTubePlayer({ query, onClose }) {
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [channelTitle, setChannelTitle] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentTrackInfo, setCurrentTrackInfo] = useState(null);

  

  useEffect(() => {
    setMounted(true);
  }, []);

  

  useEffect(() => {
    if (!query) return;

    const fetchVideo = async () => {
      setLoading(true);
      setError(null);
      setVideoId(null);
      setVideoTitle('');
      setChannelTitle('');
      setThumbnailUrl(null);
      try {
        console.log(" Searching video for:", query);
        const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(query + " official video")}`);
        console.log(" API Status:", res.status);

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Video non trovato (404)");
          }
          throw new Error("Errore API");
        }

        const data = await res.json();
        console.log(" API Data:", data);

        if (data.videoId) {
          setVideoId(data.videoId);
    
          if (data.title) setVideoTitle(data.title);
          if (data.channelTitle) setChannelTitle(data.channelTitle);
           setThumbnailUrl(`https://img.youtube.com/vi/${data.videoId}/hqdefault.jpg`);
        } else {
          throw new Error("Nessun video trovato");
        }
      } catch (err) {
        console.warn("API search failed, falling back to embed search", err);
        setVideoId("FALLBACK");
       
        const { title, artist } = parseQuery(query);
        setVideoTitle(title);
        setChannelTitle(artist || 'YouTube');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [query]);

  const parseQuery = (q) => {
    if (!q) return { title: '', artist: '' };
 
    let title = q;
    let artist = '';
    const separators = [" - ", " — ", " – ", " by ", " | "];
    for (const sep of separators) {
      if (q.includes(sep)) {
        const parts = q.split(sep);
        title = parts[0].trim();
        artist = parts.slice(1).join(sep).trim();
        break;
      }
    }
    return { title, artist };
  };

    useEffect(() => {
      if (!mounted) return;
    
      fetchPlayerInfo();
      fetchQueue();
    }, [mounted]);

    const fetchPlayerInfo = async () => {
      try {
        const res = await fetch('/api/player/get-currently-playing-track');
        if (!res.ok) return;
        const data = await res.json();
        const item = data?.item || data?.currently_playing || null;
        if (item) {
          setCurrentTrackInfo({
            name: item.name,
            artists: (item.artists || []).map(a => a.name).join(', '),
            album: item.album?.name || '',
            albumImage: item.album?.images?.[0]?.url || null,
          });
        }
      } catch (err) {
        console.warn('Failed to fetch current track', err);
      }
    };

    const fetchQueue = async () => {
      try {
        const res = await fetch('/api/player/get-user-queue');
        if (!res.ok) return;
        const data = await res.json();
        const q = data?.queue || [];
        setQueue(q.slice(0, 10));
      } catch (err) {
        console.warn('Failed to fetch queue', err);
      }
    };

  if (!query || !mounted) return null;

  const playerContent = (
    <div 
      className={styles.playerContainer}
    >
      <div
        className={styles.header}
        
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GripHorizontal size={16} />
          <span className={styles.title}>YouTube Miniplayer</span>
        </div>
        <button onClick={onClose} className={styles.closeBtn} title="Chiudi">
          <X size={16} />
        </button>
      </div>
      <div className={styles.iframeContainer}>
        {loading ? (
          <div className={styles.loadingState}>
            <Loader2 className={styles.spinner} size={24} />
            <span>Ricerca video...</span>
          </div>
        ) : videoId === "FALLBACK" ? (
          <iframe
            src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query + " official video")}&autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className={styles.errorState}>
            <span>Video non disponibile</span>
          </div>
        )}
      </div>
      <div className={styles.infoPanel}>
        <div className={styles.meta}>
          <div className={styles.trackTitle}>{videoTitle || query}</div>
          <div className={styles.artistName}>{channelTitle || 'YouTube'}</div>
          {currentTrackInfo && (
            <div className={styles.currentTrackBlock}>
              <div className={styles.currentLabel}>In riproduzione (Spotify):</div>
              <div className={styles.currentLine}>
                <div className={styles.currentName}>{currentTrackInfo.name}</div>
                <div className={styles.currentArtists}>{currentTrackInfo.artists}</div>
              </div>
            </div>
          )}

          <div className={styles.queueBlock}>
            <div className={styles.queueLabel}>Prossime in coda</div>
            <ul className={styles.queueList}>
              {queue.length > 0 ? (
                queue.map((t, i) => (
                  <li key={i} className={styles.queueItem}>
                    <div className={styles.qIndex}>{i + 1}.</div>
                    <div className={styles.qMeta}>
                      <div className={styles.qTitle}>{t?.name || t?.track?.name}</div>
                      <div className={styles.qArtists}>{(t?.artists || t?.track?.artists || []).map(a => a.name).join(', ')}</div>
                    </div>
                  </li>
                ))
              ) : (
                <li className={styles.queueEmpty}>Nessuna traccia in coda</li>
              )}
            </ul>
          </div>

          <div className={styles.actions}>
            {videoId && videoId !== 'FALLBACK' ? (
              <a href={`https://youtu.be/${videoId}`} target="_blank" rel="noreferrer" className={styles.openBtn}>Apri su YouTube</a>
            ) : (
              <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`} target="_blank" rel="noreferrer" className={styles.openBtn}>Cerca su YouTube</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(playerContent, document.body);
}
