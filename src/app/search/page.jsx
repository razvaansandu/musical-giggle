"use client";

import { useState } from "react";

export default function SearchTestPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault(); 
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]); 

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore nella ricerca");
      setResults(data.results);
    } catch (err) { 
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        {results.map((track) => (
          <div
            key={track.id}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
          > 
          <div className="searchConteiner"> 
            {track.image && (
              <img
                src={track.image} 
                alt={track.name}
                className="w-full h-48 object-cover"
              />
            )} 
            <div className="p-4">
              <h2 className="font-semibold text-lg">{track.name}</h2>
              <p className="text-gray-600">{track.artists}</p>
              <p className="text-sm text-gray-500">{track.album}</p>
              {track.preview_url && (
                <audio controls src={track.preview_url} className="mt-2 w-full" />
              )}
              <a
                href={track.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-green-600 font-medium hover:underline"
              >
                Apri su Spotify →
              </a>
            </div>
          </div> 
          </div> 
        ))}
      </div>
    </main>
  );
} 
