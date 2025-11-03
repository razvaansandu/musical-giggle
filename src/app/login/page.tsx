'use client';
import LoginPage from "../../components/Login/loginPage";

export default function HomePage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🎵 Musical Giggle</h1>
      <p>Benvenuto nella tua app musicale Next.js!</p>
      <LoginPage />

    </main>
  );
}
