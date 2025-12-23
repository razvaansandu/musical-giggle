"use client";

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import styles from './LikeButton.module.css';

export default function LikeButton({ trackId, onLikeChange }) {
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!trackId) return;

    const checkIfLiked = async () => {
      try {
        const res = await fetch(`/api/tracks/contains?ids=${trackId}`);
        if (res.ok) {
          const data = await res.json();
          setIsLiked(data[0] || false);
        }
      } catch (err) {
        console.error("Errore nel controllare se il brano è nei Mi piace:", err);
      }
    };

    checkIfLiked();
  }, [trackId]);

  const handleLikeToggle = async () => {
    if (loading || !trackId) return;

    setLoading(true);
    try {
      if (isLiked) {
        const res = await fetch(`/api/tracks/saved`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: [trackId] }),
        });

        if (res.ok) {
          setIsLiked(false);
          if (onLikeChange) onLikeChange(false);
        }
      } else {
        const res = await fetch(`/api/tracks/saved`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: [trackId] }),
        });

        if (res.ok) {
          setIsLiked(true);
          if (onLikeChange) onLikeChange(true);
        }
      }
    } catch (err) {
      console.error("Errore nel toggle del Like:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
      onClick={handleLikeToggle}
      disabled={loading}
      title={isLiked ? "Rimuovi dai Mi piace" : "Aggiungi ai Mi piace"}
    >
      <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
    </button>
  );
}
