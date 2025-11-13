"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/apiClient";
import styles from "./player.module.css";

export default function PlayerBar() {
  const [state, setState] = useState(null);

  useEffect(() => {
    api.player.getPlayback().then(setState).catch(console.error);
  }, []);

  if (!state || !state.item) return null;

  const track = state.item;

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <img
          src={track.album.images?.[0]?.url}
          className={styles.cover}
        />
        <div>
          <div className={styles.title}>{track.name}</div>
          <div className={styles.artist}>
            {track.artists.map(a => a.name).join(", ")}
          </div>
        </div>
      </div>
      <div className={styles.center}>
        <button className={styles.button}>⏮</button>
        <button className={styles.button}>⏯</button>
        <button className={styles.button}>⏭</button>
      </div>
      <div className={styles.right}>
        <div className={styles.wave}></div>
      </div>
    </div>
  );
}
