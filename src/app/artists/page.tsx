import Link from 'next/link';
import Image from 'next/image';

export default function PageNotFound() {
  return (
    <main style={{
      backgroundColor: '#000',
      color: '#fff',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      padding: '2rem'
    }}>
      {/* Logo Spotify */}
      <Image
        src="/Spotify_Primary_Logo_RGB_Green.png" // Assicurati di avere questo file in /public
        alt="Spotify Logo"
        width={120}
        height={120}
        style={{ marginBottom: '2rem' }}
      />

      {/* Messaggio di errore */}
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Pagina non trovata</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        Non riusciamo a trovare la pagina che cerchi.
      </p>

      {/* Pulsanti */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/login">
          <button style={buttonStyle}>Home</button>
        </Link>
        <Link href="/assistenza">
          <button style={buttonStyle}>Assistenza</button>
        </Link>
      </div>
    </main>
  );
}

const buttonStyle = {
  backgroundColor: '#1DB954',
  color: '#fff',
  border: 'none',
  padding: '0.75rem 1.5rem',
  borderRadius: '999px',
  fontSize: '1rem',
  cursor: 'pointer'
};
