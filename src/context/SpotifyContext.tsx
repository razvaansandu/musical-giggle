"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

declare global {
  interface Window {
    Spotify: any;
  }
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album?: { images: Array<{ url: string }>; name: string };
  duration_ms: number;
  uri: string;
}

export interface SpotifyContextType {
  isReady: boolean;
  isPlaying: boolean;
  isPremium: boolean;
  currentTrack: SpotifyTrack | null;
  deviceId: string | null;
  volume: number;
  position: number;
  duration: number;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  setVolume: (volumePercent: number) => Promise<void>;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export function SpotifyProvider({ children, token: serverToken }: { children: React.ReactNode; token?: string }) {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [volume, setVolumeState] = useState(50);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isIOS, setIsIOS] = useState(false);
  const playerRef = useRef<any>(null);

  const getToken = () => serverToken || document.cookie.split("; ").find(r => r.startsWith("auth_code="))?.split("=")[1];

  const checkIsIOS = useCallback(() => {
    const ua = navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua);
  }, []);

  const loadSpotifyScript = useCallback(async () => {
    if (window.Spotify || isIOS) return;
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        clearInterval(check);
        reject(new Error("SDK timeout"));
      }, 3000);
      const check = setInterval(() => {
        if (window.Spotify) {
          clearInterval(check);
          clearTimeout(timeout);
          resolve();
        }
      }, 100);
    });
  }, [isIOS]);

  const checkPremium = useCallback(async (token: string) => {
    const res = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setIsPremium(data.product === "premium");
    return data.product === "premium";
  }, []);

  const initPlayer = useCallback(async (token: string) => {
    if (isIOS) return;
    try {
      await loadSpotifyScript();
      const player = new window.Spotify.Player({
        name: "Musical Giggle",
        getOAuthToken: (cb: any) => cb(token),
        volume: 0.5,
      });

      player.addListener("ready", ({ device_id }: any) => {
        setDeviceId(device_id);
        setIsReady(true);
      });

      player.addListener("player_state_changed", (state: any) => {
        if (!state) return;
        setCurrentTrack(state.track_window.current_track);
        setIsPlaying(!state.paused);
        setPosition(state.position);
        setDuration(state.duration);
      });

      playerRef.current = player;
      player.connect();
    } catch (error) {
      console.warn("Player init failed:", error);
    }
  }, [loadSpotifyScript, isIOS]);

  useEffect(() => {
    setIsIOS(checkIsIOS());
  }, [checkIsIOS]);

  useEffect(() => {
    (async () => {
      const token = getToken();
      if (!token) return;
      const isPrem = await checkPremium(token);
      if (isPrem) await initPlayer(token);
    })();

    return () => {
      if (playerRef.current) playerRef.current.disconnect();
    };
  }, [checkPremium, initPlayer]);

  const play = useCallback(async () => {
    if (playerRef.current) await playerRef.current.resume();
  }, []);

  const pause = useCallback(async () => {
    if (playerRef.current) await playerRef.current.pause();
  }, []);

  const togglePlayPause = useCallback(async () => {
    if (playerRef.current) await playerRef.current.togglePlay();
  }, []);

  const nextTrack = useCallback(async () => {
    if (playerRef.current) await playerRef.current.nextTrack();
  }, []);

  const previousTrack = useCallback(async () => {
    if (playerRef.current) await playerRef.current.previousTrack();
  }, []);

  const seek = useCallback(async (positionMs: number) => {
    if (playerRef.current) await playerRef.current.seek(positionMs);
  }, []);

  const setVolume = useCallback(async (volumePercent: number) => {
    if (playerRef.current) {
      await playerRef.current.setVolume(volumePercent / 100);
      setVolumeState(volumePercent);
    }
  }, []);

  const isAvailable = !isIOS && isPremium;

  const value: SpotifyContextType = {
    isReady: isAvailable ? isReady : false,
    isPlaying,
    isPremium: isAvailable,
    currentTrack,
    deviceId,
    volume,
    position,
    duration,
    play,
    pause,
    togglePlayPause,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
  };

  return <SpotifyContext.Provider value={value}>{children}</SpotifyContext.Provider>;
}

export function useSpotify(): SpotifyContextType {
  const context = useContext(SpotifyContext);
  if (!context) throw new Error("useSpotify deve essere dentro SpotifyProvider");
  return context;
}
