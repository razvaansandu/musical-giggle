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

  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
      setMounted(true);
      if (typeof window !== 'undefined') {
          setPosition({ 
              x: window.innerWidth - 340,
              y: window.innerHeight - 320
          });
      }
  }, []);

  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return;
    setIsDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  useEffect(() => {
    if (!query) return;

    const fetchVideo = async () => {
      setLoading(true);
      setError(null);
      setVideoId(null);
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
        } else {
          throw new Error("Nessun video trovato");
        }
      } catch (err) {
        console.warn("API search failed, falling back to embed search", err);
        setVideoId("FALLBACK");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [query]);

  if (!query || !mounted) return null;

  const playerContent = (
    <div 
      className={styles.playerContainer} 
      ref={containerRef}
      style={position ? { left: position.x, top: position.y, bottom: 'auto', right: 'auto' } : {}}
    >
      <div 
        className={styles.header} 
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
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
    </div>
  );

  return createPortal(playerContent, document.body);
}
