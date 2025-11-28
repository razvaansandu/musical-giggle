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

  const wrapperRef = useRef(null);
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  /* ✅ CLICK FUORI: chiude SOLO il menu */
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
      setShowMenu(false); // ✅ mai menu + modal insieme
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  }, [showModal]);

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
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore");

      onSuccess?.(data);
      setShowModal(false);
      setName("Nuova Playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ BOTTONE */}
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

      {/* ✅ MENU (Portal) */}
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

      {/* ✅ MODAL (Portal, CENTRATO) */}
      {showModal &&
        createPortal(
          <div className={styles.modalBackdrop}>
            <div className={styles.modal}>
              <h3>Crea playlist</h3>
              <input
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && createPlaylist()
                }
              />
              <div className={styles.modalActions}>
                <button onClick={() => setShowModal(false)}>
                  Annulla
                </button>
                <button onClick={createPlaylist} disabled={loading}>
                  {loading ? "Creazione..." : "Crea"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
