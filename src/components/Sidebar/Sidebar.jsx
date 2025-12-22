"use client";

import { Library, Plus, Search, ListMusic, X, Check } from "lucide-react";
import styles from "../../app/home/home.module.css"; 
import { useState, useEffect, useRef } from "react";
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("Recents");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const sortMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setIsSortMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSmall = () => {
    setIsCollapsed(!isCollapsed);
  };

  const fetchData = async (signal) => {
    let url = "";
    if (filter === "Playlists") url = "/api/playlists/user?limit=50";
    else if (filter === "Albums") url = "/api/albums/saved?limit=50";
    else if (filter === "Artists") url = "/api/spotify/get-followed-artists?limit=50";

    if (!url) return;

    try { 
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error("Errore nel caricamento");
      
      const data = await res.json();
      if (filter === "Artists") {
        setLibraryItems(data.artists?.items || []);
      } else {
        setLibraryItems(data.items || []);
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error("Errore fetch sidebar:", error);
      setLibraryItems([]);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [filter]);

  const handleFilterChange = (newFilter) => {
    if (filter === newFilter) return;
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
            } else {
              throw new Error("Errore nel seguire la playlist");
            }
          } catch (err) {
            console.error(err);
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
            } else {
              throw new Error("Errore nel smettere di seguire");
            }
          } catch (err) {
            console.error(err);
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
            } else {
              throw new Error("Errore nel seguire l'artista");
            }
          } catch (err) {
            console.error(err);
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
            } else {
              throw new Error("Errore nel smettere di seguire");
            }
          } catch (err) {
            console.error(err);
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
        },
      });
      items.push({
        id: "copy-link",
        label: "Copia link",
        icon: "",
        action: () => {
          const link = `https://open.spotify.com/artist/${item.id}`;
          navigator.clipboard.writeText(link);
        },
      });
      items.push({ divider: true });
      items.push({
        id: "report",
        label: "Segnala artista",
        icon: "",
        danger: true,
        action: () => {
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
            } else {
              throw new Error("Errore nel salvare l'album");
            }
          } catch (err) {
            console.error(err);
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
              console.log(" Album rimosso");
            } else {
              throw new Error("Errore nel rimuovere l'album");
            }
          } catch (err) {
            console.error(err);
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
        },
      });
      items.push({ divider: true });
      items.push({
        id: "report",
        label: "Segnala album",
        icon: "",
        danger: true,
        action: () => {
          console.log("Segnala album:", item.id);
        },
      });
    }

    return items;
  };

  const filteredAndSortedItems = libraryItems
    .filter((item) => {
      if (!searchQuery) return true;
      const name = item.name || item.album?.name || "";
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortOrder === "Alphabetical") {
        const nameA = a.name || a.album?.name || "";
        const nameB = b.name || b.album?.name || "";
        return nameA.localeCompare(nameB);
      }
      if (sortOrder === "Creator" && filter === "Playlists") {
        const ownerA = a.owner?.display_name || "";
        const ownerB = b.owner?.display_name || "";
        return ownerA.localeCompare(ownerB);
      }
      return 0;
    });

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
        style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '8px 0' : '12px' }}
      >
        {image && <img 
          src={image} 
          alt={title} 
          className={imageClass} 
          style={isCollapsed ? { width: '48px', height: '48px', minWidth: '48px', borderWidth: '0' } : {}}
        />}
        {!isCollapsed && (
          <div className={styles.itemInfo}>
            <span className={styles.itemTitle}>{title}</span>
            <span className={styles.itemDetails}>{details}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className={styles.libraryContainer}
      style={{ 
        width: isCollapsed ? '80px' : '320px', 
        transition: 'width 0.3s ease',
        alignItems: isCollapsed ? 'center' : 'stretch'
      }}
    >
      <div className={styles.libraryHeader} style={{ justifyContent: isCollapsed ? 'center' : 'space-between', padding: isCollapsed ? '0' : '0 8px' }}>
        <button className={styles.libraryTitle} onClick={getSmall}> 
          <Library /> 
          {!isCollapsed && "Your Library"} 
        </button> 
        {!isCollapsed && ( 
          <div className={styles.headerButtons}>
            <button 
              className={styles.addPlaylistButton}
              onClick={() => setShowCreateModal(true)}
              title="Crea playlist"
            > 
              <Plus size={20} />
            </button>
          </div>  
        )}
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

      {!isCollapsed && (
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
      )}

      {!isCollapsed && (
        <div className={styles.libraryUtilities}>
          {isSearchOpen ? (
            <div className={styles.searchContainer}>
              <button className={styles.iconButton} onClick={() => setIsSearchOpen(false)}>
                 <Search size={16} />
              </button>
              <input 
                type="text" 
                className={styles.searchInput} 
                placeholder="Cerca..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button className={styles.iconButton} onClick={() => { setSearchQuery(""); setIsSearchOpen(false); }}>
                <X size={16} />
              </button>
            </div>
          ) : (
            <button className={`${styles.iconButton} ${styles.searchIcon}`} onClick={() => setIsSearchOpen(true)}>
              <Search size={18} />
            </button>
          )}
          
          <div style={{ position: 'relative' }} ref={sortMenuRef}>
            <button 
              className={styles.sortButton} 
              onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
            >
              <span>{sortOrder === "Recents" ? "Recenti" : sortOrder === "Alphabetical" ? "Alfabetico" : "Autore"}</span>
              <ListMusic size={16} />
            </button>
            
            {isSortMenuOpen && (
              <div className={styles.sortMenu}>
                <div className={styles.navTitle}>Ordina per</div>
                <button 
                  className={`${styles.sortMenuItem} ${sortOrder === "Recents" ? styles.active : ''}`}
                  onClick={() => { setSortOrder("Recents"); setIsSortMenuOpen(false); }}
                >
                  Recenti
                  {sortOrder === "Recents" && <Check size={16} />}
                </button>
                <button 
                  className={`${styles.sortMenuItem} ${sortOrder === "Alphabetical" ? styles.active : ''}`}
                  onClick={() => { setSortOrder("Alphabetical"); setIsSortMenuOpen(false); }}
                >
                  Alfabetico
                  {sortOrder === "Alphabetical" && <Check size={16} />}
                </button>
                {filter === "Playlists" && (
                  <button 
                    className={`${styles.sortMenuItem} ${sortOrder === "Creator" ? styles.active : ''}`}
                    onClick={() => { setSortOrder("Creator"); setIsSortMenuOpen(false); }}
                  >
                    Autore
                    {sortOrder === "Creator" && <Check size={16} />}
                  </button>
                )}
              </div>
            )}
          </div>
        </div> 
      )}

      <div className={styles.libraryList}>
        {filteredAndSortedItems.map(renderLibraryItem)}
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
 
