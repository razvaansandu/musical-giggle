"use client";

import { useState } from 'react';



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
