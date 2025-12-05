"use client";

import { Library, Plus, Search, ListMusic } from "lucide-react";
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
      if (filter === "Playlists") url = "/api/playlists/user?limit=50";
      else if (filter === "Albums") url = "/api/albums/saved?limit=50";
      else if (filter === "Artists") url = "/api/spotify/get-followed-artists?limit=50";

      if (!url) return;

      try { 
        const res = await fetch(url);
        if (!res.ok) throw new Error("Errore nel caricamento");
        
        const data = await res.json();
        if (filter === "Artists") {
          setLibraryItems(data.artists?.items || []);
        } else {
          setLibraryItems(data.items || []);
        }
      } catch (error) {
        console.error("Errore fetch sidebar:", error);
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
    let key, image, title, details, imageClass, linkUrl;

    if (filter === "Playlists") {
      if (!item.owner) return null;
      key = item.id;
      image = item.images?.[0]?.url;
      title = item.name;
      details = `Playlist • ${item.owner.display_name}`;
      imageClass = styles.itemImagePlaylist;
      linkUrl = `/playlist/${key}`;
    } 
    else if (filter === "Artists") {
      if (item.type !== "artist") return null;
      key = item.id;
      image = item.images?.[0]?.url;
      title = item.name;
      details = "Artist";
      imageClass = styles.itemImageArtist; 
      linkUrl = `/artist/${key}`;
    } 
    else if (filter === "Albums") { 
      if (!item.album) return null;
      key = item.album.id;
      image = item.album.images?.[0]?.url;
      title = item.album.name;
      details = `Album • ${item.album.artists.map(a => a.name).join(", ")}`;
      imageClass = styles.itemImagePlaylist;
      linkUrl = `/album/${key}`;
    }     
    else {
      return null;
    }

    return (
      <div  
        key={key} 
        className={styles.libraryItem} 
        onClick={() => router.push(linkUrl)}
      > 
        {image && <img src={image} alt={title} className={imageClass} />}
        <div className={styles.itemInfo}>
          <span className={styles.itemTitle}>{title}</span>
          <span className={styles.itemDetails}>{details}</span>
        </div>
      </div>
    );
  };

  return (
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
        {["Playlists", "Artists", "Albums"].map((f) => (
          <button 
            key={f} 
            className={styles.chip}
            onClick={() => handleFilterChange(f)}
            style={{
              backgroundColor: filter === f ? "white" : "",
              color: filter === f ? "black" : "",
            }}
          > 
            {f}
          </button>
        ))} 
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
  );
}