import { useEffect, useState, useCallback } from "react";

export function useSessionManager() {
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  // Funzione per controllare se il token è valido
  const checkTokenValidity = useCallback(async () => {
    try {
      const response = await fetch("/api/player/get-playback-state");
      
      // Se ricevi 401, il token è scaduto
      if (response.status === 401) {
        setIsSessionExpired(true);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error("Errore nel controllo del token:", err);
      return false;
    }
  }, []);

  // Intercetta le risposte 401 globalmente
  useEffect(() => {
    const originalFetch = window.fetch;

    // Override globale di fetch per intercettare 401
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      // Se la risposta è 401, significa che il token è scaduto
      if (response.status === 401) {
        // Clona la risposta per leggerla senza consumarla
        const clonedResponse = response.clone();
        
        // Controlla se è un errore di autenticazione reale
        try {
          const data = await clonedResponse.json();
          if (data.error === "Not authenticated" || data.error?.includes("token")) {
            setIsSessionExpired(true);
          }
        } catch {
          // Se non riesce a fare il parse JSON, considera comunque scaduta
          setIsSessionExpired(true);
        }
      }

      return response;
    };

    return () => {
      // Ripristina il fetch originale
      window.fetch = originalFetch;
    };
  }, []);

  const resetSessionExpired = useCallback(() => {
    setIsSessionExpired(false);
  }, []);

  const setSessionExpired = useCallback(() => {
    setIsSessionExpired(true);
  }, []);

  return {
    isSessionExpired,
    resetSessionExpired,
    setSessionExpired,
    checkTokenValidity,
  };
}
