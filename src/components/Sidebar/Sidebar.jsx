"use client";
import {
  Library,
  Plus,
  Search,
  ListMusic,
  Home,
} from "lucide-react";
import styles from "../../app/home/home.module.css"; 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AppSidebar() {
  const router = useRouter();
  const [filter, setFilter] = useState("Playlists");
  const [libraryItems, setLibraryItems] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let url = "";
      if (filter === "Playlists") { 
        url = "/api/playlists/user?limit=50";
      } else if (filter === "Albums") {
        url = "/api/albums/saved?limit=50";
      } else if (filter === "Artists") {
        url = "/api/spotify/get-followed-artists?limit=50";
      }

      if (url) {
        try {
          const res = await fetch(url);
          if (!res.ok) {
            throw new Error(`Failed to fetch ${filter}`);
          }
          const data = await res.json();
          if (filter === "Artists") {
            setLibraryItems(data.artists?.items || []);
          } else {
            setLibraryItems(data.items || []);
          }
        } catch (error) {
          console.error(error);
          setLibraryItems([]);
        }
      } else {
        setLibraryItems([]);
      }
    }

    fetchData();
  }, [filter]);

  const handleFilterChange = (newFilter) => {
    setLibraryItems([]);
    setFilter(newFilter);
  };

  const renderLibraryItem = (item) => {
    const isPlaylist = filter === "Playlists";
    const isArtist = filter === "Artists";
    const isAlbum = filter === "Albums";

    let key, image, title, details, imageTypeClass;

    if (isPlaylist) {
      if (!item.owner) return null; 
      key = item.id;
      image = item.images && item.images[0]?.url;
      title = item.name;
      details = `Playlist • ${item.owner.display_name}`;
      imageTypeClass = styles.itemImagePlaylist;
    } else if (isArtist) {
      if (item.type !== "artist") return null;
      key = item.id;
      image = item.images && item.images[0]?.url;
      title = item.name;
      details = "Artist";
      imageTypeClass = styles.itemImageArtist;
    } else if (isAlbum) {
      if (!item.album) return null;
      key = item.album.id;
      image = item.album.images && item.album.images[0]?.url;
      title = item.album.name;
      details = `Album • ${item.album.artists.map((a) => a.name).join(", ")}`;
      imageTypeClass = styles.itemImagePlaylist;
    } else {
      return null;
    }

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
            onClick={() => handleFilterChange("Playlists")}
            style={{
              backgroundColor: filter === "Playlists" ? "white" : "",
              color: filter === "Playlists" ? "black" : "",
            }}
          >
            Playlists
          </button>
          <button
            className={styles.chip}
            onClick={() => handleFilterChange("Artists")}
            style={{
              backgroundColor: filter === "Artists" ? "white" : "",
              color: filter === "Artists" ? "black" : "",
            }}
          >
            Artists
          </button>
          <button
            className={styles.chip}
            onClick={() => handleFilterChange("Albums")}
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