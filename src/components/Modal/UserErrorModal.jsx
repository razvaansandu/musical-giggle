"use client";

import { useState } from "react";
import styles from "./UserErrorModal.module.css";

export default function UserErrorModal({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRelogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", { method: "POST" });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Errore nel relogin:", error);
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Blur Overlay */}
      <div className={styles.overlay} onClick={onClose}></div>

      {/* Modal */}
      <div className={styles.modal}>
        <div className={styles.content}>
          <h2 className={styles.title}>Sessione Scaduta</h2>
          <p className={styles.message}>
            La tua sessione è scaduta. Ti preghiamo di rieffettuare il login con il tuo account Spotify.
          </p>
          
          <button
            className={styles.button}
            onClick={handleRelogin}
            disabled={isLoading}
          >
            {isLoading ? "Reindirizzamento..." : "Accedi a Spotify"}
          </button>
        </div>
      </div>
    </>
  );
}
