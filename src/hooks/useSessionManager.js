import { useEffect, useState, useCallback } from "react";

export function useSessionManager() {
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const checkTokenValidity = useCallback(async () => {
    try {
      const response = await fetch("/api/player/get-playback-state");
      
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

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      if (response.status === 401) {
        const clonedResponse = response.clone();
        
        try {
          const data = await clonedResponse.json();
          if (data.error === "Not authenticated" || data.error?.includes("token")) {
            setIsSessionExpired(true);
          }
        } catch {
          setIsSessionExpired(true);
        }
      }

      return response;
    };

    return () => {
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
