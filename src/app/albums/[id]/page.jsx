// app/album/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";

export default function AlbumPage({ params }) {
  const { id } = params;
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlbum() {
      try {
        const res = await fetch(`/album/${id}`); // chiama la tua route.js
        const data = await res.json();
        setAlbum(data);
      } catch (err) {
        console.error("Errore nel fetch album:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAlbum();
  }, [id]);

  if (loading) return <p>Caricamento...</p>;
  if (!album) return <p>Album non trovato</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>{album.name}</h1>
      <p><strong>Artista:</strong> {album.artist}</p>
      <p><strong>Data di uscita:</strong> {album.release_date}</p>
      <p><strong>Numero tracce:</strong> {album.total_tracks}</p>
      {album.image && (
        <img src={album.image} alt={album.name} style={{ width: "100%", borderRadius: "8px" }} />
      )}
      <h2>Tracce</h2>
      <ul>
        {album.tracks.map((track, index) => (
          <li key={index}>
            {track.name} – {(track.duration_ms / 60000).toFixed(2)} min
          </li>
        ))}
      </ul>
      <a href={album.url} target="_blank" rel="noopener noreferrer">
        Apri su Spotify
      </a>
    </div>
  );
}
 