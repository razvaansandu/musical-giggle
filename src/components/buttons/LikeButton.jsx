"use client";
import style from './buttonStyle.css';
import { useState } from 'react';
import {  useRef } from 'react';
import { VolumeButton } from '../volume/Volume';
import ButtonShuffle from './buttonShuffle';
import SpotifyDevicesButton from './buttonDispositivi';
import PlayButton from './PlayButton';
import ButtonNextSong from './buttonNextSong';
import ButtonPrevSong from './songButtonFirst';
import PlaybackProgress from '../Player/PlaybackProgress.jsx';

export default function SpotifyControls() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const [isLater, setIsLater] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };


const handlePlayBack = () => {
    setIsBack(!isBack);
  }
  const handlePlayLater = () => {
    setIsLater(!isLater);
  }
  return (
<div>
</div>

  );
}
