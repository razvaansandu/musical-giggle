"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./ButtonAddToPlaylist.module.css";

export default function ButtonAddToPlaylist({ onSuccess, className = "", variant = "" }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("Nuova Playlist");

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (showModal && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [showModal]);

  const createPlaylist = async (playlistName) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const profileRes = await fetch("/api/spotify/get-user-profile");
      if (!profileRes.ok) {
        const err = await profileRes.json().catch(() => ({}));
        throw new Error(err.error || "Impossibile ottenere il profilo utente");
      }
      const profile = await profileRes.json();
      const userId = profile?.id;
      if (!userId) throw new Error("User id non trovato");

      const body = {
        user_id: userId,
        name: playlistName || "Nuova Playlist",
        description: "Playlist creata tramite l'app",
        public: false,
      };

      const res = await fetch("/api/playlists/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Errore nella creazione della playlist");
      }

      const data = await res.json();
      setMessage("Playlist creata con successo");
      if (onSuccess) onSuccess(data);
      console.log("Playlist creata:", data);
      setShowModal(false);
      setName("Nuova Playlist");
    } catch (err) {
      setError(err.message || "Errore sconosciuto");
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 3000);
    }
  };
  return (
    <div ref={wrapperRef} className={`${styles.wrapper} ${className}`} data-variant={variant}>
      <button
        className={styles.button}
        aria-haspopup="menu"
        aria-expanded={showMenu}
        aria-label="Aggiungi"
        onClick={(e) => {
          e.preventDefault();
          setShowMenu((s) => !s);
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" className={styles.icon} aria-hidden>
          <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {showMenu && (
        <div className={styles.menu} role="menu">
          <button
            className={styles.menuItem}
            onClick={() => {
              setShowModal(true);
              setShowMenu(false);
            }}
          >
            <span className={styles.menuIcon} aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M5 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <div className={styles.menuTitle}>Playlist</div>
              <div className={styles.menuDesc}>Crea una playlist con brani o episodi</div>
            </div>
          </button>

          <button className={styles.menuItem} onClick={() => { setShowMenu(false); }}>
            <span className={styles.menuIcon} aria-hidden>
              {/*menu a tendina di trishi*/}
              {/* <button className={styles.menuItem} onClick={() => { setShowMenu(false); }}>
            <span className={styles.menuIcon} aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <div>
              <div className={styles.menuTitle}>Cartella</div>
              <div className={styles.menuDesc}>Organizza le tue playlist</div>
            </div>
          </button> */}
              {/* <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 7h4a4 4 0 0 1 4 4v0a4 4 0 0 0 4 4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 17v4h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg> */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                <path d="M20 17v4h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
              </svg>
            </span>
            <div>
              <div className={styles.menuTitle}>Brani piaciuti</div>
              <div className={styles.menuDesc}>clicca qui per aggiungere il brano ascoltato</div>
            </div>
          </button>
        </div>
      )}

      {showModal && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Crea playlist</h3>
            </div>
            <div className={styles.modalBody}>
              <input
                ref={inputRef}
                className={styles.textInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') createPlaylist(name); }}
                aria-label="Nome playlist"
              />
              <p className={styles.hint}>La playlist sarà privata per impostazione predefinita.</p>
              {error && <div className={styles.error}>{error}</div>}
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancel} onClick={() => setShowModal(false)} disabled={loading}>Annulla</button>
              <button className={styles.confirm} onClick={() => createPlaylist(name)} disabled={loading}>{loading ? 'Creazione...' : 'Crea playlist'}</button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.feedback} aria-live="polite">
        {message && <span className={styles.success}>{message}</span>}
        {error && <span className={styles.error}>{error}</span>}
      </div>
    </div>
  );
}



