"use client";
import { useState } from 'react';
import styles from './buttons.module.css';

export default function LikeButton({ initial = false, onClick }) {
  const [isLiked, setIsLiked] = useState(initial);

  const handleClick = () => {
    setIsLiked(!isLiked);
    if (onClick) onClick(!isLiked);
  };

  return (
    <button className={styles.iconButton} onClick={handleClick} type="button">
      <svg height="24" width="24" viewBox="0 0 24 24">
        <path
          fill={isLiked ? '#1DB954' : '#ffffffff'}
          d="M5.21 1.57a6.757 6.757 0 016.708 1.545.124.124 0 00.165 0 6.741 6.741 0 012.876-1.702 6.757 6.757 0 017.9 5.366 6.758 6.758 0 01-1.994 6.487c-2.947 2.945-5.888 5.898-8.835 8.839a.124.124 0 01-.175 0C9.152 19.407 6.197 16.67 3.238 13.94 1.403 12.12 1.11 9.497 2.318 7.382a6.757 6.757 0 012.892-2.813z"
        />
      </svg>
    </button>
  );
}
   