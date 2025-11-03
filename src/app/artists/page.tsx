import { cookies, headers } from 'next/headers';
import Link from 'next/link';

const getTopArtists = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/artist`, {
    cache: 'no-store',
    headers: {
      'Cookie': (await cookies()).toString(),
    }
  });
  const data = await res.json();
  return data;
}

export default async function page() {
  const a = await getTopArtists();
  console.log(a);
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <p>pagin artisti</p>
      <Link href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
        Vai alla home
      </Link>
    </main>
  );
}
