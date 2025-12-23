import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SpotifyHeader.module.css';
import SearchBar from "../SearchBar/SearchBar";

export default function SpotifyHeader() {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState({ albums: [], playlists: [], tracks: [] });
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  
  const [profileImage, setProfileImage] = useState(null); 
  
  const bellRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const res = await fetch("/api/spotify/get-user-profile");
        if (res.ok) {
          const data = await res.json();
          if (data.images && data.images.length > 0) {
            const lastImage = [...data.images].pop(); 
            setProfileImage(lastImage?.url);
          }
        }
      } catch (err) {
        console.error("Errore caricamento immagine header:", err);
      }
    };
    fetchProfileImage();
  }, []);

  const toggleNotifications = async () => {
    if (!showNotifications) {
      setShowNotifications(true);
      if (notifications.albums.length === 0 && notifications.playlists.length === 0 && notifications.tracks.length === 0) {
        setLoadingNotifications(true);
        try {
          const res = await fetch('/api/notifications');
          if (res.ok) {
            const data = await res.json();
            setNotifications(data);
          }
        } catch (error) {
          console.error("Error fetching notifications", error);
        } finally {
          setLoadingNotifications(false);
        }
      }
    } else {
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <button
          className={styles.homeButton}
          onClick={() => router.push('/home')}
          aria-label="Home"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.669 11.538a.5.5 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686m.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858m.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288" />
          </svg>
        </button>
      </div>

      <div className={styles.searchSection}>
        <button
          className={styles.homeButton}
          onClick={() => router.push('/home')}
          aria-label="Home"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
             <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z" />
             <path d="m8 3.293 6 6V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V9.293l6-6Z" />
          </svg>
        </button>
        <SearchBar />
      </div>

      <div className={styles.userSection}>
        <button
          className={styles.installButton}
          ref={bellRef}
          onClick={toggleNotifications}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
          </svg>
        </button>

        <button
          className={styles.profileButton}
          onClick={() => router.push('/profilo')}
        >
          {profileImage ? (
            <img src={profileImage} alt="Profilo" className={styles.profileImage} />
          ) : (
            <div className={styles.profileImagePlaceholder} style={{ 
               width: 32, height: 32, borderRadius: '50%', background: '#535353', display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 16 16">
                 <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
               </svg>
            </div>
          )}
        </button>
      </div>

      {showNotifications && (
        <div className={styles.notificationDropdown} ref={dropdownRef}>
          {loadingNotifications ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#b3b3b3' }}>Caricamento...</div>
          ) : notifications.albums.length === 0 && notifications.tracks.length === 0 && notifications.playlists.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#b3b3b3' }}>Nessuna notifica</div>
          ) : (
            <>
              {notifications.albums.length > 0 && (
                <div className={styles.notificationSection}>
                  <h3>Nuove Uscite</h3>
                  {notifications.albums.map(album => (
                    <div
                      key={album.id}
                      className={styles.notificationItem}
                      onClick={() => {
                        router.push(`/album/${album.id}`);
                        setShowNotifications(false);
                      }}
                    >
                      <img src={album.images[0]?.url} alt={album.name} className={styles.notificationImage} />
                      <div className={styles.notificationInfo}>
                        <span className={styles.notificationTitle}>{album.name}</span>
                        <span className={styles.notificationSubtitle}>{album.artists.map(a => a.name).join(', ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {notifications.tracks.length > 0 && (
                <div className={styles.notificationSection}>
                  <h3>Nuovi Brani</h3>
                  {notifications.tracks.map(track => (
                    <div
                      key={track.id}
                      className={styles.notificationItem}
                      onClick={() => {
                        router.push(`/album/${track.album.id}`);
                        setShowNotifications(false);
                      }}
                    >
                      <img src={track.album.images[0]?.url} alt={track.name} className={styles.notificationImage} />
                      <div className={styles.notificationInfo}>
                        <span className={styles.notificationTitle}>{track.name}</span>
                        <span className={styles.notificationSubtitle}>{track.artists.map(a => a.name).join(', ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {notifications.playlists.length > 0 && (
                <div className={styles.notificationSection}>
                  <h3>Playlist Consigliate</h3>
                  {notifications.playlists.map(playlist => (
                    <div
                      key={playlist.id}
                      className={styles.notificationItem}
                      onClick={() => {
                        setShowNotifications(false);
                      }}
                    >
                      <img src={playlist.images[0]?.url} alt={playlist.name} className={styles.notificationImage} />
                      <div className={styles.notificationInfo}>
                        <span className={styles.notificationTitle}>{playlist.name}</span>
                        <span className={styles.notificationSubtitle}>{playlist.owner.display_name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
}
