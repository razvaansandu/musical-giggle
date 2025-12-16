"use client";

import { Library, Plus, Search, ListMusic } from "lucide-react";
import styles from "../../app/home/home.module.css"; 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ContextMenu from "../ContextMenu/ContextMenu";
import CreatePlaylistModal from "../CreatePlaylistModal/CreatePlaylistModal";

export default function AppSidebar() {
  const router = useRouter();
  const [filter, setFilter] = useState("Playlists");
  const [libraryItems, setLibraryItems] = useState([]);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const handleFilterChange = (newFilter) => {
    setLibraryItems([]); 
    setFilter(newFilter); 
  };

  const handleContextMenu = (e, item, type) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.pageX, y: e.pageY });
    setSelectedItem({ item, type });
  };

  const getContextMenuItems = () => {
    if (!selectedItem) return [];
    const { item, type } = selectedItem;

    const items = [];

    if (type === "Playlists") {
      items.push({
        id: "follow-playlist",
        label: "Segui questa playlist",
        icon: "",
        action: async () => {
          try {
            const res = await fetch("/api/spotify/follow-playlist", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ playlist_id: item.id }),
            });
            if (res.ok) {
              console.log("Playlist seguita");
              alert("Playlist aggiunta ai tuoi preferiti");
            } else {
              throw new Error("Errore nel seguire la playlist");
            }
          } catch (err) {
            console.error(err);
            alert("Errore: " + err.message);
          }
        },
      });
      items.push({
        id: "unfollow-playlist",
        label: "Smetti di seguire",
        icon: "",
        action: async () => {
          try {
            const res = await fetch("/api/spotify/unfollow-playlist", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ playlist_id: item.id }),
            });
            if (res.ok) {
              console.log("Playlist non più seguita");
              alert("Playlist rimossa dai tuoi preferiti");
            } else {
              throw new Error("Errore nel smettere di seguire");
            }
          } catch (err) {
            console.error(err);
            alert("Errore: " + err.message);
          }
        },
      });
      items.push({
        id: "copy-link",
        label: "Copia link a playlist",
        icon: "",
        action: () => {
          const link = `https://open.spotify.com/playlist/${item.id}`;
          navigator.clipboard.writeText(link);
          alert("Link copiato!");
        },
      });
      items.push({
        id: "go-to-playlist",
        label: "Vai alla playlist",
        icon: "",
        action: () => router.push(`/playlist/${item.id}`),
      });
    } else if (type === "Artists") {
      items.push({
        id: "follow",
        label: "Segui artista",
        icon: "",
        action: async () => {
          try {
            const res = await fetch("/api/spotify/follow", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type: "artist", ids: [item.id] }),
            });
            if (res.ok) {
              console.log("Artista seguito");
              alert("Artista aggiunto ai tuoi preferiti");
            } else {
              throw new Error("Errore nel seguire l'artista");
            }
          } catch (err) {
            console.error(err);
            alert("Errore: " + err.message);
          }
        },
      });
      items.push({
        id: "unfollow",
        label: "Smetti di seguire",
        icon: "",
        action: async () => {
          try {
            const res = await fetch("/api/spotify/unfollow", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type: "artist", ids: [item.id] }),
            });
            if (res.ok) {
              console.log("Artista non più seguito");
              alert("Artista rimosso dai tuoi preferiti");
            } else {
              throw new Error("Errore nel smettere di seguire");
            }
          } catch (err) {
            console.error(err);
            alert("Errore: " + err.message);
          }
        },
      });
      items.push({
        id: "go-to-profile",
        label: "Vai al profilo",
        icon: "",
        action: () => router.push(`/artist/${item.id}`),
      });
      items.push({
        id: "share",
        label: "Condividi",
        icon: "",
        action: () => {
          const link = `https://open.spotify.com/artist/${item.id}`;
          navigator.clipboard.writeText(link);
          alert("Link copiato!");
        },
      });
      items.push({
        id: "copy-link",
        label: "Copia link",
        icon: "",
        action: () => {
          const link = `https://open.spotify.com/artist/${item.id}`;
          navigator.clipboard.writeText(link);
          alert("Link copiato!");
        },
      });
      items.push({ divider: true });
      items.push({
        id: "report",
        label: "Segnala artista",
        icon: "",
        danger: true,
        action: () => {
          alert("Grazie per la segnalazione. Il nostro team la analizzerà presto.");
          console.log("Segnala artista:", item.id);
        },
      });
    } else if (type === "Albums") {
      items.push({
        id: "save",
        label: "Salva album",
        icon: "",
        action: async () => {
          try {
            const albumId = item.album?.id || item.id;
            const res = await fetch("/api/albums/saved", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ids: [albumId] }),
            });
            if (res.ok) {
              console.log(" Album salvato");
              alert("Album aggiunto alla tua libreria");
            } else {
              throw new Error("Errore nel salvare l'album");
            }
          } catch (err) {
            console.error(err);
            alert("Errore: " + err.message);
          }
        },
      });
      items.push({
        id: "unsave",
        label: "Rimuovi album",
        icon: "",
        action: async () => {
          try {
            const albumId = item.album?.id || item.id;
            const res = await fetch("/api/albums/saved", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ids: [albumId] }),
            });
            if (res.ok) {
              console.log("✅ Album rimosso");
              alert("Album rimosso dalla tua libreria");
            } else {
              throw new Error("Errore nel rimuovere l'album");
            }
          } catch (err) {
            console.error(err);
            alert("Errore: " + err.message);
          }
        },
      });
      items.push({
        id: "go-to-album",
        label: "Vai all'album",
        icon: "",
        action: () => router.push(`/albums/${item.album?.id || item.id}`),
      });
      items.push({
        id: "share",
        label: "Condividi",
        icon: "",
        action: () => {
          const albumId = item.album?.id || item.id;
          const link = `https://open.spotify.com/album/${albumId}`;
          navigator.clipboard.writeText(link);
          alert("Link copiato!");
        },
      });
      items.push({
        id: "copy-link",
        label: "Copia link",
        icon: "",
        action: () => {
          const albumId = item.album?.id || item.id;
          const link = `https://open.spotify.com/album/${albumId}`;
          navigator.clipboard.writeText(link);
          alert("Link copiato!");
        },
      });
      items.push({ divider: true });
      items.push({
        id: "report",
        label: "Segnala album",
        icon: "",
        danger: true,
        action: () => {
          alert("Grazie per la segnalazione. Il nostro team la analizzerà presto.");
          console.log("Segnala album:", item.id);
        },
      });
    }

    return items;
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
      details = `Album • ${item.album.artists
        .map((a) => a.name)
        .join(", ")}`;
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
        onContextMenu={(e) => handleContextMenu(e, item, filter)}
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
          <button 
            className={styles.addPlaylistButton}
            onClick={() => setShowCreateModal(true)}
            title="Crea playlist"
          >
            <Plus size={20} />
          </button>
        </div>  
      </div>

      <CreatePlaylistModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(playlist) => {
          // Ricarica le playlist
          if (filter === "Playlists") {
            fetchData();
          }
        }}
      />

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

      <ContextMenu
        visible={contextMenu.visible && !!selectedItem}
        x={contextMenu.x}
        y={contextMenu.y}
        items={getContextMenuItems()}
        onClose={() => {
          setSelectedItem(null);
          setContextMenu({ ...contextMenu, visible: false });
        }}
      />
    </div>
  );
}
 
