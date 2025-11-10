import { cookies, headers } from 'next/headers';
import Link from 'next/link';

export default async function page() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <p>pagin artisti</p>
      <Link href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
        Vai alla home
      </Link>  
    </main>
  );
}
