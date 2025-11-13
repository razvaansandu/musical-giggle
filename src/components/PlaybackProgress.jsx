"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./playbackProgress.module.css";

// Props:
// duration (seconds) - required
// isPlaying (bool) - optional, when true the bar advances automatically
// initialTime (seconds) - optional starting position
// onSeek(newTimeSeconds) - optional callback when user seeks
export default function PlaybackProgress({ duration = 0, isPlaying = false, initialTime = 0, onSeek }) {
  const [current, setCurrent] = useState(Math.max(0, Math.min(initialTime, duration || Infinity)));
  const rafRef = useRef(null);
  const lastRef = useRef(performance.now());
  const trackRef = useRef(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    setCurrent((c) => Math.max(0, Math.min(c, duration || Infinity)));
  }, [duration]);

  useEffect(() => {
    // sync initialTime when it changes
    setCurrent((c) => {
      if (Math.abs(c - initialTime) > 0.25) return Math.max(0, Math.min(initialTime, duration || Infinity));
      return c;
    });
  }, [initialTime, duration]);

  useEffect(() => {
    // drive animation when isPlaying is true
    function step(now) {
      const last = lastRef.current || now;
      const dt = (now - last) / 1000; // seconds
      lastRef.current = now;
      setCurrent((prev) => {
        const next = Math.min(duration, prev + dt);
        if (next >= duration) {
          // stop at end
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    }

    if (isPlaying && duration > 0 && !rafRef.current) {
      lastRef.current = performance.now();
      rafRef.current = requestAnimationFrame(step);
    }

    if (!isPlaying && rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isPlaying, duration]);

  // format mm:ss
  function fmt(sec) {
    if (!isFinite(sec) || isNaN(sec)) return "0:00";
    const s = Math.floor(sec);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${r.toString().padStart(2, "0")}`;
  }

  function seekToFraction(frac) {
    const t = Math.max(0, Math.min(1, frac)) * duration;
    setCurrent(t);
    if (onSeek) onSeek(t);
  }

  function onClickTrack(e) {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const frac = x / rect.width;
    seekToFraction(frac);
  }

  // pointer drag support
  useEffect(() => {
    function onPointerMove(e) {
      if (!draggingRef.current || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const frac = x / rect.width;
      seekToFraction(frac);
    }

    function onPointerUp() {
      draggingRef.current = false;
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    }

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };
  }, [duration]);

  function onThumbPointerDown(e) {
    e.preventDefault();
    draggingRef.current = true;
    function onPointerMove(e) {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const frac = x / rect.width;
      seekToFraction(frac);
    }
    function onPointerUp() {
      draggingRef.current = false;
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    }
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  }

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className={styles.container}>
      <div className={styles.time}>{fmt(current)}</div>
      <div className={styles.track} ref={trackRef} onClick={onClickTrack} role="slider" aria-valuemin={0} aria-valuemax={duration} aria-valuenow={current} tabIndex={0}>
        <div className={styles.filled} style={{ width: `${pct}%` }} />
        <div
          className={styles.thumb}
          style={{ left: `${pct}%` }}
          onPointerDown={onThumbPointerDown}
          role="presentation"
        />
      </div>
      <div className={styles.time}>{fmt(duration)}</div>
    </div>
  );
}
