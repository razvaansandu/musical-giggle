"use client";
import React, { useEffect, useState } from "react";
import styles from "../app/home/home.module.css";

export default function ChiamataRecenti() {
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[] | null>(null);
  const [rpLoading, setRpLoading] = useState(true);
  const [rpError, setRpError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadRecently() {
      setRpLoading(true);
      setRpError(null);
      try {
        const res = await fetch("/api/player/get-recently-played-tracks");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Errore fetching recently played");

        let items: any[] = [];
        if (Array.isArray(data.items)) {
          items = data.items.map((it: any) => it.track || it);
        } else if (Array.isArray(data.recentlyPlayed)) {
          items = data.recentlyPlayed;
        } else if (Array.isArray(data.tracks)) {
          items = data.tracks;
        } else if (Array.isArray(data)) {
          items = data;
        }

        if (mounted) setRecentlyPlayed(items);
      } catch (err: any) {
        console.error(err);
        if (mounted) setRpError(err.message || String(err));
      } finally {
        if (mounted) setRpLoading(false);
      }
    }
    loadRecently();
    return () => {
      mounted = false;
    };
  }, []);

  if (rpLoading) {
    return (
      <>
        {[1, 2, 3, 4, 5, 6, 7].map((item) => (
          <div key={item} className={styles.card}>
            <div className={styles.cardImage}></div>
            <div className={styles.cardContent}>
              <h3>Loading...</h3>
              <p>...</p>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (rpError) {
    return <div style={{ color: "#f66" }}>{rpError}</div>;
  }

  if (!recentlyPlayed || recentlyPlayed.length === 0) {
    return <p style={{ color: "#b3b3b3" }}>Nessuna traccia riprodotta di recente.</p>;
  }

  return (
    <>
      {recentlyPlayed.map((track: any, idx: number) => {
        const id = track.id || track.uri || `rp-${idx}`;
        const name = track.name || track.title || "Unknown";
        const artistsArr = track.artists || (track.track && track.track.artists) || [];
        const artists = Array.isArray(artistsArr) ? artistsArr.map((a: any) => a.name || a).join(", ") : artistsArr;
        const image =
          (track.album && track.album.images && track.album.images[0] && track.album.images[0].url) ||
          (track.track && track.track.album && track.track.album.images && track.track.album.images[0] && track.track.album.images[0].url) ||
          null;

        return (
          <div key={id} className={styles.card}>
            {image ? (
              <img src={image} alt={name} className={styles.cardImage} />
            ) : (
              <div className={styles.cardImage}></div>
            )}
            <div className={styles.cardContent}>
              <h3>{name}</h3>
              <p>{artists}</p>
            </div>
          </div>
        );
      })}
    </>
  );
}