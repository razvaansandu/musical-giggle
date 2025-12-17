"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function WebPlayback() {
  const playerRef = useRef(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isIOS] = useState(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua);
  });

  useEffect(() => {
    if (isIOS) {
      console.warn("Web Playback SDK non disponibile su iOS");
      return;
    }

    const initializePlayer = async () => {
      const token = document.cookie
        .split("; ")
        .find(r => r.startsWith("auth_code="))
        ?.split("=")[1];

      if (!token) {
        console.warn("Token non trovato");
        return;
      }

      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: "Musical Giggle Player",
          getOAuthToken: (cb) => {
            cb(token);
          },
          volume: 0.5,
        });

        playerRef.current = player;

        player.addListener("ready", ({ device_id }) => {
          setDeviceId(device_id);
          setIsReady(true);
        });

        player.addListener("not_ready", ({ device_id }) => {
          setIsReady(false);
        });

        player.addListener("player_state_changed", (state) => {
          if (!state) return;
          const current = state.track_window.current_track;
          setCurrentTrack(current);
          setIsPlaying(!state.paused);
        });

        player.addListener("authentication_error", ({ message }) => {
          console.error("Auth error:", message);
        });

        player.addListener("account_error", ({ message }) => {
          console.error("Account error:", message);
        });

        player.addListener("playback_error", ({ message }) => {
          console.error("Playback error:", message);
        });

        player.addListener("initialization_error", ({ message }) => {
          console.error("Init error:", message);
        });

        player.addListener("autoplay_failed", () => {
          console.warn("Autoplay not allowed");
        });

        player.connect();
      };
    };

    initializePlayer();
  }, [isIOS]);


  const play = useCallback(async () => {
    if (playerRef.current) {
      await playerRef.current.resume();
      console.log("Riproduzione avviata");
    }
  }, []);

  const pause = useCallback(async () => {
    if (playerRef.current) {
      await playerRef.current.pause();
      console.log("Riproduzione in pausa");
    }
  }, []);

  const togglePlayPause = useCallback(async () => {
    if (playerRef.current) {
      await playerRef.current.togglePlay();
      console.log("Toggle play/pause");
    }
  }, []);

  const nextTrack = useCallback(async () => {
    if (playerRef.current) {
      await playerRef.current.nextTrack();
      console.log("Prossimo brano");
    }
  }, []);

  const previousTrack = useCallback(async () => {
    if (playerRef.current) {
      await playerRef.current.previousTrack();
      console.log("Brano precedente");
    }
  }, []);

  const seek = useCallback(async (positionMs) => {
    if (playerRef.current) {
      await playerRef.current.seek(positionMs);
      console.log("Seek to:", positionMs);
    }
  }, []);

  const setVolume = useCallback(async (volumePercent) => {
    if (playerRef.current) {
      const volume = volumePercent / 100;
      await playerRef.current.setVolume(volume);
      console.log("Volume impostato a:", volumePercent + "%");
    }
  }, []);

  const getCurrentState = useCallback(async () => {
    if (playerRef.current) {
      const state = await playerRef.current.getCurrentState();
      return state;
    }
  }, []);

  useEffect(() => {
    window.spotifyPlayer = {
      play,
      pause,
      togglePlayPause,
      nextTrack,
      previousTrack,
      seek,
      setVolume,
      getCurrentState,
      deviceId,
      isReady,
      isPlaying,
      currentTrack,
    };
  }, [play, pause, togglePlayPause, nextTrack, previousTrack, seek, setVolume, getCurrentState, deviceId, isReady, isPlaying, currentTrack]);

  return null; 
}

