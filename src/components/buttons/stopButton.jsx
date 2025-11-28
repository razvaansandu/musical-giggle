"use client";

import React, { useState } from "react";
import styles from "./stopButton.module.css";

export default function StopButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStop = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/player/pause-playback", {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Errore nel fermare la riproduzione");
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={styles.stopButton}
      onClick={handleStop}
      disabled={loading}
      title="Ferma"
      aria-label="Ferma riproduzione"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="6" width="12" height="12" rx="2" />
      </svg>
      {error && <span className={styles.error}>{error}</span>}
    </button>
  );
}
