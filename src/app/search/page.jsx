"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SearchTestPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function performSearch(q) {
    if (!q || !q.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore nella ricerca");

      // Normalize possible Spotify search shapes: tracks/albums/artists/playlists
      let items = [];
      if (Array.isArray(data.results)) items = data.results;
      else if (data.tracks && Array.isArray(data.tracks.items)) items = data.tracks.items;
      else if (data.albums && Array.isArray(data.albums.items)) items = data.albums.items;
      else if (data.artists && Array.isArray(data.artists.items)) items = data.artists.items;
      else if (data.playlists && Array.isArray(data.playlists.items)) items = data.playlists.items;
      else if (Array.isArray(data.items)) items = data.items;
      else if (data.items && Array.isArray(data.items.items)) items = data.items.items; // defensive

      setResults(items || []);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = async (e) => {
    e && e.preventDefault();
    await performSearch(query);
  };

  // when the page loads with ?q=..., auto-run the search
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      performSearch(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">🎧 Cerca su Spotify</h1>

      <form onSubmit={handleSearch} className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Cerca un artista o una canzone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-300 rounded-l-lg px-4 py-2 w-80 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600"
        >
          Cerca
        </button>
      </form>

      {loading && <p className="text-center">⏳ Ricerca in corso...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((track) => {
          // helper formatters to avoid rendering [object Object]
          const formatArtists = (a) => {
            if (!a) return "";
            if (Array.isArray(a)) return a.map((it) => (it && (it.name || it)) || "").join(", ");
            if (typeof a === "object") return a.name || JSON.stringify(a);
            return String(a);
          };

          const formatAlbum = (al) => {
            if (!al) return "";
            if (typeof al === "string") return al;
            if (Array.isArray(al)) return al.map((it) => it.name || it).join(", ");
            if (typeof al === "object") return al.name || JSON.stringify(al);
            return String(al);
          };

          const resolveImage = (img) => {
            if (!img) return null;
            // possible shapes: string URL, { url }, [ { url } ], images: [..]
            if (typeof img === "string") return img;
            if (img.url) return img.url;
            if (Array.isArray(img) && img[0] && img[0].url) return img[0].url;
            if (track.images && Array.isArray(track.images) && track.images[0]) return track.images[0].url;
            return null;
          };

          const imageUrl = resolveImage(track.image);

          return (
            <div
              key={track.id || track.uri || Math.random()}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <div className="searchConteiner">
                {imageUrl ? (
                  <img src={imageUrl} alt={track.name} className="w-full h-48 object-cover" />
                ) : null}
                <div className="p-4">
                  <h2 className="font-semibold text-lg">{track.name}</h2>
                  <p className="text-gray-600">{formatArtists(track.artists)}</p>
                  <p className="text-sm text-gray-500">{formatAlbum(track.album)}</p>
                  {track.preview_url && (
                    <audio controls src={track.preview_url} className="mt-2 w-full" />
                  )}
                  {track.external_url && (
                    <a
                      href={track.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-green-600 font-medium hover:underline"
                    >
                      Apri su Spotify →
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
