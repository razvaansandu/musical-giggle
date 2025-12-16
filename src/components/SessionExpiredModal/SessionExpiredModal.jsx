"use client";

import { useEffect, useState } from "react";
import styles from "./SessionExpiredModal.module.css";
import { LogOut } from "lucide-react";

export default function SessionExpiredModal({ isOpen, onRelogin }) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleRelogin = async () => {
    try {
      // Effettua il logout
      await fetch("/api/auth/logout", { method: "POST" });
      
      // Reindirizza a login
      window.location.href = "/login";
    } catch (err) {
      console.error("Errore durante il re-login:", err);
      window.location.href = "/login";
    }
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.blurBackground} />
      <div className={styles.modalContainer}>
        <div className={styles.modal}>
          <div className={styles.iconWrapper}>
            <LogOut size={48} />
          </div>

          <h1 className={styles.title}>Sessione Scaduta</h1>
          
          <p className={styles.message}>
            La tua sessione è scaduta. Per continuare ad ascoltare la tua musica, 
            effettua di nuovo l'accesso.
          </p>

          <button 
            className={styles.reloginButton}
            onClick={handleRelogin}
          >
            Accedi di Nuovo
          </button>

          <p className={styles.subtitle}>
            Ti reindirizzeremo alla pagina di login.
          </p>
        </div>
      </div>
    </div>
  );
}
