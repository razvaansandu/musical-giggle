"use client";

import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import styles from './LikeButton.module.css';

export default function AddToLibraryButton({ albumId }) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!albumId) return;

    const checkSaved = async () => {
      try {
        const res = await fetch(`/api/albums/contains?ids=${albumId}`);
        if (res.ok) {
          const data = await res.json();
          setIsSaved(!!data[0]);
        }
      } catch (err) {
        console.error('Errore check album saved', err);
      }
    };

    checkSaved();
  }, [albumId]);

  const handleToggle = async () => {
    if (!albumId || loading) return;
    setLoading(true);
    try {
      if (isSaved) {
        const res = await fetch('/api/albums/saved', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: [albumId] }),
        });
        if (res.ok) setIsSaved(false);
      } else {
        const res = await fetch('/api/albums/saved', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: [albumId] }),
        });
        if (res.ok) setIsSaved(true);
      }
    } catch (err) {
      console.error('Errore toggle album saved', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`${styles.likeButton} ${isSaved ? styles.liked : ''}`}
      onClick={handleToggle}
      disabled={loading}
      title={isSaved ? 'Rimuovi dalla libreria' : 'Aggiungi alla libreria'}
    >
      <BookOpen size={18} />
    </button>
  );
}
