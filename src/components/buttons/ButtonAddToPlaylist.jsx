"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./ButtonAddToPlaylist.module.css";

export default function ButtonAddToPlaylist({
  onSuccess,
  className = "",
  variant = "",
}) {
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("Nuova Playlist");
  const [image, setImage] = useState(null);

  const wrapperRef = useRef(null);
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!showMenu) return;

    function onDocClick(e) {
      if (
        wrapperRef.current?.contains(e.target) ||
        menuRef.current?.contains(e.target)
      ) {
        return;
      }
      setShowMenu(false);
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [showMenu]);

  useEffect(() => {
    if (showModal) {
      setShowMenu(false); 
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  }, [showModal]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const createPlaylist = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/playlists/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: "Playlist creata tramite l'app",
          public: false,
          image
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore");

      onSuccess?.(data);
      setShowModal(false);
      setName("Nuova Playlist");
      setImage(null);
    } catch (err) {
      console.error("Failed to create playlist:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        ref={wrapperRef}
        className={`${styles.wrapper} ${className}`}
        data-variant={variant}
      >
        <button
          className={styles.button}
          onClick={() => setShowMenu((s) => !s)}
          aria-haspopup="menu"
          aria-expanded={showMenu}
        >
          +
        </button>
      </div>

      {showMenu &&
        createPortal(
          <div
            ref={menuRef}
            className={styles.menu}
            style={{
              position: "fixed",
              top:
                wrapperRef.current?.getBoundingClientRect().bottom + 6,
              left:
                wrapperRef.current?.getBoundingClientRect().left,
              zIndex: 9999,
            }}
          >
            <button
              className={styles.menuItem}
              onClick={() => setShowModal(true)}
            >
              Playlist
            </button>
            <button className={styles.menuItem}>Blend</button>
            <button className={styles.menuItem}>Cartella</button>
          </div>,
          document.body
        )}

      <button
        className={styles.menuItem}
        onClick={() => {
          setShowMenu(false);
        }}
      >
        <span className={styles.menuIcon} aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-heart"
            viewBox="0 0 16 16"
          >
            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
          </svg>
        </span>
        <div>
          <div className={styles.menuTitle}>Brani piaciuti</div>
          <div className={styles.menuDesc}>
            clicca qui per aggiungere il brano ascoltato
          </div>
        </div>
      </button>

      {showModal &&
        createPortal(
          <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h3>Crea playlist</h3>
                <input
                  ref={inputRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && createPlaylist()
                  }
                  placeholder="Nome playlist"
                />
                <input
                  type="file"
                  accept="image/jpeg"
                  onChange={handleImageChange}
                  style={{ marginTop: "10px", display: "block" }}
                />
                {image && (
                  <img 
                    src={image} 
                    alt="Preview" 
                    style={{ 
                      width: "100px", 
                      height: "100px", 
                      objectFit: "cover", 
                      marginTop: "10px",
                      borderRadius: "4px"
                    }} 
                  />
                )}
                <div className={styles.modalActions}>
                  <button onClick={() => setShowModal(false)}>
                    Annulla
                  </button>
                  <button onClick={createPlaylist} disabled={loading}>
                    {loading ? "Creazione..." : "Crea"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
