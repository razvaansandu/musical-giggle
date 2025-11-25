// components/Sidebar/AppSidebar.tsx
"use client";
import {
  Library,
  Plus,
  Search,
  ListMusic,
  Home,
} from "lucide-react";
import styles from "../app/home.module.css";
import { useState, useEffect } from "react";

export default function AppSidebar() {
  const [filter, setFilter] = useState("Playlists");
  const [libraryItems, setLibraryItems] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let url = "";
      if (filter === "Playlists") {
        // Assuming this endpoint returns the user's playlists
        url = "/api/playlists/user";
      } else if (filter === "Albums") {
        // Assuming this endpoint returns the user's saved albums
        url = "/api/albums/saved";
      }

      if (url) {
        try {
          const res = await fetch(url);
          if (!res.ok) {
            throw new Error(`Failed to fetch ${filter}`);
          }
          const data = await res.json();
          setLibraryItems(data.items || []);
        } catch (error) {
          console.error(error);
          setLibraryItems([]); // Clear items on error
        }
      } else {
        setLibraryItems([]);
      }
    }

    fetchData();
  }, [filter]);

  const renderLibraryItem = (item) => {
    // Adjust properties based on whether it's a playlist or a saved album
    const isPlaylist = filter === "Playlists";
    const key = isPlaylist ? item.id : item.album.id;
    const image = isPlaylist
      ? item.images && item.images[0]?.url
      : item.album.images && item.album.images[0]?.url;
    const title = isPlaylist ? item.name : item.album.name;
    const details = isPlaylist
      ? `Playlist • ${item.owner.display_name}`
      : `Album • ${item.album.artists.map((a) => a.name).join(", ")}`;
    const imageTypeClass = isPlaylist
      ? styles.itemImagePlaylist
      : styles.itemImageArtist;

    return (
      <div key={key} className={styles.libraryItem}>
        {image && <img src={image} alt={title} className={imageTypeClass} />}
        <div className={styles.itemInfo}>
          <span className={styles.itemTitle}>{title}</span>
          <span className={styles.itemDetails}>{details}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.libraryContainer} style={{ marginBottom: "8px" }}>
        <div className={styles.libraryItem}>
          <Home size={24} />
          <div className={styles.itemInfo}>
            <span className={styles.itemTitle}>Home</span>
          </div>
        </div>
        <div className={styles.libraryItem}>
          <Search size={24} />
          <div className={styles.itemInfo}>
            <span className={styles.itemTitle}>Search</span>
          </div>
        </div>
      </div>

      <div className={styles.libraryContainer}>
        <div className={styles.libraryHeader}>
          <button className={styles.libraryTitle}>
            <Library />
            <span>Your Library</span>
          </button>
          <div className={styles.headerButtons}>
            <button className={styles.roundButton}>
              <Plus />
            </button>
          </div>
        </div>

        <div className={styles.libraryFilters}>
          <button
            className={styles.chip}
            onClick={() => setFilter("Playlists")}
            style={{
              backgroundColor: filter === "Playlists" ? "white" : "",
              color: filter === "Playlists" ? "black" : "",
            }}
          >
            Playlists
          </button>
          <button
            className={styles.chip}
            onClick={() => setFilter("Albums")}
            style={{
              backgroundColor: filter === "Albums" ? "white" : "",
              color: filter === "Albums" ? "black" : "",
            }}
          >
            Albums
          </button>
        </div>

        <div className={styles.libraryUtilities}>
          <button className={`${styles.iconButton} ${styles.searchIcon}`}>
            <Search size={18} />
          </button>
          <button className={styles.sortButton}>
            <span>Recents</span>
            <ListMusic size={16} />
          </button>
        </div>

        <div className={styles.libraryList}>
          {libraryItems.map(renderLibraryItem)}
        </div>
      </div>
    </>
  );
}