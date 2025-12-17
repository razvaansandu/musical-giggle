"use client";

import React, { useEffect, useState } from "react";
import { useSpotify } from "../context/SpotifyContext";
import styles from "./PlayerDebug.module.css";

export default function PlayerDebug() {
  const {
    isReady,
    isPlaying,
    isPremium,
    currentTrack,
    deviceId,
    volume,
    position,
    duration,
  } = useSpotify();

  const [isIOS, setIsIOS] = useState(false);
  const [sdkLoaded, setSDKLoaded] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));
    setSDKLoaded(!!window.Spotify);
  }, []);

  const getStatus = () => {
    if (isIOS) return { text: "iOS - App Spotify", color: "#FF6B6B", icon: "📱" };
    if (!isPremium) return { text: "Free - No Web Player", color: "#FFA94D", icon: "🔒" };
    if (!sdkLoaded) return { text: "SDK Loading...", color: "#FFD93D", icon: "⏳" };
    if (!isReady) return { text: "Player Initializing", color: "#FFD93D", icon: "⏳" };
    if (isReady) return { text: "Ready ✓", color: "#6BCF7F", icon: "✅" };
    return { text: "Unknown", color: "#999", icon: "❓" };
  };

  const status = getStatus();

  return (
    <div className={styles.debugContainer}>
      <button
        onClick={() => setDebugOpen(!debugOpen)}
        className={styles.debugButton}
        style={{ borderColor: status.color }}
      >
        {status.icon} {status.text}
      </button>

      {debugOpen && (
        <div className={styles.debugPanel}>
          <div className={styles.debugHeader}>
            <h3>🎵 Player SDK Status</h3>
            <button onClick={() => setDebugOpen(false)} className={styles.closeBtn}>
              ✕
            </button>
          </div>

          <div className={styles.debugContent}>
            <div className={styles.debugRow}>
              <span className={styles.label}>Device:</span>
              <span className={styles.value} style={{ color: isIOS ? "#FF6B6B" : "#6BCF7F" }}>
                {isIOS ? "iPhone/iPad 📱" : "Desktop/Web 💻"}
              </span>
            </div>

            <div className={styles.debugRow}>
              <span className={styles.label}>Premium:</span>
              <span className={styles.value} style={{ color: isPremium ? "#6BCF7F" : "#FF6B6B" }}>
                {isPremium ? "Yes ✓" : "No ✗"}
              </span>
            </div>

            <div className={styles.debugRow}>
              <span className={styles.label}>SDK Loaded:</span>
              <span className={styles.value} style={{ color: sdkLoaded ? "#6BCF7F" : "#FF6B6B" }}>
                {sdkLoaded ? "Yes ✓" : "No ✗"}
              </span>
            </div>

            <div className={styles.debugRow}>
              <span className={styles.label}>Player Ready:</span>
              <span className={styles.value} style={{ color: isReady ? "#6BCF7F" : "#FF6B6B" }}>
                {isReady ? "Yes ✓" : "No ✗"}
              </span>
            </div>

            <div className={styles.debugRow}>
              <span className={styles.label}>Device ID:</span>
              <span className={styles.value}>{deviceId ? "Set ✓" : "Waiting ⏳"}</span>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.debugRow}>
              <span className={styles.label}>Playing:</span>
              <span className={styles.value} style={{ color: isPlaying ? "#FFD93D" : "#999" }}>
                {isPlaying ? "Yes 🎵" : "No"}
              </span>
            </div>

            <div className={styles.debugRow}>
              <span className={styles.label}>Volume:</span>
              <span className={styles.value}>{volume}%</span>
            </div>

            <div className={styles.debugRow}>
              <span className={styles.label}>Current Track:</span>
              <span className={styles.value}>
                {currentTrack?.name || "None"}
              </span>
            </div>

            {currentTrack && (
              <div className={styles.debugRow}>
                <span className={styles.label}>Artist:</span>
                <span className={styles.value}>
                  {currentTrack.artists?.map((a) => a.name).join(", ") || "Unknown"}
                </span>
              </div>
            )}

            <div className={styles.debugRow}>
              <span className={styles.label}>Position:</span>
              <span className={styles.value}>
                {Math.floor(position / 1000)}s / {Math.floor(duration / 1000)}s
              </span>
            </div>
          </div>

          <div className={styles.debugFooter}>
            <p>🔍 Debug Info - Aiuta a diagnosticare problemi</p>
          </div>
        </div>
      )}
    </div>
  );
}
