"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push, replace } = useRouter();
  
  const initialQuery = pathname === '/search' ? searchParams.get("q")?.toString() || "" : "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch preview results
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim()) {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
          if (res.ok) {
            const data = await res.json();
            setResults(data);
            setShowDropdown(true);
          }
        } catch (error) {
          console.error("Search error:", error);
        }
      } else {
        setResults(null);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Sync input with URL
  useEffect(() => {
    if (pathname === '/search') {
      const urlQuery = searchParams.get('q') || '';
      if (urlQuery !== query) {
        setQuery(urlQuery);
      }
    } 
  }, [pathname, searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    const trimmed = query.trim();
    if (!trimmed) return;
    push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleItemClick = (path) => {
    setShowDropdown(false);
    push(path); 
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <form className={styles.bar} onSubmit={handleSubmit}>
        <div className={styles.icon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
          </svg> 
        </div> 
        <input
          type="text"
          placeholder="Search songs, artists, albums, playlists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results) setShowDropdown(true); }}
          className={styles.input}
        />
      </form>

      {showDropdown && results && (
        <div className={styles.dropdown}> 
          {results.tracks?.items?.slice(0, 3).length > 0 && (
            <>
              <div className={styles.sectionTitle}>Songs</div>
              {results.tracks.items.slice(0, 3).map((track) => (
                <div 
                  key={track.id} 
                  className={styles.dropdownItem}
                  onClick={() => handleItemClick(`/album/${track.album.id}`)} // Go to album for now
                >
                  <img src={track.album.images[0]?.url} alt={track.name} className={styles.itemImage} />
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{track.name}</span>
                    <span className={styles.itemSub}>{track.artists[0].name}</span>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Artists */}
          {results.artists?.items?.slice(0, 3).length > 0 && (
            <>
              <div className={styles.sectionTitle}>Artists</div>
              {results.artists.items.slice(0, 3).map((artist) => (
                <div 
                  key={artist.id} 
                  className={styles.dropdownItem}
                  onClick={() => handleItemClick(`/artist/${artist.id}`)}
                >
                  <img src={artist.images[0]?.url} alt={artist.name} className={`${styles.itemImage} ${styles.itemImageRound}`} />
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{artist.name}</span>
                    <span className={styles.itemSub}>Artist</span>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Albums */}
          {results.albums?.items?.slice(0, 3).length > 0 && (
            <>
              <div className={styles.sectionTitle}>Albums</div>
              {results.albums.items.slice(0, 3).map((album) => (
                <div 
                  key={album.id} 
                  className={styles.dropdownItem}
                  onClick={() => handleItemClick(`/album/${album.id}`)}
                >
                  <img src={album.images[0]?.url} alt={album.name} className={styles.itemImage} />
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{album.name}</span>
                    <span className={styles.itemSub}>{album.artists[0].name}</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
