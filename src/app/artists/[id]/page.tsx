import { cookies, headers } from 'next/headers';
import ArtistHero from 'components/artists/ArtistHero';

import Link from 'next/link';

const getArtist = async (id) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/artist/${id}`, {
    cache: 'no-store',
    headers: {
      'Cookie': (await cookies()).toString(),
    }
  });
  const data = await res.json();
  return data;
}

export default async function page({ params }: { params: { id: string } }) {
  const id = await params.id;
  const a = await getArtist(id);
  console.log(a);
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <p>pagin artisti</p>
      <ArtistHero name="jjj" listeners={90} image={''} spotifyUrl={''}  />
    </main>
  );
}
