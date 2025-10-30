'use client';

import { useEffect, useState } from 'react';

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
}

export default function ArtistPage({ params }: { params: { id: string } }) {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!params?.id) return;

    const fetchArtist = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/artists/${params.id}`);

        if (!res.ok) throw new Error('Errore nella risposta API');

        const data = await res.json();
        setArtist(data);
      } catch (err: any) {
        setError(err.message || 'Errore sconosciuto');
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [params.id]);

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p style={{ color: 'red' }}>Errore: {error}</p>;
  if (!artist) return <p>Nessun dato trovato.</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>{artist.name}</h1>

      {artist.images?.[0] && (
        <img
          src={artist.images[0].url}
          alt={artist.name}
          width={300}
          style={{ borderRadius: '10px', marginTop: '1rem' }}
        />
      )}
    </div>
  );
}
