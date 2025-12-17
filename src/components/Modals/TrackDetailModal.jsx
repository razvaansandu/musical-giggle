"use client";

import React, { useState, useEffect } from "react";
import styles from "./TrackDetailModal.module.css";

export default function TrackDetailModal({ track, isOpen, onClose }) {
  const [audioFeatures, setAudioFeatures] = useState(null);
  const [artistAlbums, setArtistAlbums] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && track?.id) {
      fetchTrackDetails();
    }
  }, [isOpen, track?.id]);

  const fetchTrackDetails = async () => {
    try {
      setLoading(true);
      const featuresRes = await fetch(`/api/tracks/audio-features/${track.id}`);
      if (featuresRes.ok) {
        const features = await featuresRes.json();
        setAudioFeatures(features);
      }

      if (track?.artists?.[0]?.id) {
        const albumsRes = await fetch(
          `/api/artist/albums/${track.artists[0].id}?limit=6`
        );
        if (albumsRes.ok) {
          const albums = await albumsRes.json();
          setArtistAlbums(albums.items || []);
        }
      }
    } catch (err) {
      console.error("Errore nel caricamento dei dettagli:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = async () => {
    try {
      await fetch("/api/player/start-resume-playback", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uris: [track.uri] }),
      });
      setIsPlaying(true);
    } catch (err) {
      console.error("Errore play:", err);
    }
  };

  const handleLike = async () => {
    try {
      const method = isLiked ? "DELETE" : "PUT";
      const res = await fetch("/api/tracks/saved", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [track.id] }),
      });
      if (res.ok) {
        setIsLiked(!isLiked);
      }
    } catch (err) {
      console.error("Errore like:", err);
    }
  };

  if (!isOpen || !track) return null;

  const img = track?.album?.images?.[0]?.url || "/default-track.png";
  const artists = track?.artists?.map((a) => a.name).join(", ") || "Unknown Artist";
  const albumName = track?.album?.name || "Unknown Album";
  const durationMs = track?.duration_ms || 0;
  const minutes = Math.floor(durationMs / 60000);
  const seconds = ((durationMs % 60000) / 1000).toFixed(0);
  const duration = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Chiudi">
          ✕
        </button>

        <div className={styles.mainContent}>
          <div className={styles.leftSection}>
            <div className={styles.albumContainer}>
              <img src={img} alt={track.name} className={styles.albumArt} />
              <div className={styles.shadow} />
            </div>
          </div>

          <div className={styles.rightSection}>
            <div className={styles.header}>
              <p className={styles.label}>Singolo</p>
              <h1 className={styles.trackName}>{track.name}</h1>
              <p className={styles.artists}>{artists}</p>
              <p className={styles.album}>{albumName} • {duration}</p>
            </div>

            <div className={styles.controls}>
              <button className={styles.playBtn} onClick={handlePlay}>
                ▶
              </button>
              <button className={styles.addBtn} title="Aggiungi alla coda">
                ➕
              </button>
              <button className={styles.shareBtn} title="Condividi">
                ♡
              </button>
              <button className={styles.moreBtn} title="Altre opzioni">
                ⋮
              </button>
            </div>

            {/* Release Info */}
            <div className={styles.releaseInfo}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Data di uscita</span>
                <span className={styles.infoValue}>
                  {track?.album?.release_date || "-"}
                </span>
              </div>
            </div>

            {audioFeatures && (
              <div className={styles.featuresSection}>
                <h3 className={styles.sectionTitle}>Caratteristiche audio</h3>
                <div className={styles.featureGrid}>
                  <div className={styles.featureItem}>
                    <div className={styles.featureBar}>
                      <div
                        className={styles.featureFill}
                        style={{ width: `${audioFeatures.energy * 100}%` }}
                      />
                    </div>
                    <span className={styles.featureLabel}>Energia</span>
                  </div>
                  <div className={styles.featureItem}>
                    <div className={styles.featureBar}>
                      <div
                        className={styles.featureFill}
                        style={{ width: `${audioFeatures.danceability * 100}%` }}
                      />
                    </div>
                    <span className={styles.featureLabel}>Ballabilità</span>
                  </div>
                  <div className={styles.featureItem}>
                    <div className={styles.featureBar}>
                      <div
                        className={styles.featureFill}
                        style={{ width: `${audioFeatures.valence * 100}%` }}
                      />
                    </div>
                    <span className={styles.featureLabel}>Positività</span>
                  </div>
                  <div className={styles.featureItem}>
                    <div className={styles.featureBar}>
                      <div
                        className={styles.featureFill}
                        style={{ width: `${audioFeatures.acousticness * 100}%` }}
                      />
                    </div>
                    <span className={styles.featureLabel}>Acusticità</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.bottomSection}>
          {artistAlbums.length > 0 && (
            <div className={styles.relatedSection}>
              <div className={styles.sectionHeader}>
                <h3>Altro di {track?.artists?.[0]?.name}</h3>
                <a href="#" className={styles.viewAll}>
                  Vedi tutto
                </a>
              </div>
              <div className={styles.albumGrid}>
                {artistAlbums.map((album) => (
                  <div key={album.id} className={styles.albumCard}>
                    <img
                      src={album?.images?.[0]?.url || "/default-album.png"}
                      alt={album.name}
                      className={styles.albumCardImg}
                    />
                    <p className={styles.albumCardName}>{album.name}</p>
                    <p className={styles.albumCardYear}>
                      {album?.release_date?.split("-")[0]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
