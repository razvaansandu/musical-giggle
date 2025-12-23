import { useState, useCallback } from "react";

export const useSpotifyFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWithRetry = useCallback(async (url, options = {}) => {
    const controller = new AbortController();
    const { retries = 3, delay = 1000, signal } = options;

    try {
      const res = await fetch(url, { 
        signal: signal || controller.signal,
        ...options 
      });

      if (res.status === 429 && retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        controller.abort();
        return fetchWithRetry(url, { 
          ...options, 
          retries: retries - 1, 
          delay: delay * 2 
        });
      }

      if (res.status === 401) {
        setError("Sessione scaduta. Ricarica la pagina.");
        return null;
      }

      return res;
    } catch (err) {
      if (err.name === 'AbortError') return null;
      throw err;
    }
  }, []);

  const spotifyFetch = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const url = `/api${endpoint}`;
      const res = await fetchWithRetry(url, options);
      
      if (!res || !res.ok) {
        throw new Error(`Errore ${res?.status || 'unknown'}`);
      }

      const data = await res.json();
      
      await new Promise(r => setTimeout(r, 100));
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWithRetry]);

  return {
    loading,
    error,
    spotifyFetch,
    fetchWithRetry
  };
};
