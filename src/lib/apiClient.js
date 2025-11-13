export const api = {
  home: {
    async get() {
      const res = await fetch("/api/home");
      if (!res.ok) throw new Error("Errore API /home");
      return res.json();
    }
  },

  search: {
    async query(q) {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error("Errore API /search");
      return res.json();
    }
  },

  albums: {
    async get(id) {
      const res = await fetch(`/api/albums/${id}`);
      if (!res.ok) throw new Error("Errore API album");
      return res.json();
    }
  },

  player: {
    async getPlayback() {
      const res = await fetch("/api/player/current");
      if (!res.ok) throw new Error("Errore API player/current");
      return res.json();
    },

    async play(uri) {
      const res = await fetch("/api/player/play", {
        method: "POST",
        body: JSON.stringify({ uris: [uri] })
      });
      if (!res.ok) throw new Error("Errore API player/play");
      return res.json();
    }
  },

  categories: {
    async list() {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Errore API categories");
      return res.json();
    }
  },

  recommendations: {
    async byGenre(genre) {
      const res = await fetch(`/api/recommendations?genre=${genre}`);
      if (!res.ok) throw new Error("Errore API recommendations");
      return res.json();
    }
  }
};
/* Usage Example:
COME SI USA NEL FRONTEND (1 RIGA DI CODICE)
Esempio per la HOME:import { api } from "@/lib/apiClient";

useEffect(() => {
  api.home.get().then(data => {
    setRecently(data.recentlyPlayed);
    setDailyMix(data.dailyMix);
  });
}, []);

esempio search:
const results = await api.search.query("noyz narcos");

esempio album:
const album = await api.albums.get("4JAvwK4APPArjIsOdGoJXX");
*/