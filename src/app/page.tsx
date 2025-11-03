'use client';

import Link from 'next/link';

export default async function HomePage() {
  // const topArtists = await getTopArtists()

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🎵 Musical Giggle</h1>
      <p>Benvenuto nella tua app musicale Next.js!</p>
      <Link href="/artists" style={{ color: 'blue', textDecoration: 'underline' }}>
        Vai alla pagina di arti
      </Link>
    </main>
  );
}
