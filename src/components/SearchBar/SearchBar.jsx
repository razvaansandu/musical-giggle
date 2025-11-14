"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form className={styles.bar} onSubmit={handleSubmit}>
      <div className={styles.icon}>
        🔍
      </div>

      <input
        type="text"
        placeholder="Search songs, artists, albums, playlists..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.input}
      />
    </form>
  );
}
