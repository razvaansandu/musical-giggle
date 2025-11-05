"use client";
import style from './buttonStyle.css';
import { useState } from 'react';
import {  useRef } from 'react';
import { VolumeButton } from '../volume/Volume';

export default function SpotifyControls() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const [isLater, setIsLater] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePlayShuffle = () => {
    setIsShuffle(!isShuffle);
  }

const handlePlayBack = () => {
    setIsBack(!isBack);
  }
  const handlePlayLater = () => {
    setIsLater(!isLater);
  }
  return (

    <div className="controls">
       <button onClick={handlePlayShuffle}>{isShuffle ? 'si' : 'no'}</button>
      <button onClick={handlePlayBack} >{isBack ? '⏮' : '⏮' }</button>  
      <button onClick={handlePlayPause}>{isPlaying ? '⏸' : 'avvio'}</button>
      <button onClick={handlePlayLater} >{isLater ? '⏭' : '⏭' }</button>
      {/* <button onClick>loop</button> */}
      &nbsp;&nbsp;&nbsp;&nbsp;
     <VolumeButton ></VolumeButton>
    </div>
  );
}
