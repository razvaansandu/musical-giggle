import Link from 'next/link';

export default async function page() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <p>pagina artisti</p>
      <Link href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
        Vai alla home
      </Link>
    </main>
  );
}
