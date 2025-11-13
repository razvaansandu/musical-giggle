// src/components/SearchBar.jsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // per redirect alla home
import "./SearchBar.css";
 
export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const router = useRouter();

  // 🔹 ricerca live mentre scrivi
  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    } 

    setLoading(true); 
    setError(null); 

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Errore nella ricerca");
      setResults(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }; 

  // 🔹 quando premi invio → redirect alla home
<<<<<<< Updated upstream
const handleSearch = (e) => {
=======
const handleSearch = (e) => { 
  console.log(data.results); 
>>>>>>> Stashed changes
  e.preventDefault();
  if (!query.trim()) return;

  // porta direttamente alla pagina app/search/page.jsx
  router.push(`/search?q=${encodeURIComponent(query)}&type=album`);
};
 
 

  return (
  <div className="search-wrapper">
    <form className="search-bar" onSubmit={handleSearch} role="search" aria-label="Cerca brani artisti album">
      <button
        type="submit"
        className="search-icon-btn"
        aria-label="Cerca"
        title="Cerca"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
          className="bi bi-search" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85
            3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12
            6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
        </svg>
      </button>

      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Cosa vuoi ascoltare?"
        className="search-input"
        aria-label="Termine di ricerca"
      />
    </form>

    {error && <div className="search-error" role="alert">{error}</div>}
    {loading && <div className="search-loading"></div>}

    {results.length > 0 && (
      <div className="risultati">
        {results.map((track) => (
          <div
            key={track.id}
            className="result-card"
            onClick={() => window.open(track.external_url, "_blank")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && window.open(track.external_url, "_blank")}
          >
            {track.image ? (
              <img src={track.image} alt={track.name} className="result-image" />
            ) : (
              <div className="result-image placeholder" />
            )}

            <div className="result-meta">
              <div className="result-title">{track.name}</div>
              <div className="result-artists">{track.artists}</div>
              <div className="result-album">{track.album}</div>
            </div>

            <button
              className="result-action"
              onClick={(e) => {
                e.stopPropagation();
                window.open(track.external_url, "_blank");
              }}
              aria-label={`Apri ${track.name} su Spotify`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
); 
} 