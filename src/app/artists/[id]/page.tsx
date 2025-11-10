import { cookies } from 'next/headers';
import ArtistHero from 'components/artists/ArtistHero';
import Link from 'next/link';
import Image from 'next/image';

const getArtist = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/artist/${id}`, {
    cache: 'no-store',
    headers: {
      'Cookie': (await cookies()).toString(),
    },
  });
  return await res.json();
};

const getTopTracks = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/artist/${id}/top-tracks`, {
    cache: 'no-store',
    headers: {
      'Cookie': (await cookies()).toString(),
    },
  });
  const data = await res.json();
  return data.tracks;
};

export default async function page({ params }: { params: { id: string } }) {
  const id = params.id;
  const artist = await getArtist(id);
  const topTracks = await getTopTracks(id);

  const name = artist?.name || 'Artista sconosciuto';
  const listeners = artist?.followers?.total || 0;
  const image = artist?.images?.[0]?.url || '/default-artist.jpg';
  const spotifyUrl = artist?.external_urls?.spotify || '#';

  return (
    <main style={{ fontFamily: 'sans-serif', backgroundColor: '#121212', color: 'white', padding: '2rem' }}>
      {/* Hero artista */}
      <ArtistHero
        name={name}
        listeners={listeners}
        image={image}
        spotifyUrl={spotifyUrl}
      />

      {/* Sezione Top Tracks */}
      <section>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Popolari</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {topTracks?.length > 0 ? (
            topTracks.map((track: any, index: number) => (
              <li
                key={track.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  backgroundColor: '#1e1e1e',
                  padding: '0.5rem',
                  borderRadius: '8px',
                }}
              >
                <span style={{ width: '2rem', fontWeight: 'bold' }}>{index + 1}</span>
                <Image
                  src={track.album.images?.[0]?.url || '/default-track.jpg'}
                  alt={track.name}
                  width={50}
                  height={50}
                  style={{ borderRadius: '4px', marginRight: '1rem' }}
                />
                <div style={{ flexGrow: 1 }}>
                  <p style={{ margin: 0 }}>{track.name}</p>
                  <small>{track.popularity}% popolarità</small>
                </div>
                <Link href={track.external_urls.spotify} target="_blank" style={{ color: '#1DB954' }}>
                   Ascolta
                </Link>
              </li>
            ))
          ) : (
            <p>Top tracks non disponibili.</p>
          )}
        </ul>
      </section>
    </main>
  );
}
